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
const nodemailer = require("nodemailer")
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
  },


  addDeveloper: async (req, res) => {
    try {
      let { email, mobile_number } = req.body
      const adminAuthCheck = await User.findOne({ userId: req.userId, role: "Admin" });
      if (!adminAuthCheck) response(res, ErrorCode.NOT_FOUND, {}, ErrorMessage.USER_NOT_FOUND);
      let adminEmail = adminAuthCheck.email;

      const userExistRes = await User.findOne({ email });
      if (userExistRes)
        response(res, ErrorMessage.EMAIL_EXIST, [], ErrorCode.NOT_FOUND)

      let passGen = commonFunction.randomPassword()
      req.body.password = bcrypt.hashSync(passGen);

      req.body.employee_id = "DEV" + mobile_number.substr(-4);
      req.body.role = "Developer",
        req.body.userId = adminAuthCheck._id

      let subject = "Developer Invitation"
      let message =`Your account is successfully created as A Developer on Our plateform <br> Kindly Use this Credentials for Login <br> email:${req.body.email} <br> Password: ${passGen}`

      await sendMailNotify(email, subject,message)
      let finalRes = await User.create(req.body);
      response(res, SuccessCode.SUCCESS, finalRes, SuccessMessage.DEVELOPER_ADD)
    } catch (error) {
      console.log("error", error)
    }
  },

  listDeveloper: async (req, res) => {
    try {
      var query = { status: { $ne: "DELETE" }, role: "Developer" };
      if (req.body.search) {
        query.name = new RegExp('^' + req.body.search, "i");
      }
      req.body.limit = parseInt(req.body.limit)
      var options = {
        page: req.body.page || 1,
        limit: req.body.limit || 10,
        sort: { createdAt: -1 }
      };
      let developerList = await User.paginate(query, options);
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


