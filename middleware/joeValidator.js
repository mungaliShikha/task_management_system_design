// const { AppError } = require("../errorHandler")
const appError = require("../helper/errorHandlers/errorHandler");
const { ErrorMessage, SuccessMessage } = require("../helper/message");

const { ErrorCode, SuccessCode } = require("../helper/statusCode");
const helper = require("../helper/commonResponseHandler");
const { forEach } = require("lodash");

module.exports.validationMiddleware = (validator) => (req, res, next) => {
  try {
    const { error } = validator(req.body);

    if (error) {
      throw new appError(
        error.details[0].message.replace(/"/g, ""),
        ErrorCode.NOT_FOUND
      );
    }
    next();
  } catch (error) {
    return next(error);
  }
};
