const nodemailer = require("nodemailer");

module.exports = async ({ from, to, subject, text, html }) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.office365.com",
        port: 587,
        secure: false,
        auth: {
            user: 'shikha1081998@gmail.com',
            pass: 'shikha1234567890'
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
    module.exports.sendMailNotify = async ({ email, subject, body }) => {
        return new Promise((resolve, reject) => {
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    "user": "shikha1081998@gmail.com",
                    "pass": "shikha1234567890"
                },
            }); 
            var mailOption = {
                from: 'shikha1081998@gmail.com',
                to: email,
                subject: subject,
                text: body
            }
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