const nodemailer = require("nodemailer");
const config = require("../../config/config.json")

module.exports = async ({ from, to, subject, text, html }) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.office365.com",
        port: 587,
        secure: false,
        auth: {
            user: 'shikha1081998@gmail.com',
            pass: 'vwlxuktqpfwzyzqp'
        }
    })


    let info = await transporter.sendMail({
        from: 'shikha1081998@gmail.com',
        to: to,
        subject: subject,
        text: text,
        html: html
    })
},
    module.exports.sendMailNotify = async ({ email, subject, text }) => {
        return new Promise((resolve, reject) => {
            var transporter = nodemailer.createTransport({
                host: "smtp.office365.com",
                port: 587,
                secure: false,
                service: 'gmail',
                auth: {
                    user: global.gConfig.nodemailer.user,
                    pass: global.gConfig.nodemailer.pass
                },
                tls: {
                  rejectUnauthorized: false,
                },
              });
            var mailOption = {
                from: "shikha1081998@gmail.com",
                to: email,
                subject: subject,
                text: text
            }
            console.log("=mailOption",mailOption)
            transporter.sendMail(mailOption, (error, result) => {
                if (error) {
                    reject(error)
                }
                else {
                    resolve(result)
                }
            })
        })
    }