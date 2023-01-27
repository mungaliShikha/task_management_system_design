const router = require("express").Router();
const auth = require("../../middleware/auth");
const projectController = require("../../controllers/project.controller");

const { validationMiddleware } = require("../../middleware/joeValidator");

const {
  createProjectValidation,
  addManagerValidator,
  addTaskValidator,
  updateProjectValidator,
  removeProjectValidator,
} = require("../../validator/project.validation");

router.post(
  "/createProject",
  auth.verifyToken,
  validationMiddleware(createProjectValidation),
  projectController.createProject
);

router.post(
  "/addManagerToProject/:projectId",
  auth.verifyToken,
  validationMiddleware(addManagerValidator),
  projectController.addManagerToProject
);
router.post(
  "/addTaskToProject/:projectId",
  auth.verifyToken,
  validationMiddleware(addTaskValidator),
  projectController.addTaskToProject
);
router.get(
  "/viewProject/:projectId",
  auth.verifyToken,
  projectController.viewProject
);
router.get("/listProject", auth.verifyToken, projectController.listProject);

router.delete(
  "/removeManagerFromProject/:projectId",
  auth.verifyToken,
  projectController.removeManagerFromProject
);
router.put(
  "/updateProject/:projectId",
  auth.verifyToken,
  validationMiddleware(updateProjectValidator),
  projectController.updateProject
);

router.put(
  "/completeProjectStatus/:projectId",
  auth.verifyToken,
  projectController.completeProjectStatus
);

router.put(
  "/removeProject/:projectIdt",
  auth.verifyToken,
  validationMiddleware(removeProjectValidator),
  projectController.removeProject
);

module.exports = router;
