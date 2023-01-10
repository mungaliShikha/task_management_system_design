const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports.generateOtp = () => {
  return Math.floor(Math.pow(10, 3) + Math.random() * 9000);
};



module.exports.compareHash = async (data, hash) => {
  return await bcrypt.compareSync(data, hash);
};



module.exports.generateHash = async(data) => {
  return await bcrypt.hashSync(String(data), 10);
};


module.exports.generateToken = (userObject) => {
  let expireTime = 6 * 30 * 72 * 60 * 60 * 1000; //6 months
  return jwt.sign(userObject, global.gConfig.jwtSecretKey, {
    expiresIn: expireTime,
  });
};
