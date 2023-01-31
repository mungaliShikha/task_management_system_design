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
} = require("../../validator/task.validator");

// const { validationMiddleware } = require("../../middleware/joeValidator");

// const {
//   createTaskValidation,
//   updateTaskValidation,
//   addDeveloperValidator,
//   removeDeveloperValidator,
//   changeTaskStatusValidator,
// } = require("../../validator/task.validator");

//***************************** create task by manager ************************* */
router.post(
  "/addTaskToProject",
  auth.verifyToken,
  validationMiddleware(createTaskValidation),
  taskController.createTaskToProject
);

//***************** get list of task on particular project **************************** */
router.get(
  "/listTaskOnparticularProject",
  auth.verifyToken,
  taskController.listTaskOnparticularProject
);

//******************************* add developer to particular task by manager ************************ */
router.put(
  "/addDeveloperToTask",
  auth.verifyToken,
  validationMiddleware(addDeveloperValidator),
  taskController.addDeveloperToTask
);

//********************** get list of all task ****************************** */
router.get("/viewAllTask", taskController.viewAllTask);

//****************************** update task ********************************* */
router.put(
  "/updateTask",
  auth.verifyToken,
  validationMiddleware(updateTaskValidation),
  taskController.updateTask
);

//*********************************** remove developer from task *************************** */
router.delete(
  "/removeDeveloperFromTask",
  auth.verifyToken,
  validationMiddleware(removeDeveloperValidator),
  taskController.removeDeveloperFromTask
);

//******************************** change task status by developer ************************** */
router.put(
  "/changeTaskStatusByDev",
  auth.verifyToken,
  validationMiddleware(changeTaskStatusValidator),
  taskController.changeTaskStatusByDev
);

module.exports = router;
