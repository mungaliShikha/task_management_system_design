const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/errorHandlers/errorHandler");
const { ErrorMessage, SuccessMessage } = require("../helper/message");
const { ErrorCode, SuccessCode } = require("../helper/statusCode");
const {
  compareHash,
  generateToken,
  generatePassword,
  randomPassword,
  generateHash,
} = require("../helper/commonFunction");
const helper = require("../helper/commonResponseHandler");
const {
  sendMail,
  sendMailNotify,
} = require("../services/nodeMailer/nodemailer");

const bcrypt = require("bcryptjs");

module.exports = {
  loginDeveloper: async (req, res) => {
    const { email, password } = req.body;
    const loggedInUser = await User.findOne({ email });
    if (!loggedInUser || !compareHash(password, loggedInUser.password)) {
      throw new appError(
        ErrorMessage.EMAIL_NOT_REGISTERED,
        ErrorCode.NOT_FOUND
      );
    } else {
      helper.sendResponseWithData(
        res,
        SuccessCode.SUCCESS,
        SuccessMessage.LOGIN_SUCCESS,
        loggedInUser,
        generateToken({ email })
      );
    }
  },

  addDeveloper: catchAsync(async (req, res) => {
    let { email, mobile_number } = req.body;
    const userExistRes = await User.findOne({ email });
    if (userExistRes) {
      throw new appError(ErrorMessage.EMAIL_EXIST, ErrorCode.NOT_FOUND);
    }
    let passGen = randomPassword();
    req.body.password = generateHash(passGen);

    req.body.employee_id = "DEV" + mobile_number.substr(-4);
    req.body.role = "Developer";

    // await sendMailNotify("shikha1081998@gmail.com", req.body.email, "Developer Invitation", `Your account is successfully created eamil:${req.body.email} and Password: ${req.body.password}`)
    // console.log("checkMail==", checkMail)

    let finalRes = await User.create(req.body);
    helper.commonResponse(
      res,
      SuccessCode.SUCCESS,
      finalRes,
      SuccessMessage.DEVELOPER_ADD
    );
  }),

  listDeveloper: catchAsync(async (req, res) => {
    let developerList = await User.find({ role: "Developer" });
    if (developerList.length == 0) {
      throw new appError(ErrorMessage.DATA_NOT_FOUND, ErrorCode.NOT_FOUND);
    }

    helper.commonResponse(
      res,
      SuccessCode.SUCCESS,
      developerList,
      SuccessMessage.DATA_FOUND
    );
  }),

  viewDeveloper: catchAsync(async (req, res) => {
    let viewParticularDev = await User.findOne({
      _id: req.query._id,
      role: "Developer",
    });
    if (!viewParticularDev) {
      throw new appError(ErrorMessage.DATA_NOT_FOUND, ErrorCode.NOT_FOUND);
    }
    helper.commonResponse(
      res,
      SuccessCode.SUCCESS,
      viewParticularDev,
      SuccessMessage.DATA_FOUND
    );
  }),
};




module.exports = {

  loginManager: catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const loggedInUser = await User.findOne({ email });
    if (!loggedInUser || !compareHash(password, loggedInUser.password)) {
      if (
        !loggedInUser ||
        !commonFunction.compareHash(password, loggedInUser.password)
      ) {
        throw new appError(
          ErrorMessage.EMAIL_NOT_REGISTERED,
          ErrorCode.NOT_FOUND
        );
      } else {
        helper.sendResponseWithData(
          res,
          SuccessCode.SUCCESS,
          SuccessMessage.LOGIN_SUCCESS,
          loggedInUser,
          generateToken({ email })
        );
        helper.sendResponseWithData(
          res,
          SuccessCode.SUCCESS,
          SuccessMessage.LOGIN_SUCCESS,
          loggedInUser,
          commonFunction.generateToken({ email })
        );
      }
    }
  }),


  createManager: catchAsync(async (req, res) => {
    const payload = req.body;
    const userId = req.userId;
    const user1 = User.findById(userId);
    if (user1["role"] != "Admin") {
      throw new appError(ErrorMessage.INVALID_TOKEN, ErrorCode.NOT_ALLOWED);
    }
    const { first_name, last_name, email, mobile_number, role } = payload;

    const user = await User.findOne({ email: req.body.email });
    if (user) {
      throw new appError(ErrorMessage.ALREADY_EXIST, ErrorCode.ALREADY_EXIST);
    }

    const empId = await commonFunction.generateEmployeeId(role);
    const pass = await commonFunction.generatePassword();
    payload["employee_id"] = empId;
    payload["password"] = pass;

    const createManager = await User.create(payload);

    helper.sendResponseWithData(
      res,
      SuccessCode.SUCCESS,
      SuccessMessage.CREATE_MANAGER,
      createManager
    );
  }),
};
