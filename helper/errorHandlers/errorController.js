const logger = require("../logger/logger");

module.exports = (err, req, res, next) => {
  /// error class middleware
  const statusCode = err.statusCode || 500;
  logger.error(`${statusCode} - ${err.message}`);
  if (global.gConfig.config_id === "development") {
    res.status(statusCode).json({
      success: false,
      message: err.message,
      statusCode:statusCode,
      reference:`${req.path} ${req.method}`,
      stack: err.stack,
    });
  } else {
    res.status(statusCode).json({
      success: false,
      statusCode:statusCode,
      reference:`${req.path} ${req.method}`,
      message: err.message,
    });
  }
};
