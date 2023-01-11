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
  return jwt.sign(userObject, global.gConfig.jwtSecretKey, {
    expiresIn: expireTime,
  });
};
