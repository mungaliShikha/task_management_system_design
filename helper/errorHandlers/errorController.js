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
      stack: err.stack,
    });
  } else {
    res.status(statusCode).json({
      success: false,
      statusCode:statusCode,
      message: err.message,
    });
  }
};
