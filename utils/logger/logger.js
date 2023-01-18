
const {createLogger,transports,format} = require("winston")
const{combine,timestamp,printf,colorize} = format


const formatter = printf((info)=>{
    return `${info.timestamp} [${info.level}] ${info.message} `
})


const logger = createLogger({
    format: combine(timestamp({ format: `MMM-DD-YYYY HH:mm:ss` }),formatter,colorize()),
    transports:[
        new transports.Console(),
        new transports.File({filename:"error.log",level:"error"}),
        new transports.File({ filename: "general.log", level: "info" })
    ]
})


module.exports = logger;