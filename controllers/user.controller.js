const catchAsync = require("../helper/catchAsync");
const appError = require("../helper/errorHandlers/errorHandler");
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
} = require("../utils/nodeMailer/nodemailer");
const {
  getOneUser ,getAllUser,getUserById, getUserAndUpdate, getOneToken, createUser
} = require("../services/user.service")

const enums = require("../helper/enum/enums")

module.exports = {
  // *************************************************** manager login ******************************************
  loginManager: async (req, res,next) => {
    try {
      const { email, password } = req.body;
      const loggedInUser = await getOneUser({ email });
      if (!loggedInUser || !compareHash(password, loggedInUser.password)) {
        throw new appError(
          ErrorMessage.EMAIL_NOT_REGISTERED,
          ErrorCode.NOT_FOUND
        );
      } else {
        let token = generateToken({ id: loggedInUser._id });
        let managerRes = {
          email: email,
          first_name: loggedInUser.first_name,
          last_name: loggedInUser.last_name,
          role: loggedInUser.role,
          mobile_number: loggedInUser.mobile_number,
          employee_id: loggedInUser.employee_id,
          token: token,
        };
        helper.sendResponseWithData(
          res,
          SuccessCode.SUCCESS,
          SuccessMessage.LOGIN_SUCCESS,
          managerRes
        );
      }
    } catch (error) {
      next(error)
    }
  },

  // *********************************************** get profile for Manager,Developer *******************************

  getProfile: catchAsync(async (req, res) => {
    const tokenAuth = await getOneUser({
      _id: req.userId,
      role: { $in: [enums.declaredEnum.role.DEVELOPER, enums.declaredEnum.role.MANAGER] },
    });
    if (!tokenAuth) {
      throw new appError(ErrorMessage.DATA_NOT_FOUND, ErrorCode.NOT_FOUND);
    }
    helper.commonResponse(
      res,
      SuccessCode.SUCCESS,
      tokenAuth,
      SuccessMessage.DATA_FOUND
    );
  }),
  // *********************************************** update Profile for Manager,Developer *******************************

  updateProfile: async (req, res) => {
    try {
      let payload = req.body;
      const tokenAuth = await getOneUser({
        _id: req.userId,
        role: { $in: [enums.declaredEnum.role.DEVELOPER, enums.declaredEnum.role.MANAGER] },
      });
      if (!tokenAuth)
        helper.commonResponse(
          res,
          ErrorCode.NOT_FOUND,
          ErrorMessage.USER_NOT_FOUND
        );
      if (req.files) {
        payload["profile_pic"] = req.files[0].location;
      }
      let updateRes = await getUserAndUpdate
      (
        { _id: tokenAuth._id },
        { $set: payload },
        { new: true }
      );
      helper.commonResponse(
        res,
        SuccessCode.SUCCESS,
        updateRes,
        SuccessMessage.UPDATE_SUCCESS
      );
    } catch (error) {
      helper.commonResponse(
        res,
        ErrorCode.SOMETHING_WRONG,
        ErrorMessage.SOMETHING_WRONG
      );
    }
  },

  // **************************************** Developer Create ************************

  addDeveloper: catchAsync(async (req, res) => {
    const payload = req.body;
    const { first_name, last_name, email, mobile_number } = payload;
    const userAuth = await getOneUser({ _id: req.userId, role: enums.declaredEnum.role.MANAGER });
    if (!userAuth) {
      throw new appError(ErrorMessage.NOT_AUTHORISED, ErrorCode.NOT_FOUND);
    }
    const userFound = await getOneUser({ email, mobile_number });
    if (userFound) {
      throw new appError(ErrorMessage.ALREADY_EXIST, ErrorCode.ALREADY_EXIST);
    }
    payload["employee_id"] = "DEV" + mobile_number.substr(-4);
    let passGen = randomPassword();
    console.log(passGen);
    payload["password"] = generateHash(passGen);
    payload["role"] = enums.declaredEnum.role.DEVELOPER;
    const createDeveloper = await createUser(payload);

    const subject = "Developer Invitation";
    const message = `Hello <br> You are invited as a Developer on Task management system Design platform,<br> Here is your Login Crediantial <br> Email: ${payload.email} <br> Password: ${passGen} <br> Kindly Use this Crediantial for further login`;
    await sendMailNotify(userAuth.email, subject, message, req.body.email);

    helper.sendResponseWithData(
      res,
      SuccessCode.SUCCESS,
      SuccessMessage.CREATE_DEVELOPER,
      createDeveloper
    );
  }),

  // **************************************************** Developer Login ************************

  developerLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      let developerDetails = await getOneUser({ email });
      if (!developerDetails)
        helper.commonResponse(
          res,
          ErrorCode.NOT_FOUND,
          ErrorMessage.USER_NOT_FOUND
        );
      else if (!compareHash(password, developerDetails.password))
        helper.commonResponse(
          res,
          ErrorCode.NOT_FOUND,
          ErrorMessage.INVALID_CREDENTIAL
        );
      const token = generateToken({
        id: developerDetails._id,
        role: developerDetails.role,
      });
      let loginRes = {
        email: email,
        role: developerDetails.role,
        token: token,
        first_name: developerDetails.first_name,
        last_name: developerDetails.last_name,
      };
      helper.commonResponse(
        res,
        SuccessCode.SUCCESS,
        loginRes,
        SuccessMessage.DATA_FOUND
      );
    } catch (error) {
      helper.commonResponse(
        res,
        ErrorCode.SOMETHING_WRONG,
        ErrorMessage.SOMETHING_WRONG
      );
    }
  },
};
