const Project = require("../models/project.model");


const getOneProject = async (params) => {
  return Project.findOne(params);
};
const getAllProject = async () => {
  return Project.find();
};

const getProjectById = async (id) => {
  return Project.findById(id);
};

const getProjectAndUpdate = async (id, update,data) => {
  return Project.findOneAndUpdate(id, update, data);
};

const createProject = async (data) => {
  return Project.create(data);
};
const countProject = async() =>{
    return Project.countDocuments();
}

const getProjectByIdAndUpdate = async(id,update) =>{
  return Project.findByIdAndUpdate(id,update,{new:true});
}

module.exports = {
  getOneProject,
  getAllProject,
  getProjectById,
  getProjectAndUpdate,
  createProject,
  countProject,
  getProjectByIdAndUpdate
};