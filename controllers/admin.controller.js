const Token = require("../models/token.model")
const catchAsync = require("../helper/catchAsync");
const crypto = require("crypto");
const appError = require("../helper/errorHandlers/errorHandler");
const { ErrorMessage, SuccessMessage } = require("../helper/message");
const { ErrorCode, SuccessCode } = require("../helper/statusCode");
const {
  compareHash,
  generateToken,
  generatePassword,
  randomPassword,
  generateHash,
  subjects,messages
} = require("../helper/commonFunction");
const helper = require("../helper/commonResponseHandler");
const {
  sendMail,
  sendMailNotify,
} = require("../utils/nodeMailer/nodemailer");
const enums = require("../helper/enum/enums");
const {
  getOneUser ,getAllUser,getUserById, getUserAndUpdate, getOneToken, createUser
} = require("../services/user.service")
module.exports = {
  
  //************************************ forgetpassword for admin ******************************* */

  forgetPassword: catchAsync(async (req, res) => {
    const { email } = req.body;
    const user = await getOneUser({ email });
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
      global.gConfig.nodemailer_mail,
      email,
      SuccessMessage.FORGET_SUCCESS,
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
    const user = await getUserById(userId);
    if (!user) {
      throw new appError(
        ErrorMessage.EMAIL_NOT_REGISTERED,
        ErrorCode.NOT_FOUND
      );
    }

    const tokenFound = await getOneToken({
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
    let payload = req.body;
    
    const user = await getOneUser({ _id: req.userId ,role: { $in: [enums.declaredEnum.role.ADMIN] }});
    if (!user) {
      throw new appError(ErrorMessage.USER_NOT_FOUND, ErrorCode.NOT_FOUND);
    }
    if(req.files.length !== 0){
      payload["profile_image"]=req.files[0].location;
    }
    
    let update = await getUserAndUpdate(
      { _id: user._id },
      { $set: payload },
      { new: true }
    );
    helper.commonResponse(
      res,
      SuccessCode.SUCCESS,
      update,
      SuccessMessage.PROFILE_DETAILS
    );
  }),

  ///******************************* get admin api ********************************************* */
  getAdminDetails: catchAsync(async (req, res) => {
    const userData = await getOneUser({ _id: req.userId });
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
    const userAuth = await getOneUser({
      _id: req.userId,
      role: enums.declaredEnum.role.ADMIN,
    });
    if (!userAuth) {
      throw new appError(ErrorMessage.NOT_AUTHORISED, ErrorCode.NOT_FOUND);
    }
    const userDuplicate = await getOneUser({ email, mobile_number });
    if (userDuplicate) {
      throw new appError(ErrorMessage.ALREADY_EXIST, ErrorCode.ALREADY_EXIST);
    }
    payload["employee_id"] = "MAN" + mobile_number.substr(-4);
    let passGen = randomPassword();
    console.log(passGen);
    payload["password"] = generateHash(passGen);
    payload["role"] = enums.declaredEnum.role.MANAGER;
    const createManager = await createUser(payload);

    const subject = subjects(createManager.role);
    const message = messages(payload.email,passGen)
    
    await sendMailNotify(userAuth.email, subject, message, payload.email);

    helper.sendResponseWithData(
      res,
      SuccessCode.CREATED,
      SuccessMessage.CREATE_MANAGER,
      createManager
    );
  }),

  
};
