const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/errorHandlers/errorHandler");;
const { ErrorMessage, SuccessMessage } = require("../helper/message");
const { ErrorCode, SuccessCode } = require("../helper/statusCode");
const { compareHash, generateToken } = require("../helper/commonFunction");
const helper = require("../helper/commonResponseHandler");
const { commonResponse: response } = require("../helper/commonResponseHandler");
const { sendMail, sendMailNotify } = require("../services/nodeMailer/nodemailer")

const commonFunction = require("../utils/commonFunction");
const bcrypt = require("bcryptjs")



module.exports.loginAdmin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const loggedInUser = await User.findOne({ email });
  if (!loggedInUser || !compareHash(password, loggedInUser.password)) {
    throw new appError(ErrorMessage.EMAIL_NOT_REGISTERED, ErrorCode.NOT_FOUND);
  } else {
    helper.sendResponseWithData(res, SuccessCode.SUCCESS, SuccessMessage.LOGIN_SUCCESS, loggedInUser, generateToken({ email }));
  }
});


module.exports = {
  login: async (req, res) => {
    const { email, password } = req.body;
    const loggedInUser = await User.findOne({ email });
    if (!loggedInUser || !compareHash(password, loggedInUser.password)) {
      throw new appError(ErrorMessage.EMAIL_NOT_REGISTERED, ErrorCode.NOT_FOUND);
    } else {
      helper.sendResponseWithData(res, SuccessCode.SUCCESS, SuccessMessage.LOGIN_SUCCESS, loggedInUser, generateToken({ email }));
    }
  },


  addDeveloper: async (req, res) => {
    try {
      let { email, mobile_number } = req.body
      // const adminAuthCheck = await User.findOne({ userId: req.userId, role: "Admin" });
      // if (!adminAuthCheck) response(res, ErrorCode.NOT_FOUND, {}, ErrorMessage.USER_NOT_FOUND);

      const userExistRes = await User.findOne({ email });
      if (userExistRes)
        response(res, ErrorMessage.EMAIL_EXIST, [], ErrorCode.NOT_FOUND)

      let passGen = commonFunction.randomPassword()
      req.body.password = bcrypt.hashSync(passGen);

      req.body.employee_id = "DEV" + mobile_number.substr(-4);
      req.body.role = "Developer"

      // await sendMailNotify("shikha1081998@gmail.com", req.body.email, "Developer Invitation", `Your account is successfully created eamil:${req.body.email} and Password: ${req.body.password}`)
      // console.log("checkMail==", checkMail)

      let finalRes = await User.create(req.body);
      response(res, SuccessCode.SUCCESS, finalRes, SuccessMessage.DEVELOPER_ADD)
    } catch (error) {
      console.log("== error", error)
    }
  },

  listDeveloper: async (req, res) => {
    try {
      let developerList = await User.find({ role: "Developer" });
      if (developerList.length == 0) response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.DATA_NOT_FOUND)
      response(res, SuccessCode.SUCCESS, developerList, SuccessMessage.DATA_FOUND)
    } catch (error) {
      response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
    }
  },


  viewDeveloper: async (req, res) => {
    try {
      let viewParticularDev = await User.findOne({ _id: req.query._id, role: "Developer" });
      if (!viewParticularDev) response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.DATA_NOT_FOUND)
      response(res, SuccessCode.SUCCESS, viewParticularDev, SuccessMessage.DATA_FOUND)
    } catch (error) {
      response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
    }
  }


}
