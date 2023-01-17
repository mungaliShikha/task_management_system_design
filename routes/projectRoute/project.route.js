const router = require("express").Router();
const auth = require("../../middleware/auth");
const projectController = require("../../controllers/project.controller");

router.post(
  "/createProject",
  auth.verifyToken,
  projectController.createProject
);
router.post(
  "/addManagerToProject/:projectId",
  auth.verifyToken,
  projectController.addManagerToProject
);
router.post(
  "/addTaskToProject/:projectId",
  auth.verifyToken,
  projectController.addTaskToProject
);
router.get("/viewProject",auth.verifyToken, projectController.viewProject);
router.get("/listProject",auth.verifyToken, projectController.listProject);

module.exports = router;
