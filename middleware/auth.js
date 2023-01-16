const { config } = require('../config/config')
const { commonResponse: response } = require('../helper/commonResponseHandler')
const { ErrorMessage } = require('../helper/message')
const { ErrorCode } = require('../helper/statusCode')
const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const appError = require("../utils/errorHandlers/errorHandler");


exports.verifyToken = (req, res, next) => {
    if (req.headers.token) {
        jwt.verify(req.headers.token, global.gFields.jwtSecretKey, (err, result) => {
            if (err) {
                response(res, ErrorCode.UNAUTHORIZED, [], ErrorMessage.INCORRECT_JWT);
            }
            else {
                userModel.findOne({ _id: result.id }, (error, result2) => {
                    if (error)
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                    else if (!result2) {
                        throw new appError(ErrorMessage.USER_NOT_FOUND,ErrorCode.NOT_FOUND)
                    }
                    else {
                        if (result2.status == "BLOCK") {
                            response(res, ErrorCode.FORBIDDEN, [], ErrorMessage.BLOCKED_BY_ADMIN);
                        }
                        else if (result2.status == "DELETE") {
                            response(res, ErrorCode.UNAUTHORIZED, [], ErrorMessage.DELETED_BY_ADMIN);
                        }
                        else {
                            req.userId = result.id
                            req.userDetails = result
                            req.email = result2.email
                            next();
                        }

                    }
                })
            }
        })
    } else {
        response(res, ErrorCode.BAD_REQUEST, [], ErrorMessage.NO_TOKEN)
    }

}