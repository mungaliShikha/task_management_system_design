const ApiError = require("./errorHandler")
const mongoose = require('mongoose')

const { ErrorMessage, SuccessMessage } = require("../message");
const { ErrorCode, SuccessCode } = require("../statusCode");
module.exports = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof ApiError)) {
        const statusCode =
            error.statusCode || error instanceof mongoose.Error ? ErrorCode.BAD_REQUEST : ErrorCode.INTERNAL_ERROR;
        const message = error.message || httpStatus[statusCode];
        error = new ApiError( message, statusCode);
    }
    next(error);
}