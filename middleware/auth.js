const { ErrorMessage } = require("../helper/message");
const { ErrorCode } = require("../helper/statusCode");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const appError = require("../utils/errorHandlers/errorHandler");

exports.verifyToken = (req, res, next) => {
  if (req.headers.token) {
    jwt.verify(
      req.headers.token,
      global.gFields.jwtSecretKey,
      (err, result) => {
        if (err) {
          throw new appError(
            ErrorMessage.INCORRECT_JWT,
            ErrorCode.UNAUTHORIZED
          );
        } else {
          userModel.findOne({ _id: result.id }, (error, result2) => {
            if (error)
              throw new appError(
                ErrorMessage.INTERNAL_ERROR,
                ErrorCode.INTERNAL_ERROR
              );
            else if (!result2) {
              throw new appError(
                ErrorMessage.USER_NOT_FOUND,
                ErrorCode.NOT_FOUND
              );
            } else {
              if (result2.status == "BLOCK") {
                throw new appError(
                  ErrorMessage.BLOCKED_BY_ADMIN,
                  ErrorCode.FORBIDDEN
                );
              } else if (result2.status == "DELETE") {
                throw new appError(
                  ErrorMessage.DELETED_BY_ADMIN,
                  ErrorCode.UNAUTHORIZED
                );
              } else {
                req.userId = result.id;
                req.userDetails = result;
                req.email = result2.email;
                next();
              }
            }
          });
        }
      }
    );
  } else {
    throw new appError( ErrorMessage.NO_TOKEN,ErrorCode.BAD_REQUEST);
  }
};
