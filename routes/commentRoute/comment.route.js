const router = require("express").Router();
const {
  createComments,
  getCommentOfParticularTask,
  removeCommentFromTask,
} = require("../../controllers/comment.controller");
const { verifyToken } = require("../../middleware/auth");
const { validationMiddleware } = require("../../middleware/joeValidator");
const { createCommentValidator } = require("../../validator/comment.validator");

//************************** create comments by manager and admin************* */

router.post(
  "/:taskId/createComment",
  verifyToken,
  validationMiddleware(createCommentValidator),
  createComments
);

//************************* get all the comment on particular task *********** */
router.get(
  "/:taskId/getCommentOfTask",
  verifyToken,
  getCommentOfParticularTask
);

//***************** delete the comment from the task ************************ */
router.delete(
  "/:taskId/removeCommentFromTask",
  verifyToken,
  removeCommentFromTask
);

module.exports = router;
