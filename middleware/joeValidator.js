// const { AppError } = require("../errorHandler")
const appError = require("../helper/errorHandlers/errorHandler");
const {ErrorMessage}=require('../helper/message');
const {ErrorCode}=require('../helper/statusCode');


module.exports.validationMiddleware = (validator)=> (req,res,next)=>{
    try {
        const {error}=validator(req.body)
        
        if (error) {
            throw new appError( ErrorMessage.WRONG_FORMAT,
                ErrorCode.NOT_FOUND)
            
                
        }
        next()
    } catch (error) {
        return next(error)
    }
}



