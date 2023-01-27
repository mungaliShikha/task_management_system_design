const router = require("express").Router();
const {
  createComments,
  getCommentOfParticularTask,
  removeCommentFromTask,
} = require("../../controllers/comment.controller");
const { verifyToken } = require("../../middleware/auth");
const { validationMiddleware } = require("../../middleware/joeValidator");
const { createCommentValidator } = require("../../validator/comment.validator");

router.post(
  "/:taskId/createComment",
  verifyToken,
  validationMiddleware(createCommentValidator),
  createComments
);

router.get(
  "/:taskId/getCommentOfTask",
  verifyToken,
  getCommentOfParticularTask
);

router.delete(
  "/:taskId/removeCommentFromTask",
  verifyToken,
  removeCommentFromTask
);

module.exports = router;
