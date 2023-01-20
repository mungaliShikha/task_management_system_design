const Project = require("../models/project.model");
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
  createProject,
  countProject,
} = require("../services/project.service");
module.exports = {
  //************************************************create project ************************************** */
  createProject: catchAsync(async (req, res) => {
    const {
      project_name,
      description,
      status,
      project_task,
      developers,
      active_status,
    } = req.body;
    const managerAuthCheck = await getOneUser({
      _id: req.userId,
      role: enums.declaredEnum.role.MANAGER,
    });
    if (!managerAuthCheck) {
      throw new appError(ErrorMessage.MANAGER_NOT_EXIST, ErrorCode.NOT_FOUND);
    }
    const projectName = await getOneProject({ project_name });
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
      managerId = managerAuthCheck._id.toString();
      req.body.manager = managerId.split(" ");
      let finalData = await createProject(req.body);
      helper.commonResponse(
        res,
        SuccessCode.SUCCESS,
        finalData,
        SuccessMessage.PROJECT_ADDED
      );
    }
  }),

  //*********************************** add manager to project************************* */
  addManagerToProject: catchAsync(async (req, res) => {
    let { projectId } = req.params;
    const managerAuthCheck = await getUserById(req.userId);
    if (
      managerAuthCheck &&
      managerAuthCheck.role != enums.declaredEnum.role.MANAGER
    ) {
      throw new appError(ErrorMessage.INVALID_TOKEN, ErrorCode.NOT_ALLOWED);
    } else if (!managerAuthCheck) {
      throw new appError(ErrorMessage.MANAGER_NOT_EXIST, ErrorCode.NOT_FOUND);
    }

    const projectAuthCheck = await getProjectById(projectId);
    if (
      projectAuthCheck &&
      projectAuthCheck.projectStatus ==
        enums.declaredEnum.projectStatus.COMPLETED
    ) {
      throw new appError(ErrorMessage.PROJECT_STATUS, ErrorCode.NOT_FOUND);
    } else if (!projectAuthCheck) {
      throw new appError(ErrorMessage.PROJECT_NOT_EXIST, ErrorCode.NOT_FOUND);
    }

    const { manager } = req.body;

    const newProject = await getProjectByIdAndUpdate(
      { _id: projectId },
      { $addToSet: { manager: manager } },
      { new: true }
    );

    helper.commonResponse(
      res,
      SuccessCode.SUCCESS,
      newProject,
      SuccessMessage.PROJECT_ADDED
    );
  }),

  //***************************** add task to project ************************************************* */
  addTaskToProject: catchAsync(async (req, res) => {
    const { projectId } = req.params;
    const { project_task } = req.body;
    const managerAuthCheck = await getUserById(req.userId);
    if (
      managerAuthCheck &&
      managerAuthCheck.role != enums.declaredEnum.role.MANAGER
    ) {
      throw new appError(ErrorMessage.INVALID_TOKEN, ErrorCode.NOT_ALLOWED);
    } else if (!managerAuthCheck) {
      throw new appError(ErrorMessage.MANAGER_NOT_EXIST, ErrorCode.NOT_FOUND);
    }

    const projectAuthCheck = await getProjectById(projectId);
    if (
      projectAuthCheck &&
      projectAuthCheck.projectStatus ==
        enums.declaredEnum.projectStatus.COMPLETED
    ) {
      throw new appError(ErrorMessage.PROJECT_STATUS, ErrorCode.NOT_FOUND);
    } else if (!projectAuthCheck) {
      throw new appError(ErrorMessage.PROJECT_NOT_EXIST, ErrorCode.NOT_FOUND);
    }

    const newProject = await getProjectByIdAndUpdate(
      { _id: projectId },
      { $addToSet: { project_task: project_task } },
      { new: true }
    );

    helper.commonResponse(
      res,
      SuccessCode.SUCCESS,
      newProject,
      SuccessMessage.PROJECT_ADDED
    );
  }),

  //********************************************* list of all the projects *********************************8 */
  listProject: catchAsync(async (req, res) => {
    const managerAuthCheck = await getUserById(req.userId);
    if (
      managerAuthCheck &&
      managerAuthCheck.role !== enums.declaredEnum.role.MANAGER
    ) {
      throw new appError(ErrorMessage.CANNOT_ACCESS_DATA, ErrorCode.FORBIDDEN);
    }

    var queryMade = {
      projectStatus: { $ne: enums.declaredEnum.status.DELETE },
    };
    if (req.body.search) {
      queryMade.project_name = new RegExp("^" + req.body.search, "i");
    }
    let { page, limit } = req.query;
    page = req.query.page || 1;
    limit = req.query.limit || 10;
    let projectList = await Project.find(queryMade)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await countProject();
    let final = {
      projects: projectList,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };

    if (projectList.length == 0) {
      throw new appError(ErrorMessage.DATA_NOT_FOUND, ErrorCode.NOT_FOUND);
    }

    helper.commonResponse(
      res,
      SuccessCode.SUCCESS,
      final,
      SuccessMessage.DATA_FOUND
    );
  }),

  //************************************ view the populated project ****************************** */
  viewProject: catchAsync(async (req, res) => {
    // const {projectId} = req.params
    // const projectView = await Project.aggregate([
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "project_task",
    //       foreignField: "_id",
    //       as: "taskList",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "manager",
    //       foreignField: "_id",
    //       as: "managerList",
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       developer: 0,
    //       manager: 0,
    //       project_task: 0,
    //       createdAt: 0,
    //       updatedAt: 0,
    //       __v: 0,
    //     },
    //   },
    // ]);
    const { projectId } = req.params;
    const managerAuthCheck = await getUserById(req.userId);
    if (
      managerAuthCheck &&
      managerAuthCheck.role !== enums.declaredEnum.role.MANAGER
    ) {
      throw new appError(ErrorMessage.CANNOT_ACCESS_DATA, ErrorCode.FORBIDDEN);
    }
    const projectAuthCheck = await getProjectById(projectId);
    if (
      projectAuthCheck &&
      projectAuthCheck.projectStatus ==
        enums.declaredEnum.projectStatus.COMPLETED
    ) {
      throw new appError(ErrorMessage.PROJECT_STATUS, ErrorCode.NOT_FOUND);
    } else if (!projectAuthCheck) {
      throw new appError(ErrorMessage.PROJECT_NOT_EXIST, ErrorCode.NOT_FOUND);
    }

    const projectView = await Project.findById(projectId).populate(
      "manager project_task"
    );
    if (!projectView) {
      throw new appError(ErrorMessage.PROJECT_NOT_EXIST, ErrorCode.NOT_FOUND);
    }
    helper.commonResponse(
      res,
      SuccessCode.SUCCESS,
      projectView,
      SuccessMessage.DATA_FOUND
    );
  }),
  //******************** only admin can remove the manager AND admin  from project ************************ */
  removeManagerFromProject: catchAsync(async (req, res) => {
    const { projectId } = req.params;
    const { manager } = req.body;
    const managerAuthCheck = await getOneUser({
      _id: req.userId,
      role: {
        $in: [enums.declaredEnum.role.MANAGER, enums.declaredEnum.role.ADMIN],
      },
    });
    if (!managerAuthCheck) {
      throw new appError(ErrorMessage.CANNOT_ACCESS_DATA, ErrorCode.FORBIDDEN);
    }
    if (typeof manager !== "object") {
      throw new appError(
        ErrorMessage.DATA_SHOULD_BE_ARRAY,
        ErrorCode.VALIDATION_FAILED
      );
    }
    const projectExist = await getProjectById(projectId);
    if (
      projectExist &&
      projectExist.projectStatus == enums.declaredEnum.projectStatus.COMPLETED
    ) {
      throw new appError(ErrorMessage.PROJECT_STATUS, ErrorCode.NOT_FOUND);
    }
    if (!projectExist) {
      throw new appError(ErrorMessage.PROJECT_NOT_EXIST, ErrorCode.NOT_FOUND);
    }
    const removeManager = await getProjectByIdAndUpdate(
      { _id: projectExist._id },
      {
        $pullAll: {
          manager: manager,
        },
      },
      { new: true }
    );

    helper.commonResponse(
      res,
      SuccessCode.SUCCESS,
      removeManager,
      SuccessMessage.REMOVE_SUCCESS
    );
  }),
  //************************* only manager AND ADMIN  can update the project**************** */
  updateProject: catchAsync(async (req, res) => {
    const { projectId } = req.params;
    const managerAuthCheck = await getOneUser({
      _id: req.userId,
      role: {
        $in: [enums.declaredEnum.role.MANAGER, enums.declaredEnum.role.ADMIN],
      },
    });
    if (!managerAuthCheck) {
      throw new appError(ErrorMessage.CANNOT_ACCESS_DATA, ErrorCode.FORBIDDEN);
    }
    const projectExist = await getProjectById(projectId);
    if (
      projectExist &&
      projectExist.projectStatus == enums.declaredEnum.projectStatus.COMPLETED
    ) {
      throw new appError(ErrorMessage.PROJECT_STATUS, ErrorCode.NOT_FOUND);
    }
    if (!projectExist) {
      throw new appError(ErrorMessage.PROJECT_NOT_EXIST, ErrorCode.NOT_FOUND);
    }
    const removeProject = await getProjectByIdAndUpdate(
      { _id: projectExist._id },
      { $set: { projectStatus: enums.declaredEnum.projectStatus.COMPLETED } },
      { new: true }
    );

    helper.commonResponse(
      res,
      SuccessCode.SUCCESS,
      removeProject,
      SuccessMessage.REMOVE_SUCCESS
    );
  }),
};
