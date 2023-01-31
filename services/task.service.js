const Task = require("../models/task.model");


const getOneTask = async (params) => {
  return Task.findOne(params);
};
const getAllTask = async () => {
  return Task.find()
};

const getTask = async (params) => {
  return Task.find(params)
};

const getTaskById = async (id) => {
  return Task.findById(id);
};

const getTaskByIdAndUpdate = async (id, update,data) => {
  return Task.findByIdAndUpdate(id, update,data);
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
  getTaskByIdAndDelete,
  getTask
};