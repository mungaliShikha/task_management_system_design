const router = require("express").Router();
const auth = require("../../middleware/auth");
const projectController = require("../../controllers/project.controller");
const {validationMiddleware}=require("../../middleware/joeValidator")
const {createProjectValidation,addManagerValidator,addTaskValidator,removeManagerProjectValidator,updateProjectValidator} = require("../../validator/project.validatior")

//************************* manager can create the project ********************* */
router.post(
  "/createProject",
  auth.verifyToken,
  validationMiddleware(createProjectValidation),
  projectController.createProject
);

//************************** manager can add another manager to the project *************** */
router.post(
  "/addManagerToProject/:projectId",
  auth.verifyToken,
  validationMiddleware(addManagerValidator),
  projectController.addManagerToProject
);

//************************ only manager can add task to the project ******************** */
router.post(
  "/addTaskToProject/:projectId",
  auth.verifyToken,
  validationMiddleware(addTaskValidator),
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
  validationMiddleware(removeManagerProjectValidator),
  projectController.removeManagerFromProject
);

//************************ only manager and admin can update the project ***************** */
router.put(
  "/updateProject/:projectId",
  auth.verifyToken,
  validationMiddleware(updateProjectValidator),
  projectController.updateProject
);


//******************* change project status to completed **************** */

router.put(
  "/completeProjectStatus/:projectId",
  auth.verifyToken,
  projectController.completeProjectStatus
);


//********************** remove project by project id *********************** */

router.put(
  "/removeProject/:projectIdt",
  auth.verifyToken,
  projectController.removeProject
);


router.post(
  "/myProjectList",
  auth.verifyToken,
  projectController.myProjectList
)

module.exports = router;
