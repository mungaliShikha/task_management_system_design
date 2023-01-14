const User = require("../models/user.model");
// const Token = require("../models/token.model");
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

module.exports = {
  //******************************************* developer login **************************************** */

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
      helper.sendResponseWithData(
        res,
        SuccessCode.SUCCESS,
        SuccessMessage.LOGIN_SUCCESS,
        finalRes
      );
    }
  },

  //************************************** create developer ************************************ */

  addDeveloper: catchAsync(async (req, res) => {
    let { email, mobile_number } = req.body;
    let { userId } = req.params;
    const adminAuthCheck = await User.findById(userId);
    if (adminAuthCheck && adminAuthCheck.role != "Manager") {
      throw new appError(ErrorMessage.INVALID_TOKEN, ErrorCode.NOT_ALLOWED);
    } else if (!adminAuthCheck) {
      throw new appError(ErrorMessage.USER_NOT_FOUND, ErrorCode.NOT_FOUND);
    }
    let managerEmail = adminAuthCheck.email;
    const userExistRes = await User.findOne({ email });
    if (userExistRes) {
      throw new appError(ErrorMessage.EMAIL_EXIST, ErrorCode.NOT_FOUND);
    }
    let passGen = randomPassword();
    console.log(passGen)
    req.body.password = generateHash(passGen);
    if (req.files) {
      req.body["profile_image"] = req.files[0].location;
    }
    req.body.employee_id = "DEV" + mobile_number.substr(-4);
    req.body.role = "Developer";
    req.body.userId = adminAuthCheck._id;

    let subject = "Developer Invitation";
    let message = `Your account is successfully created as A Developer on Our platform <br> Kindly Use this Credentials for Login <br> Email: ${req.body.email} <br> Password: ${passGen}`;

    await sendMailNotify(managerEmail, subject, message, email);

    let finalRes = await User.create(req.body);
    helper.commonResponse(
      res,
      SuccessCode.SUCCESS,
      finalRes,
      SuccessMessage.DEVELOPER_ADD
    );
  }),

  //******************************************** get list of developers ************************************ */

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

  /************************************** view developer ***************************************************** */

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
