const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/errorHandlers/errorHandler");;
const { ErrorMessage, SuccessMessage } = require("../helper/message");
const { ErrorCode, SuccessCode } = require("../helper/statusCode");
const { compareHash, generateToken } = require("../helper/commonFunction");
const helper = require("../helper/commonResponseHandler");

module.exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const loggedInUser = await User.findOne({ email });
  if (!loggedInUser || !compareHash(password, loggedInUser.password)) {
    throw new appError(ErrorMessage.EMAIL_NOT_REGISTERED, ErrorCode.NOT_FOUND);
  } else {
    helper.commonResponse(res, 200, "success", generateToken({ email }));
  }
});
