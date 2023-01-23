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
  projectController.updateProject
);

module.exports = router;
