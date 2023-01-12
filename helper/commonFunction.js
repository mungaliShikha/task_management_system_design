const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports.generateOtp = () => {
  return Math.floor(Math.pow(10, 3) + Math.random() * 9000);
};

module.exports.compareHash = async (data, hash) => {
  return await bcrypt.compareSync(data, hash);
};

module.exports.generateHash = async (data) => {
  return await bcrypt.hashSync(String(data), 10);
};

module.exports.generatePassword = () => {
  var chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&";
  var passwordLength = 8;
  var password = "";
  for (var i = 1; i <= passwordLength; i++) {
    var randomNumber = Math.floor(Math.random() * chars.length + 1);
    password += chars.charAt(randomNumber);
  }
  return password;
};

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

module.exports.generateToken = (userObject) => {
  let expireTime = 6 * 30 * 72 * 60 * 60 * 1000; //6 months
  return jwt.sign(userObject, global.gConfig.jwtSecretKey, {
    expiresIn: expireTime,
  });
};
