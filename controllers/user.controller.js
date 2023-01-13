const User = require("../models/user.model");
const Token = require("../models/token.model");
const catchAsync = require("../utils/catchAsync");
const { upload } = require("../services/aws/aws");
const crypto = require("crypto");
const appError = require("../utils/errorHandlers/errorHandler");
const { ErrorMessage, SuccessMessage } = require("../helper/message");
const { ErrorCode, SuccessCode } = require("../helper/statusCode");
const { compareHash, generateToken, generatePassword, randomPassword, generateHash } = require("../helper/commonFunction");
const helper = require("../helper/commonResponseHandler");
const { sendMail, sendMailNotify, } = require("../services/nodeMailer/nodemailer");

const bcrypt = require("bcryptjs");
const { JsonWebTokenError } = require("jsonwebtoken");

module.exports = {

    developerLogin: async (req, res) => {
        try {
            const { email, password } = req.body;
            let developerDetails = await User.findOne({ email });
            if (!developerDetails) helper.commonResponse(res, ErrorCode.NOT_FOUND, ErrorMessage.USER_NOT_FOUND);
            else if(!bcrypt.compare(password, developerDetails.password)) helper.commonResponse(res, ErrorCode.NOT_FOUND, ErrorMessage.INVALID_CREDENTIAL);
            const token = generateToken({ id: developerDetails._id, role: developerDetails.role, });
            let loginRes = {
                email: email,
                role: developerDetails.role,
                token: token,
                first_name: developerDetails.first_name,
                last_name: developerDetails.last_name
            }
            helper.commonResponse(res, SuccessCode.SUCCESS, loginRes, SuccessMessage.DATA_FOUND);
        } catch (error) {
            helper.commonResponse(res, ErrorCode.SOMETHING_WRONG, ErrorMessage.SOMETHING_WRONG)
        }

    },

    getDeveloperProfile:async(req,res)=>{
        try {
            const tokenAuth = await User.findOne({userId:req.userId,role:"Developer"});
            if(!tokenAuth)helper.commonResponse(res,ErrorCode.NOT_FOUND,ErrorMessage.USER_NOT_FOUND)
            helper.commonResponse(res,SuccessCode.SUCCESS,tokenAuth,SuccessMessage.DATA_FOUND)
        } catch (error) {
            helper.commonResponse(res,ErrorCode.SOMETHING_WRONG,ErrorMessage.SOMETHING_WRONG)
        }
    }

}
