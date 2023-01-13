const User = require("../models/user.model");
const Token = require("../models/token.model");
const catchAsync = require("../utils/catchAsync");
const { upload } = require("../services/aws/aws");
const crypto = require("crypto");
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
  login: catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const loggedInUser = await User.findOne({ email });
    if (!loggedInUser || !compareHash(password, loggedInUser.password)) {
      throw new appError(ErrorMessage.EMAIL_NOT_REGISTERED, ErrorCode.NOT_FOUND);
    } else {
      let token = generateToken({ id: loggedInUser._id, role: loggedInUser.role })
      let finalRes = {
        userId: loggedInUser._id,
        email: email,
        role: loggedInUser.role,
        first_name: loggedInUser.first_name,
        last_name: loggedInUser.last_name,
        mobile_number: loggedInUser.mobile_number,
        token: token
      }
      helper.sendResponseWithData(res, SuccessCode.SUCCESS, SuccessMessage.LOGIN_SUCCESS, finalRes);
    }
  }),

    forgetPassword: catchAsync(async (req, res) => {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        throw new appError(ErrorMessage.EMAIL_NOT_REGISTERED,ErrorCode.NOT_FOUND);
      }
      var tokenFound = await Token.findOne({ userId: user._id });
      if (!tokenFound) {
        tokenFound = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
      }

      const link = `${global.gFields.db_URL}admin/resetPassword/${user._id}/${tokenFound.token}`;
      const html = `<h1> Password reset requested </h1><h3> Download link </h3><p>${link}</p>`;
      await sendMail(
        global.gFields.nodemailer_mail,
        email,
        "password reset link",
        html
      );

      helper.sendResponseWithoutData(
        res,
        SuccessCode.SUCCESS,
        SuccessMessage.EMAIL_SEND
      );
    }),

    resetPassword: catchAsync(async (req, res) => {
      const { userId, token } = req.params;
      const { password } = req.body;
      const user = await User.findById(userId);
      if (!user) {
        throw new appError(
          ErrorMessage.EMAIL_NOT_REGISTERED,
          ErrorCode.NOT_FOUND
        );
      }

      const tokenFound = await Token.findOne({
        userId: user._id,
        token: token,
      });
      if (!tokenFound) {
        throw new appError(ErrorMessage.LINK_EXPIRED, ErrorCode.BAD_REQUEST);
      }

      user.password = generateHash(password);
      await user.save();
      await tokenFound.delete();

      helper.sendResponseWithoutData(
        res,
        SuccessCode.SUCCESS,
        SuccessMessage.RESET_SUCCESS
      );
    }),

    updateAdmin: catchAsync(async (req, res) => {
      const { first_name, last_name, email, mobile_number, address } = req.body;
      const { userId } = req.params;
      let data = {};

      const user = await User.findById(userId);
      if (!user) {
        throw new appError(ErrorMessage.USER_NOT_FOUND, ErrorCode.NOT_FOUND);
      }
      if (first_name) {
        data["first_name"] = first_name;
      }
      if (last_name) {
        data["last_name"] = last_name;
      }
      if (email) {
        data["email"] = email;
      }
      if (mobile_number) {
        data["mobile_number"] = mobile_number;
      }
      if (address) {
        data["address"] = address;
      }
      if (req.files) {
        data["profile_image"] = req.files[0].location;
      }

      let update = await User.findOneAndUpdate({ _id: userId }, data, { new: true })
      helper.commonResponse(res, SuccessCode.SUCCESS, update, SuccessMessage.PROFILE_DETAILS);

    }),

    getAdmin: catchAsync(async (req, res) => {
      const { userId } = req.params;
      const userData = await User.findById(userId);
      if (!userData) {
        throw new appError(ErrorMessage.USER_NOT_FOUND, ErrorCode.NOT_FOUND);
      }
      helper.commonResponse(res, SuccessCode.SUCCESS, userData, SuccessMessage.DETAIL_GET);
    }),

    loginDeveloper: async (req, res) => {
      const { email, password } = req.body;
      const loggedInUser = await User.findOne({ email });
      if (!loggedInUser || !compareHash(password, loggedInUser.password)) {
        throw new appError(
          ErrorMessage.EMAIL_NOT_REGISTERED,
          ErrorCode.NOT_FOUND
        );
      } else {
        let token = generateToken({
          id: loggedInUser._id,
          role: loggedInUser.role,
        });
        let finalRes = {
          userId: loggedInUser._id,
          email: email,
          role: loggedInUser.role,
          first_name: loggedInUser.first_name,
          last_name: loggedInUser.last_name,
          mobile_number: loggedInUser.mobile_number,
          token: token,
        };
        helper.sendResponseWithData(res,SuccessCode.SUCCESS,SuccessMessage.LOGIN_SUCCESS,finalRes);
      }
    },

    addDeveloper: catchAsync(async (req, res) => {
      let { email, mobile_number } = req.body;
      let { userId } = req.params;
      const adminAuthCheck = await User.findById(userId);
      if (adminAuthCheck && adminAuthCheck.role != "Manager") {
        throw new appError(ErrorMessage.INVALID_TOKEN, ErrorCode.NOT_ALLOWED);
      }
      else if (!adminAuthCheck) {
        throw new appError(ErrorMessage.USER_NOT_FOUND, ErrorCode.NOT_FOUND);
      }
      let managerEmail = adminAuthCheck.email;
      const userExistRes = await User.findOne({ email });
      if (userExistRes) {
        throw new appError(ErrorMessage.EMAIL_EXIST, ErrorCode.NOT_FOUND);
      }
      let passGen = randomPassword();
      req.body.password = generateHash(passGen);
      if (req.files) {
        req.body["profile_image"] = req.files[0].location;
      }
      req.body.employee_id = "DEV" + mobile_number.substr(-4);
      req.body.role = "Developer";
      req.body.userId = adminAuthCheck._id;

      let subject = "Developer Invitation";
      let message = `Your account is successfully created as A Developer on Our plateform <br> Kindly Use this Credentials for Login <br> email:${req.body.email} <br> Password: ${passGen}`;

      await sendMailNotify(managerEmail, subject, message, email);

      let finalRes = await User.create(req.body);
      helper.commonResponse(
        res,
        SuccessCode.SUCCESS,
        finalRes,
        SuccessMessage.DEVELOPER_ADD
      );
    }),

    listDeveloper: catchAsync(async (req, res) => {
      var query = { status: { $ne: "DELETE" }, role: "Developer" };
      if (req.body.search) {
        query.name = new RegExp("^" + req.body.search, "i");
      }
      req.body.limit = parseInt(req.body.limit);
      var options = {
        page: req.body.page || 1,
        limit: req.body.limit || 10,
        sort: { createdAt: -1 },
      };
      let developerList = await User.paginate(query, options);

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

    loginManager: catchAsync(async (req, res) => {
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
        )
      }
    }
    ),

    createManager: catchAsync(async (req, res) => {
      const payload = req.body;
      const { userId } = req.params;
      const user1 = await User.findById(userId);
      if (user1["role"] != "Admin") {
        throw new appError(ErrorMessage.INVALID_TOKEN, ErrorCode.NOT_ALLOWED);
      }
      const { first_name, last_name, email, mobile_number } = payload;

      const user = await User.findOne({ email, mobile_number });
      if (user) {
        throw new appError(ErrorMessage.ALREADY_EXIST, ErrorCode.ALREADY_EXIST);
      }

      if (req.files) {
        payload["profile_image"] = req.files[0].location;
      }

      payload["employee_id"] = "MAN" + mobile_number.substr(-4);
      let passGen = randomPassword();
      console.log(passGen)
      payload["password"] = generateHash(passGen);
      payload["role"] = "Manager";

      const createManager = await User.create(payload);

      helper.sendResponseWithData(
        res,
        SuccessCode.SUCCESS,
        SuccessMessage.CREATE_MANAGER,
        createManager
      );
    }),
};
