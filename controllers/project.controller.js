const User = require("../models/user.model");
const Project = require("../models/project.model");
const task = require("../models/task.model");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/errorHandlers/errorHandler");
const { ErrorMessage, SuccessMessage } = require("../helper/message");
const { ErrorCode, SuccessCode } = require("../helper/statusCode");
const {
  compareHash,
  generateToken,
  generatePassword,
  randomPassword,
  generateHash,
} = require("../helper/commonFunction");
const helper = require("../helper/commonResponseHandler");
const {
  sendMail,
  sendMailNotify,
} = require("../services/nodeMailer/nodemailer");

module.exports = {
  createProject: catchAsync(async (req, res) => {
    let { managerId } = req.params;
    const managerAuthCheck = await User.findById(managerId);
    if (managerAuthCheck && managerAuthCheck.role != "Manager") {
      throw new appError(ErrorMessage.INVALID_TOKEN, ErrorCode.NOT_ALLOWED);
    } else if (!managerAuthCheck) {
      throw new appError(ErrorMessage.MANAGER_NOT_EXIST, ErrorCode.NOT_FOUND);
    }
    const {
      project_name,
      description,
      status,
      project_task,
      developers,
      manager,
      active_status,
    } = req.body;
    const projectName = await Project.findOne({ project_name });
    if (projectName) {
      throw new appError(
        ErrorMessage.PROJECT_ALREADY_CREATED,
        ErrorCode.NOT_FOUND
      );
    }
    if (
      project_name ||
      description ||
      status ||
      project_task ||
      developers ||
      manager ||
      active_status
    ) {
      let finalData = await Project.create(req.body);
      helper.commonResponse(
        res,
        SuccessCode.SUCCESS,
        finalData,
        SuccessMessage.PROJECT_ADDED
      );
    }
  }),




  
  addDeveloperToProject :catchAsync(async(req,res)=>{
    let { managerId , projectId } = req.params;
    const managerAuthCheck = await User.findById(managerId);
    if (managerAuthCheck && managerAuthCheck.role != "Manager") {
      throw new appError(ErrorMessage.INVALID_TOKEN, ErrorCode.NOT_ALLOWED);
    } else if (!managerAuthCheck) {
      throw new appError(ErrorMessage.MANAGER_NOT_EXIST, ErrorCode.NOT_FOUND);
    }

    const projectAuthCheck = await Project.findById(projectId);
    if (projectAuthCheck && projectAuthCheck.active_status == "DELETE") {
      throw new appError(ErrorMessage.PROJECT_DELETED, ErrorCode.NOT_FOUND);
    } else if (!projectAuthCheck) {
      throw new appError(ErrorMessage.PROJECT_NOT_EXIST, ErrorCode.NOT_FOUND);
    }

    const {developer} = req.body
    
    
    const newProject = await Project.findOneAndUpdate({_id:projectId}, {$addToSet:{developer:developer}},{new:true})


    helper.commonResponse(
      res,
      SuccessCode.SUCCESS,
      newProject,
      SuccessMessage.PROJECT_ADDED
    );

    
  }),
  
  addManagerToProject:catchAsync(async(req,res)=>{
    let { managerId , projectId } = req.params;
    const managerAuthCheck = await User.findById(managerId);
    if (managerAuthCheck && managerAuthCheck.role != "Manager") {
      throw new appError(ErrorMessage.INVALID_TOKEN, ErrorCode.NOT_ALLOWED);
    } else if (!managerAuthCheck) {
      throw new appError(ErrorMessage.MANAGER_NOT_EXIST, ErrorCode.NOT_FOUND);
    }

    const projectAuthCheck = await Project.findById(projectId);
    if (projectAuthCheck && projectAuthCheck.active_status == "DELETE") {
      throw new appError(ErrorMessage.PROJECT_DELETED, ErrorCode.NOT_FOUND);
    } else if (!projectAuthCheck) {
      throw new appError(ErrorMessage.PROJECT_NOT_EXIST, ErrorCode.NOT_FOUND);
    }

    const {manager} = req.body
    
    
    const newProject = await Project.findOneAndUpdate({_id:projectId}, {$addToSet:{manager:manager}},{new:true})


    helper.commonResponse(
      res,
      SuccessCode.SUCCESS,
      newProject,
      SuccessMessage.PROJECT_ADDED
    );
  }),
  
  
  addTaskToProject:catchAsync(async(req,res)=>{
    
  }),
  




  listProject: catchAsync(async (req, res) => {
    var query = { active_status: { $ne: "DELETE" }, 
   };
    if (req.body.search) {
      query.project_name = new RegExp("^" + req.body.search, "i");
    }
    req.body.limit = parseInt(req.body.limit);
    req.body.page= parseInt(req.body.page)
    var options = {
      page: req.body.page || 1,
      limit: req.body.limit || 10,
      sort: { createdAt: -1 },
    };
    let ProjectList = await Project.paginate(query, options);

    if (ProjectList.length == 0) {
      throw new appError(ErrorMessage.DATA_NOT_FOUND, ErrorCode.NOT_FOUND);
    }

    helper.commonResponse(
      res,
      SuccessCode.SUCCESS,
      ProjectList,
      SuccessMessage.DATA_FOUND
    );
  }),


viewProject:catchAsync(async(req,res)=>{
  // const {projectId} = req.params
  const projectView = await Project.aggregate([
    {$lookup:{from:"users",localField:"developer",foreignField:"email",as:"devlopersList"}},
    {$lookup:{from:"users",localField:"manager",foreignField:"email",as:"managerList"}},
    { $project : { _id : 0, 'developer' : 0, 'manager' : 0,'project_task':0 ,"createdAt": 0,
    "updatedAt":0,"__v": 0} }
    ])
    helper.commonResponse(
      res,
      SuccessCode.SUCCESS,
      projectView,
      SuccessMessage.DATA_FOUND
    );
})


};
