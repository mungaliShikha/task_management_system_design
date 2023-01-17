const router = require("express").Router();
const auth = require("../../middleware/auth");
const projectController = require("../../controllers/project.controller");

router.post(
  "/createProject",
  auth.verifyToken,
  projectController.createProject
);
router.get("/listProject", projectController.listProject);
router.post(
  "/addDevelopersToProject/:managerId/:projectId",
  projectController.addDeveloperToProject
);
router.post(
  "/addManagerToProject/:managerId/:projectId",
  projectController.addManagerToProject
);
router.get("/viewProject", projectController.viewProject);

module.exports = router;
