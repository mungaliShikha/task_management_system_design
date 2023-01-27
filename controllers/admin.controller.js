const Token = require("../models/token.model");
const catchAsync = require("../helper/catchAsync");
const User = require("../models/user.model");
const crypto = require("crypto");
const appError = require("../helper/errorHandlers/errorHandler");
const { ErrorMessage, SuccessMessage } = require("../helper/message");
const { ErrorCode, SuccessCode } = require("../helper/statusCode");
const {
  randomPassword,
  generateHash,
  subjects,
  messages,
} = require("../helper/commonFunction");
const helper = require("../helper/commonResponseHandler");
const { sendMail, sendMailNotify } = require("../utils/nodeMailer/nodemailer");
const enums = require("../helper/enum/enums");

const {
  getOneUser,
  getAllUser,
  getUserById,
  getUserAndUpdate,
  getOneToken,
  createUser,
  getUserData,
} = require("../services/user.service");
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

  //****************************************** updateAdmin api ******************************/

  updateAdmin: catchAsync(async (req, res) => {
    let payload = req.body;

    const user = await getOneUser({
      _id: req.userId,
      role: { $in: [enums.declaredEnum.role.ADMIN] },
    });
    if (!user) {
      throw new appError(ErrorMessage.USER_NOT_FOUND, ErrorCode.NOT_FOUND);
    }
    if (req.files.length !== 0) {
      payload["profile_image"] = req.files[0].location;
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

  addManager: catchAsync(async (req, res) => {
    const payload = req.body;
    const { first_name, last_name, email, mobile_number } = payload;
    const userAuth = await getOneUser({
      _id: req.userId,
      role: enums.declaredEnum.role.ADMIN,
    });
    if (!userAuth) {
      throw new appError(ErrorMessage.NOT_AUTHORISED, ErrorCode.NOT_FOUND);
    }
    const duplicateEmail = await getOneUser({ email });
    if (duplicateEmail) {
      throw new appError(ErrorMessage.EMAIL_EXIST, ErrorCode.ALREADY_EXIST);
    }
    const duplicateMobile = await getOneUser({ mobile_number });
    if (duplicateMobile) {
      throw new appError(ErrorMessage.MOBILE_EXIST, ErrorCode.ALREADY_EXIST);
    }
    payload["employee_id"] = "MAN" + mobile_number.substr(-4);
    let passGen = randomPassword();
    console.log(passGen);
    payload["password"] = generateHash(passGen);
    payload["role"] = enums.declaredEnum.role.MANAGER;
    const createManager = await createUser(payload);

    const subject = subjects(createManager.role);
    const message = messages(payload.email, passGen);

    await sendMailNotify(userAuth.email, subject, message, payload.email);

    helper.commonResponse(
      res,
      SuccessCode.CREATED,
      createManager,
      SuccessMessage.CREATE_MANAGER
    );
  }),

  /***************************** admin can get the list of all users ******************************* */

  listAllUsers: catchAsync(async (req, res) => {
    const queryData = { role: { $ne: enums.declaredEnum.role.ADMIN } };
    const queryMade = req.query;
    const { fName, lName, status, role, fromDate, toDate } = queryMade;
    if (Object.keys(queryMade).length == 0) {
      let filterData = await getAllUser({
        status: { $ne: enums.declaredEnum.status.DELETE },
        role: { $ne: enums.declaredEnum.role.ADMIN },
      });

      helper.commonResponse(
        res,
        SuccessCode.SUCCESS,
        filterData,
        SuccessMessage.DATA_FOUND
      );
    }

    if (fName || lName || status || role || fromDate || toDate) {
      if (fName) {
        queryData["first_name"] = { $regex: fName, $options: "i" };
      }
      if (lName) {
        queryData["last_name"] = { $regex: lName, $options: "i" };
      }
      if (status) {
        queryData["status"] = {
          $ne: enums.declaredEnum.status.DELETE,
          $regex: status,
          $options: "i",
        };
      }
      if (role) {
        queryData["role"] = {
          $ne: enums.declaredEnum.role.ADMIN,
          $regex: role,
          $options: "i",
        };
      }
      if (fromDate && toDate) {
        queryData["createdAt"] = {
          $gte: new Date(fromDate),
          $lt: new Date(toDate),
        };
      }
      if (fromDate) {
        queryData.createdAt = { $gte: new Date(fromDate) };
      }
      if (toDate) {
        queryData.createdAt = { $lt: new Date(toDate) };
      }
    }

    let { page, limit } = req.query;
    page = parseInt(req.query.page) || 1;
    limit = parseInt(req.query.limit) || 10;
    const dataFound = await User.find(queryData)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select({ password: 0 })
      .exec();
    if (dataFound.length == 0) {
      throw new appError(ErrorMessage.DATA_NOT_FOUND, ErrorCode.NOT_FOUND);
    }
    const length = await User.find(queryData).countDocuments();
    let finalData = {
      data: dataFound,
      limit: limit,
      currentPage: page,
      totalPages: Math.ceil(length / limit),
      totalDocuments: length,
    };
    helper.commonResponse(
      res,
      SuccessCode.SUCCESS,
      finalData,
      SuccessMessage.DATA_FOUND
    );
  }),
};
