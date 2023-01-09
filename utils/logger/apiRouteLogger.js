const logger = require("./logger")

module.exports=(req, res, next) => {
		logger.info(`http://localhost:3000${req.originalUrl} - ${req.method} METHOD `)
		next()
	}