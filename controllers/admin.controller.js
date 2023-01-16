const User = require("../models/user.model");
const Token = require("../models/token.model");
const catchAsync = require("../utils/catchAsync");
const { upload } = require("../services/aws/aws");
const crypto = require("crypto");
const appError = require("../utils/errorHandlers/errorHandler");
const { ErrorMessage, SuccessMessage } = require("../helper/message");
const { ErrorCode, SuccessCode } = require("../helper/statusCode");
const { compareHash, generateToken, generatePassword, randomPassword, generateHash } = require("../helper/commonFunction");
const helper = require("../helper/commonResponseHandler");
const { sendMail, sendMailNotify } = require("../services/nodeMailer/nodemailer");

module.exports = {
  /// **********************************   admin login ************************************************
  login: catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const loggedInUser = await User.findOne({ email });
    if (!loggedInUser || !compareHash(password, loggedInUser.password)) {
      throw new appError(ErrorMessage.EMAIL_NOT_REGISTERED, ErrorCode.NOT_FOUND);
    } else {
      let token = generateToken({ id: loggedInUser._id });
      let finalRes = {
        email: email,
        mobile_number: loggedInUser.mobile_number,
        role: loggedInUser.role,
        first_name: loggedInUser.first_name,
        last_name: loggedInUser.last_name,
        token: token
      }
      helper.sendResponseWithData(res, SuccessCode.SUCCESS, SuccessMessage.LOGIN_SUCCESS, finalRes);
    }
  }),

  //************************************ forgetpassword for admin******************************* */

  forgetPassword: catchAsync(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new appError(
        ErrorMessage.EMAIL_NOT_REGISTERED,
        ErrorCode.NOT_FOUND
      );
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

  //*************************************** reset link reset password **************************************** */

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

  //****************************************** updateAdmin api ***************************** */

  updateAdmin: catchAsync(async (req, res) => {
    const { first_name, last_name, email, mobile_number, address } = req.body;
    let data = {};
    const user = await User.findOne({ _id: req.userId });
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
    let update = await User.findByIdAndUpdate({ _id: user._id }, { $set: data }, { new: true });
    helper.commonResponse(
      res,
      SuccessCode.SUCCESS,
      update,
      SuccessMessage.PROFILE_DETAILS
    );
  }),

  ///******************************* get admin api ********************************************* */
  getAdminDetails: catchAsync(async (req, res) => {
    const userData = await User.findOne({ _id: req.userId });
    if (!userData) {
      throw new appError(ErrorMessage.USER_NOT_FOUND, ErrorCode.NOT_FOUND);
    }
    helper.commonResponse(
      res,
      SuccessCode.SUCCESS,
      userData,
      SuccessMessage.DETAIL_GET
    );
  }),

  //************************************************* create manager api ***************************************** */

  createManager: catchAsync(async (req, res) => {
    const payload = req.body;
    const { first_name, last_name, email, mobile_number } = payload;
    const user1 = await User.findById({ _id: req.userId, role: "Admin" });
    if (!user1) {
      throw new appError(ErrorMessage.NOT_AUTHORISED, ErrorCode.NOT_FOUND);
    }
    const user = await User.findOne({ email, mobile_number });
    if (user) {
      throw new appError(ErrorMessage.ALREADY_EXIST, ErrorCode.ALREADY_EXIST);
    }
    payload["employee_id"] = "MAN" + mobile_number.substr(-4);
    let passGen = randomPassword();
    console.log(passGen)
    payload["password"] = generateHash(passGen);
    payload["role"] = "Manager";
    const createManager = await User.create(payload);

    const subject = "Manager Invitation"
    const message = `Hello <br> You are invited as a Manger on Task management system Design plateform,<br> Here is your Login Crediantial <br> Email: ${payload.email} <br> Password: ${passGen} <br> Kindly Use this Crediantial for further login`
    await sendMailNotify(req.body.email, subject, message)
   
   helper.sendResponseWithData(
      res,
      SuccessCode.SUCCESS,
      SuccessMessage.CREATE_MANAGER,
      createManager
    );
  }),
};
