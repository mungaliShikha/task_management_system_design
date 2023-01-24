const User = require("../models/user.model");
const Token = require("../models/token.model");

const getOneUser = async (params) => {
  return User.findOne(params);
};
const getAllUser = async () => {
  return User.find();
};

const getUserById = async (id) => {
  return User.findById(id);
};

const getUserAndUpdate = async (id, update) => {
  return User.findByIdAndUpdate(id, update, { new: true });
};
const getOneToken = async (params) => {
  return Token.findOne(params);
};

const createUser = async (data) => {
  return User.create(data);
};

module.exports = {
  getOneUser,
  getAllUser,
  getUserById,
  getUserAndUpdate,
  getOneToken,
  createUser,
};
