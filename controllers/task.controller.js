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
  addTaskToProject: catchAsync(async (req, res) => {
    const { projectId, name, type, priority, start_date, due_date } = req.body;
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
    const allAuthRes = await User.findOne({ _id: req.userId });
    if (!allAuthRes) {
      throw new appError(ErrorMessage.USER_NOT_FOUND, ErrorCode.NOT_FOUND);
    }
    const projectFindRes = await project.findOne({ _id: _id });
    if (!projectFindRes) {
      throw new appError(ErrorMessage.DATA_NOT_FOUND, ErrorCode.NOT_FOUND);
    }

    const taskListRes = await task.find({ projectId: projectFindRes._id });
    if (taskListRes.length == 0) {
      throw new appError(ErrorMessage.DATA_NOT_FOUND, ErrorCode.NOT_FOUND);
    }
    helper.commonResponse(
      res,
      SuccessCode.SUCCESS,
      taskListRes,
      SuccessMessage.DATA_FOUND
    );
  }),
};
