const { ErrorMessage } = require("../helper/message");
const { ErrorCode } = require("../helper/statusCode");
const userModel = require("../models/user.model");
const enums = require("../helper/enum/enums");
const jwt = require("jsonwebtoken");
const appError = require("../helper/errorHandlers/errorHandler");

exports.verifyToken = async (req, res, next) => {
  try {
    let bearerHeader = req.headers.authorization;
    if (bearerHeader) {
      let bearerToken = bearerHeader.split(" "); // converting it to array
      let token = bearerToken[1];
      let authcheck = jwt.verify(token, global.gConfig.jwtSecretKey);
      if (!authcheck) {
        throw new appError(ErrorMessage.INCORRECT_JWT, ErrorCode.UNAUTHORIZED);
      } else {
        var userCheck = await userModel.findOne({ _id: authcheck.id });
        if (!userCheck) {
          throw new appError(ErrorMessage.USER_NOT_FOUND, ErrorCode.NOT_FOUND);
        } else {
          if (userCheck.status == enums.declaredEnum.status.BLOCKED) {
            throw new appError(
              ErrorMessage.BLOCKED_BY_ADMIN,
              ErrorCode.FORBIDDEN
            );
          } else if (userCheck.status == enums.declaredEnum.status.DELETE) {
            throw new appError(
              ErrorMessage.DELETED_BY_ADMIN,
              ErrorCode.UNAUTHORIZED
            );
          } else {
            req.userId = authcheck.id;
            req.userDetails = authcheck;
            req.email = userCheck.email;
            next();
          }
        }
      }
    } else {
      throw new appError(ErrorMessage.NO_TOKEN, ErrorCode.UNAUTHORIZED);
    }
  } catch (error) {
    next(error);
  }
};


