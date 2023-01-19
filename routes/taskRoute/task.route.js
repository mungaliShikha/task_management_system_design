const router = require("express").Router();
const taskController = require("../../controllers/task.controller");
const auth = require("../../middleware/auth");

router.post(
  "/addTaskToProject",
  auth.verifyToken,
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
  taskController.addDeveloperToTask
);
router.get(
  "/viewAllTask",
  taskController.viewAllTask)

router.put(
  "/updateTask",
  auth.verifyToken,
  taskController.updateTask
)

router.delete(
  "/removeDeveloperFromTask",
  auth.verifyToken,
  taskController.removeDeveloperFromTask
)

router.put(
  "/changeTaskStatusByDev",
  auth.verifyToken,
  taskController.changeTaskStatusByDev
)

module.exports = router;
