const task = require("../models/task.model");
const catchAsync = require("../helper/catchAsync");
const appError = require("../helper/errorHandlers/errorHandler");
const { ErrorMessage, SuccessMessage } = require("../helper/message");
const { ErrorCode, SuccessCode } = require("../helper/statusCode");
const helper = require("../helper/commonResponseHandler");
const enums = require("../helper/enum/enums");
const {
  getOneTask,
  getAllTask,
  getTaskById,
  getTaskByIdAndUpdate,
  createTask,
  countTask,
  getTaskByIdAndDelete
} = require("../services/task.service")
const {
  getOneUser,
  getAllUser,
  getUserById,
  getUserAndUpdate,
  getOneToken
} = require("../services/user.service")

const {
  getOneProject,
  getAllProject,
  getProjectById,
  getProjectByIdAndUpdate
} = require("../services/project.service")

module.exports = {
  createTaskToProject: catchAsync(async (req, res) => {
    const validationSchema = {
      name: joi.string().required(),
      type: joi.string().required(),
      priority: joi.string().required(),
      start_date: joi.string().required(),
      due_date: joi.string().required(),
      developer_assigned: Joi.array().items(Joi.string()).optional()
    };
    const validatedBody = await joi.validate(req.body, validationSchema);
    const managerAuth = await getOneUser({
      _id: req.userId,
      role: enums.declaredEnum.role.MANAGER,
    });
    if (!managerAuth) {
      throw new appError(ErrorMessage.USER_NOT_FOUND, ErrorCode.NOT_FOUND);
    }

    const projectRes = await getOneProject({ _id: validatedBody.projectId });
    if (!projectRes) {
      throw new appError(ErrorMessage.DATA_NOT_FOUND, ErrorCode.NOT_FOUND);
    }

    validatedBody.manager = managerAuth._id;
    validatedBody.projectId = projectRes._id;

    let taskRes = await createTask(validatedBody);

    helper.commonResponse(
      res,
      SuccessCode.SUCCESS,
      taskRes,
      SuccessMessage.TASK_ADD
    );
  }),

  listTaskOnparticularProject: catchAsync(async (req, res) => {
    const validationSchema = {
      _id: joi.string().required(),
    };
    const { _id } = await joi.validate(req.body, validationSchema);
    if (req.body.search) {
      query.name = new RegExp("^" + req.body.search, "i");
    }
    const allAuthRes = await getOneUser({ _id: req.userId });
    if (!allAuthRes) {
      throw new appError(ErrorMessage.USER_NOT_FOUND, ErrorCode.NOT_FOUND);
    }
    if (allAuthRes && allAuthRes.role !== enums.declaredEnum.role.MANAGER) {
      throw new appError(ErrorMessage.CANNOT_ACCESS_DATA, ErrorCode.FORBIDDEN);
    }
    const projectFindRes = await getOneProject({ _id: _id });
    if (!projectFindRes) {
      throw new appError(ErrorMessage.DATA_NOT_FOUND, ErrorCode.NOT_FOUND);
    }
    let queryMade = {
      projectId: projectFindRes._id,
      status: { $ne: enums.declaredEnum.status.DELETE },
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
    const count = await countTask();
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

  updateTask: catchAsync(async (req, res) => {
    const validationSchema = {
      taskId: joi.string().required(),
      name: joi.string().optional(),
      type: joi.string().required(),
      priority: joi.string().required(),
      start_date: Joi.string().required(),
      due_date: joi.string().required(),
      developer_assigned: Joi.array().items(Joi.string()).optional()
    };
    const validatedBody = await joi.validate(req.body, validationSchema);

    const managerAuth = await getOneUser({
      _id: req.userId,
      role: enums.declaredEnum.role.MANAGER,
    });
    if (!managerAuth) {
      throw new appError(ErrorMessage.USER_NOT_FOUND, ErrorCode.NOT_FOUND);
    }
    const projectRes = await getOneTask({ _id: validatedBody.taskId });
    if (!projectRes) {
      throw new appError(ErrorMessage.DATA_NOT_FOUND, ErrorCode.NOT_FOUND);
    }
    let updatedTask = await getTaskByIdAndUpdate(validatedBody.taskId, validatedBody);
    helper.commonResponse(
      res,
      SuccessCode.SUCCESS,
      updatedTask,
      SuccessMessage.TASK_UPDATE
    );
  }),

  addDeveloperToTask: catchAsync(async (req, res) => {
    const validationSchema = {
      taskId: joi.string().required(),
      developers: Joi.array().items(Joi.string()).required()
    };
    const {developers, taskId} = await joi.validate(req.body, validationSchema);
    if (typeof developers !== "object") {
      throw new appError(ErrorMessage.DATA_SHOULD_BE_ARRAY, ErrorCode.VALIDATION_FAILED);
    }
    const managerAuthCheck = await getOneUser({ _id: req.userId });
    if (managerAuthCheck && managerAuthCheck.role != enums.declaredEnum.role.MANAGER) {
      throw new appError(ErrorMessage.INVALID_TOKEN, ErrorCode.NOT_ALLOWED);
    } else if (!managerAuthCheck) {
      throw new appError(ErrorMessage.MANAGER_NOT_EXIST, ErrorCode.NOT_FOUND);
    }
    const taskCheckRes = await getTaskById(taskId);
    if (taskCheckRes && taskCheckRes.status == enums.declaredEnum.taskStatus.DELETE) {
      throw new appError(ErrorMessage.TASK_DELETED, ErrorCode.NOT_FOUND);
    } else if (!taskCheckRes) {
      throw new appError(ErrorMessage.PROJECT_NOT_EXIST, ErrorCode.NOT_FOUND);
    }
    const newProject = await getTaskByIdAndUpdate(
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
    if (allTask.length == 0) {
      throw new appError(ErrorMessage.DATA_NOT_FOUND, ErrorCode.NOT_FOUND);
    }
    helper.commonResponse(
      res,
      SuccessCode.SUCCESS,
      allTask,
      SuccessMessage.DATA_FOUND
    );
  }),

  removeDeveloperFromTask: catchAsync(async (req, res) => {
    const validationSchema = {
      taskId: joi.string().required(),
      developers: Joi.array().items(Joi.string()).required()
    };
    const {developers, taskId} = await joi.validate(req.body, validationSchema);
    const managerAuthCheck = await getOneUser({ _id: req.userId });
    if (managerAuthCheck && managerAuthCheck.role != enums.declaredEnum.role.MANAGER) {
      throw new appError(ErrorMessage.INVALID_TOKEN, ErrorCode.NOT_ALLOWED);
    } else if (!managerAuthCheck) {
      throw new appError(ErrorMessage.MANAGER_NOT_EXIST, ErrorCode.NOT_FOUND);
    }
    if (typeof developers !== "object") {
      throw new appError(ErrorMessage.DATA_SHOULD_BE_ARRAY, ErrorCode.VALIDATION_FAILED);
    }
    const taskCheckRes = await getTaskById(taskId);
    if (taskCheckRes && taskCheckRes.status == enums.declaredEnum.taskStatus.DELETE) {
      throw new appError(ErrorMessage.TASK_DELETED, ErrorCode.NOT_FOUND);
    } else if (!taskCheckRes) {
      throw new appError(ErrorMessage.PROJECT_NOT_EXIST, ErrorCode.NOT_FOUND);
    }
    const newTask = await getTaskByIdAndUpdate(
      { _id: taskId },
      {
        $pullAll: {
          developer_assigned: developers,
        }
      }, { new: true }
    );
    helper.commonResponse(
      res,
      SuccessCode.SUCCESS,
      newTask,
      SuccessMessage.DEVELOPER_ASSIGNED
    );
  }),

  changeTaskStatusByDev: catchAsync(async (req, res) => {
    const validationSchema = {
      taskId: joi.string().required(),
      taskStatus: Joi.string().valid('inProgress', 'inQA','completed')
    };
    const {taskStatus, taskId} = await joi.validate(req.body, validationSchema);
  
    const developerAuth = await getOneUser({
      _id: req.userId,
      role: enums.declaredEnum.role.DEVELOPER,
    });
    if (!developerAuth) {
      throw new appError(ErrorMessage.DATA_AUTHORIZTAION, ErrorCode.NOT_FOUND);
    }
    const taskResult = await getOneTask({ _id: taskId, developer_assigned: { $in: [developerAuth._id] } });
    if (!taskResult) {
      throw new appError(ErrorMessage.DATA_NOT_FOUND, ErrorCode.NOT_FOUND);
    }

    let updatedTask = await getTaskByIdAndUpdate({ _id: taskId }, { $set: { taskStatus: taskStatus } }, { new: true });
    helper.commonResponse(
      res,
      SuccessCode.SUCCESS,
      updatedTask,
      SuccessMessage.TASK_UPDATE
    );
  }),

};
