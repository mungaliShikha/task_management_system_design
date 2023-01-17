const User = require("../models/user.model");
const task = require("../models/task.model");
const project = require("../models/project.model");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/errorHandlers/errorHandler");
const { ErrorMessage, SuccessMessage } = require("../helper/message");
const { ErrorCode, SuccessCode } = require("../helper/statusCode");
const { compareHash, generateToken, generatePassword, randomPassword, generateHash } = require("../helper/commonFunction");
const helper = require("../helper/commonResponseHandler");
const { sendMail, sendMailNotify } = require("../services/nodeMailer/nodemailer");

module.exports = {

    addTaskToProject: catchAsync(async (req, res) => {
        const { projectId, name, type, priority, start_date, due_date } = req.body;
        const managerAuth = await User.findOne({ _id: req.userId, role: "Manager" });
        if (!managerAuth) helper.commonResponse(res, ErrorCode.NOT_FOUND, ErrorMessage.USER_NOT_FOUND);

        const projectRes = await project.findOne({ _id: projectId });
        if (!projectRes) helper.commonResponse(res, ErrorCode.NOT_FOUND, ErrorMessage.DATA_NOT_FOUND)

        req.body.manager = managerAuth._id;
        req.body.projectId = projectRes._id;

        let taskRes = await task.create(req.body);
        helper.commonResponse(res, SuccessCode.SUCCESS, taskRes, SuccessMessage.TASK_ADD)

    }),

    listTaskOnparticularProject: catchAsync(async (req, res) => {
        const { _id } = req.body;
        if (req.body.search) {
            query.name = new RegExp("^" + req.body.search, "i");
        }
        const allAuthRes = await User.findOne({ _id: req.userId });
        if (!allAuthRes) helper.commonResponse(res, ErrorCode.NOT_FOUND, ErrorMessage.USER_NOT_FOUND);
        const projectFindRes = await project.findOne({ _id: _id });
        if (!projectFindRes) helper.commonResponse(res, ErrorCode.NOT_FOUND, ErrorMessage.DATA_NOT_FOUND);
        var options = {
            page: req.body.page || 1,
            limit: req.body.limit || 10,
            sort: { createdAt: -1 },
            populate: "projectId manager "
        };
        let query = { projectId: projectFindRes._id }
        const taskListRes = await task.paginate(query, options);
        if (taskListRes.length == 0) helper.commonResponse(res, ErrorCode.NOT_FOUND, ErrorMessage.DATA_NOT_FOUND);
        helper.commonResponse(res, SuccessCode.SUCCESS, taskListRes, SuccessMessage.DATA_FOUND)
    })


};
