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


  // createManager: catchAsync(async (req, res) => {
  //   const payload = req.body;
  //   const userId = req.userId;
  //   const user1 = User.findById(userId);
  //   if (user1["role"] != "Admin") {
  //     throw new appError(ErrorMessage.INVALID_TOKEN, ErrorCode.NOT_ALLOWED);
  //   }
  //   const { first_name, last_name, email, mobile_number, role } = payload;

  //   const user = await User.findOne({ email: req.body.email });
  //   if (user) {
  //     throw new appError(ErrorMessage.ALREADY_EXIST, ErrorCode.ALREADY_EXIST);
  //   }

  //   const empId = await commonFunction.generateEmployeeId(role);
  //   const pass = await commonFunction.generatePassword();
  //   payload["employee_id"] = empId;
  //   payload["password"] = pass;

  //   const createManager = await User.create(payload);

  //   helper.sendResponseWithData(
  //     res,
  //     SuccessCode.SUCCESS,
  //     SuccessMessage.CREATE_MANAGER,
  //     createManager
  //   );
  // }),
};
