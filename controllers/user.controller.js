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
  getOneUser, getAllUser, getUserById, getUserAndUpdate, getOneToken, createUser
} = require("../services/user.service")

const enums = require("../helper/enum/enums");
const joi = require("joi")

module.exports = {
  //******************************** common login api for manager developer admin ************************** */
 login: catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const loggedInUser = await getOneUser({ email ,role:{ $in: [ enums.declaredEnum.role.MANAGER, enums.declaredEnum.role.DEVELOPER, enums.declaredEnum.role.ADMIN ] }});
  if (!loggedInUser || !compareHash(password, loggedInUser.password)) {
    throw new appError(
      ErrorMessage.EMAIL_NOT_REGISTERED,
      ErrorCode.NOT_FOUND
    );
  } else {
    let token = generateToken({ id: loggedInUser._id });
    let finalRes = {
      email: email,
      mobile_number: loggedInUser.mobile_number,
      role: loggedInUser.role,
      first_name: loggedInUser.first_name,
      last_name: loggedInUser.last_name,
      token: token,
    };
    helper.sendResponseWithData(
      res,
      SuccessCode.SUCCESS,
      SuccessMessage.LOGIN_SUCCESS,
      finalRes
    );
  }
}),

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
    const validationSchema = {
      first_name: joi.string().optional(),
      last_name: joi.string().optional(),
      mobile_number: joi.string().optional(),
      profile_pic: joi.string().optional(),
    };
    try {
      const payload = await joi.validate(req.body, validationSchema);
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

  addDeveloper: catchAsync(async (req, res,next) => {
    const validationSchema = {
      first_name: joi.string().optional(),
      last_name: joi.string().optional(),
      mobile_number: joi.string().optional(),
      email: joi.string().required()
    };
    
    try {
      const payload = await joi.validate(req.body, validationSchema);
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
    }catch(error){
      next(error)
    }
    })
  ,

  
};
