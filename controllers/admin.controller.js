const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/errorHandlers/errorHandler");;
const { ErrorMessage, SuccessMessage } = require("../helper/message");
const { ErrorCode, SuccessCode } = require("../helper/statusCode");
const { compareHash, generateToken } = require("../helper/commonFunction");
const helper = require("../helper/commonResponseHandler");
const { commonResponse: response } = require("../helper/commonResponseHandler");
const { sendMail, sendMailNotify } = require("../services/nodeMailer/nodemailer")

const commonFunction = require("../utils/commonFunction");
const nodemailer = require("nodemailer")
const bcrypt = require("bcryptjs")



module.exports.loginAdmin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const loggedInUser = await User.findOne({ email });
  if (!loggedInUser || !compareHash(password, loggedInUser.password)) {
    throw new appError(ErrorMessage.EMAIL_NOT_REGISTERED, ErrorCode.NOT_FOUND);
  } else {
    helper.sendResponseWithData(res, SuccessCode.SUCCESS, SuccessMessage.LOGIN_SUCCESS, loggedInUser, generateToken({ email }));
  }
});

module.exports = {

  login: async (req, res) => {
    const { email, password } = req.body;
    const loggedInUser = await User.findOne({ email });
    if (!loggedInUser || !compareHash(password, loggedInUser.password)) {
      throw new appError(ErrorMessage.EMAIL_NOT_REGISTERED, ErrorCode.NOT_FOUND);
    } else {
      let token = generateToken({ id: loggedInUser._id, role: loggedInUser.role })
      let finalRes = {
        userId: loggedInUser._id,
        email: email,
        role: loggedInUser.role,
        first_name: loggedInUser.first_name,
        last_name: loggedInUser.last_name,
        mobile_number: loggedInUser.mobile_number,
        token: token
      }
      helper.sendResponseWithData(res, SuccessCode.SUCCESS, SuccessMessage.LOGIN_SUCCESS, finalRes);
    }
  },


  addDeveloper: async (req, res) => {
    try {
      let { email, mobile_number } = req.body
      const adminAuthCheck = await User.findOne({ userId: req.userId, role: "Admin" });
      if (!adminAuthCheck) response(res, ErrorCode.NOT_FOUND, {}, ErrorMessage.USER_NOT_FOUND);
      let adminEmail = adminAuthCheck.email;

      const userExistRes = await User.findOne({ email });
      if (userExistRes)
        response(res, ErrorMessage.EMAIL_EXIST, [], ErrorCode.NOT_FOUND)

      let passGen = commonFunction.randomPassword()
      req.body.password = bcrypt.hashSync(passGen);

      req.body.employee_id = "DEV" + mobile_number.substr(-4);
      req.body.role = "Developer",
        req.body.userId = adminAuthCheck._id

      // const html = `<h1> Developer invitation </h1><h3> Subhra</h3></p>`;
      const subject = "Developer Invitation"
      const body =`Your account is successfully created eamil:${req.body.email} and Password: ${req.body.password}`


      let mailCheck = await sendMailNotifys({email, subject})
      console.log("mailCheck==", mailCheck)
      let finalRes = await User.create(req.body);
      response(res, SuccessCode.SUCCESS, finalRes, SuccessMessage.DEVELOPER_ADD)
    } catch (error) {
      console.log("== error", error)
    }
  },

  listDeveloper: async (req, res) => {
    try {
      var query = { status: { $ne: "DELETE" }, role: "Developer" };
      if (req.body.search) {
        query.name = new RegExp('^' + req.body.search, "i");
      }
      req.body.limit = parseInt(req.body.limit)
      var options = {
        page: req.body.page || 1,
        limit: req.body.limit || 10,
        sort: { createdAt: -1 }
      };
      let developerList = await User.paginate(query, options);
      if (developerList.length == 0) response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.DATA_NOT_FOUND)
      response(res, SuccessCode.SUCCESS, developerList, SuccessMessage.DATA_FOUND)
    } catch (error) {
      response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
    }
  },


  viewDeveloper: async (req, res) => {
    try {
      let viewParticularDev = await User.findOne({ _id: req.query._id, role: "Developer" });
      if (!viewParticularDev) response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.DATA_NOT_FOUND)
      response(res, SuccessCode.SUCCESS, viewParticularDev, SuccessMessage.DATA_FOUND)
    } catch (error) {
      response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
    }
  }


}

function sendMailNotifys({ email, subject,message }) {
  return new Promise((resolve, reject) => {
    let html =`<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
    <!--[if gte mso 9]>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="x-apple-disable-message-reformatting">
      <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
      <title></title>
      
        <style type="text/css">
          table, td { color: #000000; } @media only screen and (min-width: 670px) {
      .u-row {
        width: 650px !important;
      }
      .u-row .u-col {
        vertical-align: top;
      }
    
      .u-row .u-col-100 {
        width: 650px !important;
      }
    
    }
    
    @media (max-width: 670px) {
      .u-row-container {
        max-width: 100% !important;
        padding-left: 0px !important;
        padding-right: 0px !important;
      }
      .u-row .u-col {
        min-width: 320px !important;
        max-width: 100% !important;
        display: block !important;
      }
      .u-row {
        width: calc(100% - 40px) !important;
      }
      .u-col {
        width: 100% !important;
      }
      .u-col > div {
        margin: 0 auto;
      }
    }
    body {
      margin: 0;
      padding: 0;
    }
    
    table,
    tr,
    td {
      vertical-align: top;
      border-collapse: collapse;
    }
    
    p {
      margin: 0;
    }
    
    .ie-container table,
    .mso-container table {
      table-layout: fixed;
    }
    
    * {
      line-height: inherit;
    }
    
    a[x-apple-data-detectors='true'] {
      color: inherit !important;
      text-decoration: none !important;
    }
    
    </style>
      
      
    
    <!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet" type="text/css"><!--<![endif]-->
    
    </head>
    
    <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ffffff;color: #000000">
      <!--[if IE]><div class="ie-container"><![endif]-->
      <!--[if mso]><div class="mso-container"><![endif]-->
      <table style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ffffff;width:100%" cellpadding="0" cellspacing="0">
      <tbody>
      <tr style="vertical-align: top">
        <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ffffff;"><![endif]-->
        
    
    <div class="u-row-container" style="padding: 0px;background-color: transparent">
      <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 650px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #dff1ff;">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px;"><tr style="background-color: #dff1ff;"><![endif]-->
          
    <!--[if (mso)|(IE)]><td align="center" width="650" style="background-color: #ffffff;width: 650px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
    <div class="u-col u-col-100" style="max-width: 320px;min-width: 650px;display: table-cell;vertical-align: top;">
      <div style="background-color: #ffffff;width: 100% !important;">
      <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
      
    <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td style="overflow-wrap:break-word;word-break:break-word;padding:13px 0px 15px;font-family:'Montserrat',sans-serif;" align="left">
            
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
      <td style="padding-right: 0px;padding-left: 0px;" align="center">
      <!-- <a>Smart Contract as Service Plateform </a>-->
    
           <img align="center" border="0" src="https://res.cloudinary.com/http-hovr-site/image/upload/v1673506265/mdn4jgqbywayyh5omlq4.jpg" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 54%;max-width: 100px;" width="100"/> 
          
        </td>
      </tr>
    </table>
    
          </td>
        </tr>
      </tbody>
    </table>
    
      <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
      </div>
    </div>
    <!--[if (mso)|(IE)]></td><![endif]-->
          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>
    
    
    
    <div class="u-row-container" style="padding: 0px;background-color: transparent">
      <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 650px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #f3fbfd;">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px;"><tr style="background-color: #f3fbfd;"><![endif]-->
          
    <!--[if (mso)|(IE)]><td align="center" width="650" style="width: 650px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
    <div class="u-col u-col-100" style="max-width: 320px;min-width: 650px;display: table-cell;vertical-align: top;">
      <div style="width: 100% !important;">
      <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
      
    <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td style="overflow-wrap:break-word;word-break:break-word;padding:40px 10px 10px;font-family:'Montserrat',sans-serif;" align="left">
            
      <div style="color: #1b262c; line-height: 140%; text-align: center; word-wrap: break-word;">
        <p style="font-size: 14px; line-height: 140%;"><strong><span style="font-size: 24px; line-height: 33.6px;">${subject}</span></strong></p>
      </div>
    
          </td>
        </tr>
      </tbody>
    </table>
    
    <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 50px 20px;font-family:'Montserrat',sans-serif;" align="left">
            
      <div style="color: #1b262c; line-height: 140%; text-align: left; word-wrap: break-word;">
        <p style="font-size: 14px; line-height: 140%;">${message}</p>
      </div>
    
          </td>
        </tr>
      </tbody>
    </table>
    
      <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
      </div>
    </div>
    <!--[if (mso)|(IE)]></td><![endif]-->
          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>
    
    
    
    <div class="u-row-container" style="padding: 0px;background-color: transparent">
      <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 650px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #151418;">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px;"><tr style="background-color: #151418;"><![endif]-->
          
    <!--[if (mso)|(IE)]><td align="center" width="650" style="width: 650px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
    <div class="u-col u-col-100" style="max-width: 320px;min-width: 650px;display: table-cell;vertical-align: top;">
      <div style="width: 100% !important;">
      <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
      
    <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td style="overflow-wrap:break-word;word-break:break-word;padding:18px;font-family:'Montserrat',sans-serif;" align="left">
            
      <div style="color: #ffffff; line-height: 140%; text-align: center; word-wrap: break-word;">
        <p dir="rtl" style="font-size: 14px; line-height: 140%;"><span style="font-size: 14px; line-height: 19.6px;">Copyright @ 2023 Task Management System Design | All RIghts Reserved</span></p>
      </div>
    
          </td>
        </tr>
      </tbody>
    </table>
    
      <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
      </div>
    </div>
    <!--[if (mso)|(IE)]></td><![endif]-->
          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>
    
    
        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
        </td>
      </tr>
      </tbody>
      </table>
      <!--[if mso]></div><![endif]-->
      <!--[if IE]></div><![endif]-->
    </body>
    
    </html>`
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
      text: html,
      html:html
    }

    transporter.sendMail(mailOption, (error, result) => {
      if (error) {
        console.log("==error", error)
        reject(error)
      }
      else {
        resolve(result)
      }
    })
  })
}
