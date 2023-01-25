const appError = require("../helper/errorHandlers/errorHandler");
const { ErrorMessage, SuccessMessage } = require("../helper/message");
const { ErrorCode, SuccessCode } = require("../helper/statusCode");
const helper = require("../helper/commonResponseHandler");
const catchAsync = require("../helper/catchAsync");
const Comment = require("../models/comment.model");
const Task = require("../models/task.model");
const commentService = require("../services/comment.service")
const userService = require("../services/user.service")
const taskService = require("../services/task.service")
const User = require("../models/user.model");
const enums = require("../helper/enum/enums");

module.exports = {
  //*********************************** CREATE COMMENTS BY DEVELOPER AND MANAGER ***************************** */
  createComments: catchAsync(async (req, res) => {
    const { taskId } = req.params;
    const { comment, developer, manager, date_comment_created } = req.body;

    const roleAuth = await userService.getOneUser({
      _id: req.userId,
      role: {
        $in: [
          enums.declaredEnum.role.MANAGER,
          enums.declaredEnum.role.DEVELOPER,
        ],
      },
    });
    if (!roleAuth) {
      throw new appError(ErrorMessage.USER_NOT_FOUND, ErrorCode.NOT_FOUND);
    }
    if (
      roleAuth.role == enums.declaredEnum.role.MANAGER ||
      roleAuth.role == enums.declaredEnum.role.DEVELOPER
    ) {
      req.body.user = roleAuth._id;
    }

    const taskExist = await taskService.getOneTask(taskId);
    if (!taskExist) {
      throw new appError(ErrorMessage.TASK_NOT_FOUND, ErrorCode.NOT_FOUND);
    }
    req.body.taskId = taskExist._id;
    let createdComment = await commentService.createComment(req.body);
    let updateTask = await taskService.getTaskByIdAndUpdate(
      taskId,
      { $addToSet: { comments_in_task: createdComment._id } },
      { new: true }
    );
    helper.sendResponseWithCount(
      res,
      SuccessCode.SUCCESS,
      SuccessMessage.DATA_SAVED,
      createdComment,
      updateTask.comments_in_task.length
    );
  }),
 //**************************** GET COMMENT  OF PARTICULAR TASK *************************************** */
  getCommentOfParticularTask: catchAsync(async (req, res) => {
    const { taskId } = req.params;
    const roleAuth = await userService.getOneUser({
      _id: req.userId,
      role: {
        $in: [
          enums.declaredEnum.role.MANAGER,
          enums.declaredEnum.role.DEVELOPER,
        ],
      },
    });
    if (!roleAuth) {
      throw new appError(ErrorMessage.USER_NOT_FOUND, ErrorCode.NOT_FOUND);
    }
    const taskExist = await taskService.getTaskById(taskId);
    if (!taskExist) {
      throw new appError(ErrorMessage.TASK_NOT_FOUND, ErrorCode.NOT_FOUND);
    }

    const getComments = await Comment.find({
      taskId,
      isDeleted: false,
    }).populate("user taskId");
    helper.commonResponse(
      res,
      SuccessCode.SUCCESS,
      getComments,
      SuccessMessage.DATA_FOUND
    );
  }),

  //***************************** COMMENT REMOVED SUCCESSFULLY FROM TASK ********************************** */
  removeCommentFromTask: catchAsync(async (req, res) => {
    let { taskId } = req.params;
    let { commentIds } = req.body;

    const roleAuth = await userService.getOneUser({
      _id: req.userId,
      role: {
        $in: [
          enums.declaredEnum.role.MANAGER,
          enums.declaredEnum.role.DEVELOPER,
        ],
      },
    });
    if (!roleAuth) {
      throw new appError(ErrorMessage.USER_NOT_FOUND, ErrorCode.NOT_FOUND);
    }
    const taskExist = await taskService.getTaskById(taskId);
    if (!taskExist) {
      throw new appError(ErrorMessage.TASK_NOT_FOUND, ErrorCode.NOT_FOUND);
    }

    const commentCount = await taskService.getTaskByIdAndUpdate(
      { _id: taskId },
      { $pullAll: { comments_in_task: commentIds }},
    {new:true} 
    );
    
    for (let i = 0; i < commentIds.length; i++) {
      await commentService.getOneCommentAndUpdate(
        { _id: commentIds[i] },
        { $set: { isDeleted: true } },
        {new:true}
      );
    }
    helper.sendResponseWithoutData(
        res,
        SuccessCode.SUCCESS,
        SuccessMessage.REMOVE_SUCCESS
      );
  }),
};
