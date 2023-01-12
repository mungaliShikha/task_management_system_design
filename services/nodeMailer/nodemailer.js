const nodemailer = require("nodemailer");
module.exports.sendMail = async (from, to, text, html) => {
  try {
    var transporter = nodemailer.createTransport({
      service: global.gFields.nodemailer_service,
      auth: {
        user: global.gFields.nodemailer_mail,
        pass: global.gFields.nodemailer_password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    var mailOptions = {
      from: from,
      to: to,
      subject: text,
      html: html,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    console.log(error, "email not sent");
  }
};
