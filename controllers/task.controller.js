const User = require("../models/user.model");
const task = require("../models/task.model");
const project = require("../models/project.model");
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
  createTaskToProject: catchAsync(async (req, res) => {
    const {
      projectId,
      name,
      type,
      priority,
      start_date,
      due_date,
      developer_assigned,
    } = req.body;
    const managerAuth = await User.findOne({
      _id: req.userId,
      role: "Manager",
    });
    if (!managerAuth) {
      throw new appError(ErrorMessage.USER_NOT_FOUND, ErrorCode.NOT_FOUND);
    }

    const projectRes = await project.findOne({ _id: projectId });
    if (!projectRes) {
      throw new appError(ErrorMessage.DATA_NOT_FOUND, ErrorCode.NOT_FOUND);
    }

    req.body.manager = managerAuth._id;
    req.body.projectId = projectRes._id;

    let taskRes = await task.create(req.body);

    helper.commonResponse(
      res,
      SuccessCode.SUCCESS,
      taskRes,
      SuccessMessage.TASK_ADD
    );
  }),

  listTaskOnparticularProject: catchAsync(async (req, res) => {
    const { _id } = req.body;
    if (req.body.search) {
      query.name = new RegExp("^" + req.body.search, "i");
    }
    const allAuthRes = await User.findOne({ _id: req.userId });
    if (allAuthRes && allAuthRes.role !== ("Manager" || "Developer")) {
      throw new appError(ErrorMessage.CANNOT_ACCESS_DATA, ErrorCode.FORBIDDEN);
    }
    if (!allAuthRes) {
      throw new appError(ErrorMessage.USER_NOT_FOUND, ErrorCode.NOT_FOUND);
    }
    const projectFindRes = await project.findOne({ _id: _id });
    if (!projectFindRes) {
      throw new appError(ErrorMessage.DATA_NOT_FOUND, ErrorCode.NOT_FOUND);
    }
    let queryMade = {
      projectId: projectFindRes._id,
      status: { $ne: "DELETE" },
    };
    if (req.body.search) {
      queryMade.name = new RegExp("^" + req.body.search, "i");
    }
    let { page, limit } = req.query;
    page = req.query.page || 1;
    limit = req.query.limit || 10;
    const taskListRes = await task
      .find(queryMade)
      .populate("projectId manager developer_assigned")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await task.countDocuments();
    if (taskListRes.length == 0) {
      throw new appError(ErrorMessage.DATA_NOT_FOUND, ErrorCode.NOT_FOUND);
    }
    let final = {
      task: taskListRes,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };
    helper.commonResponse(
      res,
      SuccessCode.SUCCESS,
      final,
      SuccessMessage.DATA_FOUND
    );
  }),

  addDeveloperToTask: catchAsync(async (req, res) => {
    let { developers, taskId } = req.body;
    const managerAuthCheck = await User.findOne({ _id: req.userId });
    if (managerAuthCheck && managerAuthCheck.role != "Manager") {
      throw new appError(ErrorMessage.INVALID_TOKEN, ErrorCode.NOT_ALLOWED);
    } else if (!managerAuthCheck) {
      throw new appError(ErrorMessage.MANAGER_NOT_EXIST, ErrorCode.NOT_FOUND);
    }
    let developerCheckRes = await User.findOne({ _id: developers });
    if (!developerCheckRes) {
      throw new appError(ErrorMessage.USER_NOT_FOUND, ErrorCode.NOT_FOUND);
    }
    const taskCheckRes = await task.findById(taskId);
    if (taskCheckRes && taskCheckRes.active_status == "DELETE") {
      throw new appError(ErrorMessage.PROJECT_DELETED, ErrorCode.NOT_FOUND);
    } else if (!taskCheckRes) {
      throw new appError(ErrorMessage.PROJECT_NOT_EXIST, ErrorCode.NOT_FOUND);
    }
    const newProject = await task.findOneAndUpdate(
      { _id: taskId },
      { $addToSet: { developer_assigned: developers } },
      { new: true }
    );
    helper.commonResponse(
      res,
      SuccessCode.SUCCESS,
      newProject,
      SuccessMessage.DEVELOPER_ASSIGNED
    );
  }),

  viewAllTask: catchAsync(async (req, res) => {
    const allTask = await task.find().populate("developer_assigned");
    helper.commonResponse(
      res,
      SuccessCode.SUCCESS,
      allTask,
      SuccessMessage.DATA_FOUND
    );
  }),

removeDeveloperFromTask:catchAsync(async(req,res)=>{
    
})

};
