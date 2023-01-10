
const {createLogger,transports,format} = require("winston")
const{combine,timestamp,printf,colorize} = format


const formatter = printf((info)=>{
    let object=info.message
    return `${info.timestamp} [${info.level}] object`
})


const logger = createLogger({
    format: combine(timestamp({ format: `MMM-DD-YYYY HH:mm:ss` }),formatter,colorize()),
    transports:[
        new transports.File({filename:"error.log",level:"error"}),
        new transports.File({ filename: "general.log", level: "info" })
    ]
})


module.exports = logger;