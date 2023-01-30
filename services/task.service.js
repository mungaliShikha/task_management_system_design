const Task = require("../models/task.model");

const getOneTask = async (params) => {
  return Task.findOne(params);
};
const getAllTask = async (id) => {
  return Task.find(id);
};

const getTaskById = async () => {
  return Task.findById();
};

const getTaskByIdAndUpdate = async (id, update, data) => {
  return Task.findByIdAndUpdate(id, update, { new: true });
};
const createTask = async (body) => {
  return Task.create(body);
};

const countTask = async () => {
  return Task.countDocuments();
};

const getTaskByIdAndDelete = async (id, update) => {
  return Task.findByIdAndDelete(id, update, { new: true });
};

module.exports = {
  getOneTask,
  getAllTask,
  getTaskById,
  getTaskByIdAndUpdate,
  createTask,
  countTask,
  getTaskByIdAndDelete,
};
