const User = require("../models/user.model");
const Token = require("../models/token.model")

const getOneUser = async (params) => {
  return await User.findOne(params);
};
const getAllUser = async () => {
  return await User.find();
};

const getUserById = async (id) => {
  return await User.findById(id);
};

const getUserAndUpdate = async (id, update, getData) => {
  return await User.findByIdAndUpdate(id, update, getData);
};
const getOneToken = async (params) => {
    return await Token.findOne(params);
  };

module.exports = {
  getOneUser,
  getAllUser,
  getUserById,
  getUserAndUpdate,
  getOneToken
};
