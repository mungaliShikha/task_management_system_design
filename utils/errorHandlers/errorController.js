const logger = require("../logger/logger")


module.exports = (err, req, res, next) => { /// error class middleware
    const statusCode = err.statusCode || 500;
    logger.error(`statusCode - ${err.message}`)
    res.status(statusCode).json({
        success: 0,
        message: err.message,
        stack: err.stack
    })
}