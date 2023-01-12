const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports.generateOtp = () => {
  return Math.floor(Math.pow(10, 3) + Math.random() * 9000);
};



module.exports.compareHash = (data, hash) => {
  return bcrypt.compareSync(data, hash);
};



module.exports.generateHash = (data) => {
  return bcrypt.hashSync(String(data), 10);
};


module.exports.generateToken = (userObject) => {
  let expireTime = 6 * 30 * 72 * 60 * 60 * 1000; //6 months
  return jwt.sign(userObject, global.gFields.jwtSecretKey, {
    expiresIn: expireTime,
  });
};




module.exports.generatePassword =()=> {
      var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
      var value = 8
      var randomstring = '';
      for (var i = 0; i < value; i++) {
          var rnum = Math.floor(Math.random() * chars.length);
           randomstring += chars.substring(rnum, rnum + 1);
          console.log("===",randomstring,"Subhra",rnum)
      }
  }

 module.exports.randomPassword=()=>{
      var randomstring = Math.random().toString(36).slice(-7);
      return randomstring;
  }



  module.exports.generateEmployeeId = (role) => {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var IdLength = 7;
    var EmployeeId = "";
    for (var i = 1; i <= IdLength; i++) {
      var randomNumber = Math.floor(Math.random() * chars.length + 1);
      EmployeeId += chars.charAt(randomNumber);
    }
    if (role == "Manager") {
      return "MAN" + EmployeeId;
    }
    if (role == Developer) {
      return "DEV" + EmployeeId;
    }
  };

