const nodemailer = require("nodemailer");
module.exports.sendMail = async (from, to, text, html) => {
  try {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "shikha1081998@gmail.com",
        pass: "vwlxuktqpfwzyzqp",
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
