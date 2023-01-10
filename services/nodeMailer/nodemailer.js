const nodemailer =require("nodemailer");
module.exports= async({from ,to,subject,text,html})=>{
    let transporter = nodemailer.createTransport({
        host:"smtp.office365.com",
        port:587,
        secure:false,
        auth:{
            user:'shikha1081998@gmail.com',
            pass:'shikha1234567890'
        }
    })


    let info = await transporter.sendMail({
        from:'shikha1081998@gmail.com',
        to:to,
        subject:subject,
        text:text,
        html:html
    })
}