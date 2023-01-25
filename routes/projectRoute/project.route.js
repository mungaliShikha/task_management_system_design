const router = require("express").Router();
const auth = require("../../middleware/auth");
const projectController = require("../../controllers/project.controller");
const {validationMiddleware}=require("../../middleware/joeValidator")
const {projectCreation,addManager,addTask,removeProject,updateSingleProject} = require("../../validator/project.validatior")

//************************* manager can create the project ********************* */
router.post(
  "/createProject",
  auth.verifyToken,
  validationMiddleware(projectCreation),
  projectController.createProject
);

//************************** manager can add another manager to the project *************** */
router.post(
  "/addManagerToProject/:projectId",
  auth.verifyToken,
  validationMiddleware(addManager),
  projectController.addManagerToProject
);

//************************ only manager can add task to the project ******************** */
router.post(
  "/addTaskToProject/:projectId",
  auth.verifyToken,
  validationMiddleware(addTask),
  projectController.addTaskToProject
);

//************** view populated data of the project ************************** */
router.get(
  "/viewProject/:projectId",
  auth.verifyToken,
  projectController.viewProject
);


//********************** list all the projects ************************ */
router.get("/listProject", auth.verifyToken, projectController.listProject);


//************************* only admin can remove the manager from the project ************ */
router.delete(
  "/removeManagerFromProject/:projectId",
  auth.verifyToken,
  validationMiddleware(removeProject),
  projectController.removeManagerFromProject
);

//************************ only manager and admin can update the project ***************** */
router.put(
  "/updateProject/:projectId",
  auth.verifyToken,
  validationMiddleware(updateSingleProject),
  projectController.updateProject
);




module.exports = router;
