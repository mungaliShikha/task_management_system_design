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
  getTaskByIdAndDelete,
} = require("../services/task.service");
const {
  getOneUser,
  getAllUser,
  getUserById,
  getUserAndUpdate,
  getOneToken,
} = require("../services/user.service");

const {
  getOneProject,
  getAllProject,
  getProjectById,
  getProjectByIdAndUpdate,
} = require("../services/project.service");

module.exports = {
  //******************************** create task to projects *************************************** */
  createTaskToProject: catchAsync(async (req, res) => {
    console.log(req.body);
    const {
      projectId,
      name,
      type,
      priority,
      start_date,
      due_date,
      developer_assigned,
    } = req.body;
    const managerAuth = await getOneUser({
      _id: req.userId,
      role: enums.declaredEnum.role.MANAGER,
      status: enums.declaredEnum.status.ACTIVE,
    });
    if (!managerAuth) {
      throw new appError(ErrorMessage.USER_NOT_FOUND, ErrorCode.NOT_FOUND);
    }

    const projectRes = await getOneProject({
      _id: projectId,
      projectStatus: { $ne: enums.declaredEnum.projectStatus.COMPLETED },
    });
    if (!projectRes) {
      throw new appError(ErrorMessage.DATA_NOT_FOUND, ErrorCode.NOT_FOUND);
    }

    req.body.manager = managerAuth._id;
    req.body.projectId = projectRes._id;

    let taskRes = await createTask(req.body);

    helper.commonResponse(
      res,
      SuccessCode.SUCCESS,
      taskRes,
      SuccessMessage.TASK_ADD
    );
  }),

  //******************************** get the list of all tasks ************************************ */

  listTaskOnparticularProject: catchAsync(async (req, res) => {
    const { _id } = req.body;
    if (req.body.search) {
      query.name = new RegExp("^" + req.body.search, "i");
    }
    const allAuthRes = await getOneUser({
      _id: req.userId,
      status: enums.declaredEnum.status.ACTIVE,
    });
    if (!allAuthRes) {
      throw new appError(ErrorMessage.USER_NOT_FOUND, ErrorCode.NOT_FOUND);
    }
    if (allAuthRes && allAuthRes.role !== enums.declaredEnum.role.MANAGER) {
      throw new appError(ErrorMessage.CANNOT_ACCESS_DATA, ErrorCode.FORBIDDEN);
    }
    const projectFindRes = await getOneProject({
      _id: _id,
      projectStatus: { $ne: enums.declaredEnum.projectStatus.COMPLETED },
    });
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
      .populate("projectId manager developer_assigned comments_in_task")
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

  //********************************************* update the particular task ****************************** */
  updateTask: catchAsync(async (req, res) => {
    const {
      taskId,
      name,
      type,
      priority,
      start_date,
      due_date,
      developer_assigned,
    } = req.body;
    const managerAuth = await getOneUser({
      _id: req.userId,
      role: enums.declaredEnum.role.MANAGER,
      status: enums.declaredEnum.status.ACTIVE,
    });
    if (!managerAuth) {
      throw new appError(ErrorMessage.USER_NOT_FOUND, ErrorCode.NOT_FOUND);
    }
    const projectRes = await getOneTask({
      _id: taskId,
      taskStatus: { $ne: enums.declaredEnum.taskStatus.COMPLETED },
    });
    if (!projectRes) {
      throw new appError(ErrorMessage.DATA_NOT_FOUND, ErrorCode.NOT_FOUND);
    }
    let updatedTask = await getTaskByIdAndUpdate(taskId, req.body, {
      new: true,
    });
    helper.commonResponse(
      res,
      SuccessCode.SUCCESS,
      updatedTask,
      SuccessMessage.TASK_UPDATE
    );
  }),

  //**************************************** add developer to particular task ******************************** */

  addDeveloperToTask: catchAsync(async (req, res) => {
    let { developers, taskId } = req.body;
    if (typeof developers !== "object") {
      throw new appError(
        ErrorMessage.DATA_SHOULD_BE_ARRAY,
        ErrorCode.VALIDATION_FAILED
      );
    }
    const managerAuthCheck = await getOneUser({
      _id: req.userId,
      status: enums.declaredEnum.status.ACTIVE,
    });
    if (
      managerAuthCheck &&
      managerAuthCheck.role != enums.declaredEnum.role.MANAGER
    ) {
      throw new appError(ErrorMessage.INVALID_TOKEN, ErrorCode.NOT_ALLOWED);
    } else if (!managerAuthCheck) {
      throw new appError(ErrorMessage.MANAGER_NOT_EXIST, ErrorCode.NOT_FOUND);
    }
    const taskCheckRes = await getTaskById(taskId);
    if (
      taskCheckRes &&
      taskCheckRes.status == enums.declaredEnum.status.DELETE
    ) {
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

  //************************************* view all tasks ************************************************* */
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

  //******************************* remove developer from a particular task ******************************** */

  // removeDeveloperFromTask: catchAsync(async (req, res) => {
  //   let { developers, taskId } = req.body;
  //   const managerAuthCheck = await getOneUser({ _id: req.userId });
  //   if (
  //     managerAuthCheck &&
  //     managerAuthCheck.role != enums.declaredEnum.role.MANAGER
  //   ) {
  //     throw new appError(ErrorMessage.INVALID_TOKEN, ErrorCode.NOT_ALLOWED);
  //   } else if (!managerAuthCheck) {
  //     throw new appError(ErrorMessage.MANAGER_NOT_EXIST, ErrorCode.NOT_FOUND);
  //   }
  //   if (typeof developers !== "object") {
  //     throw new appError(
  //       ErrorMessage.DATA_SHOULD_BE_ARRAY,
  //       ErrorCode.VALIDATION_FAILED
  //     );
  //   }
  //   const taskCheckRes = await getTaskById(taskId);
  //   if (
  //     taskCheckRes &&
  //     taskCheckRes.status == enums.declaredEnum.taskStatus.DELETE
  //   ) {
  //     throw new appError(ErrorMessage.TASK_DELETED, ErrorCode.NOT_FOUND);
  //   } else if (!taskCheckRes) {
  //     throw new appError(ErrorMessage.PROJECT_NOT_EXIST, ErrorCode.NOT_FOUND);
  //   }
  //   const newTask = await getTaskByIdAndUpdate(
  //     { _id: taskId },
  //     {
  //       $pullAll: {
  //         developer_assigned: developers,
  //       },
  //     },
  //     { new: true }
  //   );
  //   helper.commonResponse(
  //     res,
  //     SuccessCode.SUCCESS,
  //     newTask,
  //     SuccessMessage.DEVELOPER_ASSIGNED
  //   );
  // }),

  removeDeveloperFromTask: catchAsync(async (req, res) => {
    let { developers, taskId } = req.body;
    const managerAuthCheck = await getOneUser({
      _id: req.userId,
      status: enums.declaredEnum.status.ACTIVE,
    });
    if (
      managerAuthCheck &&
      managerAuthCheck.role != enums.declaredEnum.role.MANAGER
    ) {
      throw new appError(ErrorMessage.INVALID_TOKEN, ErrorCode.NOT_ALLOWED);
    } else if (!managerAuthCheck) {
      throw new appError(ErrorMessage.MANAGER_NOT_EXIST, ErrorCode.NOT_FOUND);
    }
    if (typeof developers !== "object") {
      throw new appError(
        ErrorMessage.DATA_SHOULD_BE_ARRAY,
        ErrorCode.VALIDATION_FAILED
      );
    }
    const taskCheckRes = await getTaskById(taskId);
    if (
      taskCheckRes &&
      taskCheckRes.status == enums.declaredEnum.status.DELETE
    ) {
      throw new appError(ErrorMessage.TASK_DELETED, ErrorCode.NOT_FOUND);
    } else if (!taskCheckRes) {
      throw new appError(ErrorMessage.PROJECT_NOT_EXIST, ErrorCode.NOT_FOUND);
    }
    const newTask = await getTaskByIdAndUpdate(
      { _id: taskId },
      {
        $pullAll: {
          developer_assigned: developers,
        },
      },
      { new: true }
    );
    helper.commonResponse(
      res,
      SuccessCode.SUCCESS,
      newTask,
      SuccessMessage.DEVELOPER_ASSIGNED
    );
  }),

  //***************************************** change the status of the task by the developer ********************** */
  changeTaskStatusByDev: catchAsync(async (req, res) => {
    const { taskId, taskStatus } = req.body;
    const developerAuth = await getOneUser({
      _id: req.userId,
      role: enums.declaredEnum.role.DEVELOPER,
      status: enums.declaredEnum.status.ACTIVE,
    });
    if (!developerAuth) {
      throw new appError(ErrorMessage.DATA_AUTHORIZTAION, ErrorCode.NOT_FOUND);
    }
    const taskResult = await getOneTask({
      _id: taskId,
      developer_assigned: { $in: [developerAuth._id] },
      taskStatus: { $ne: enums.declaredEnum.taskStatus.COMPLETED },
    });
    if (!taskResult) {
      throw new appError(ErrorMessage.DATA_NOT_FOUND, ErrorCode.NOT_FOUND);
    }

    let updatedTask = await getTaskByIdAndUpdate(
      { _id: taskId },
      { $set: { taskStatus: taskStatus } }
    );
    helper.commonResponse(
      res,
      SuccessCode.SUCCESS,
      updatedTask,
      SuccessMessage.TASK_UPDATE
    );
  }),
};
