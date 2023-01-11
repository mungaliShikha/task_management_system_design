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
  generateHash,
} = require("../helper/commonFunction");
const helper = require("../helper/commonResponseHandler");
const { sendMail } = require("../services/nodeMailer/nodemailer");

module.exports = {


  
  login: catchAsync(async (req, res) => {
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
  }),




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

    const link = `${global.gConfig.db_URL}admin/resetPassword/${user._id}/${tokenFound.token}`;
    const html = `<h1> Password reset requested </h1><h3> Download link </h3><p>${link}</p>`;
    await sendMail(
      "shikha1081998@gmail.com",
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
    // const {profile_image}=req.files
    const { first_name, last_name, email, mobile_number, address } = req.body;
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      throw new appError(ErrorMessage.USER_NOT_FOUND, ErrorCode.NOT_FOUND);
    }
    upload.single("file");
    req.body.profile_image = req.files.location;

    const updateAdmin = await User.findOneAndUpdate({});
  }),






  getAdmin: catchAsync(async (req, res) => {
    const { userId } = req.params;
    const userData = await User.findById(userId);
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

  // End of export ///
};
