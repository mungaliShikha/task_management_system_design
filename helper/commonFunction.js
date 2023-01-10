const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary');
const async = require('async');


module.exports = {

  getOTP() {
    var otp = Math.floor(1000 + Math.random() * 9000);
    return otp;
  }

}
