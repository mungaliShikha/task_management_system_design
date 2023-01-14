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
      throw new appError(ErrorMessage.USER_NOT_FOUND, ErrorCode.NOT_FOUND);
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

  listProject: catchAsync(async (req, res) => {
    
  }),
};
