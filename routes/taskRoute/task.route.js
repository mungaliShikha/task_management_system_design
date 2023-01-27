const router = require("express").Router();
const taskController = require("../../controllers/task.controller");
const auth = require("../../middleware/auth");
const { validationMiddleware } = require("../../middleware/joeValidator");

const {
  createTaskValidation,
  updateTaskValidation,
  addDeveloperValidator,
  removeDeveloperValidator,
  changeTaskStatusValidator,
} = require("../../validator/task.validation");

router.post(
  "/addTaskToProject",
  auth.verifyToken,
  validationMiddleware(createTaskValidation),
  taskController.createTaskToProject
);
router.get(
  "/listTaskOnparticularProject",
  auth.verifyToken,
  taskController.listTaskOnparticularProject
);
router.put(
  "/addDeveloperToTask",
  auth.verifyToken,
  validationMiddleware(addDeveloperValidator),
  taskController.addDeveloperToTask
);
router.get("/viewAllTask", taskController.viewAllTask);

router.put(
  "/updateTask",
  auth.verifyToken,
  validationMiddleware(updateTaskValidation),
  taskController.updateTask
);

router.delete(
  "/removeDeveloperFromTask",
  auth.verifyToken,
  validationMiddleware(removeDeveloperValidator),
  taskController.removeDeveloperFromTask
);

router.put(
  "/changeTaskStatusByDev",
  auth.verifyToken,
  validationMiddleware(changeTaskStatusValidator),
  taskController.changeTaskStatusByDev
);

module.exports = router;
