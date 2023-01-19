const Task = require("../models/task.model");


const getOneTask = async (params) => {
  return Task.findOne(params);
};
const getAllTask = async () => {
  return Task.find()
};

const getTaskById = async (id) => {
  return Task.findById(id);
};

const getTaskByIdAndUpdate = async (id, update) => {
  return Task.findByIdAndUpdate(id, update, { new: true });
};
const createTask = async (body) => {
  return Task.create(body);
};

const countTask = async () => {
  return Task.countDocuments();
};

const getTaskByIdAndDelete = async (id, update) => {
  return Task.findByIdAndDelete(id, update, { new: true })
}



module.exports = {
  getOneTask,
  getAllTask,
  getTaskById,
  getTaskByIdAndUpdate,
  createTask,
  countTask,
  getTaskByIdAndDelete
};