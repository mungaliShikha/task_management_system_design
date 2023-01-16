const router = require("express").Router();
const {createProject,listProject,addDeveloperToProject,addManagerToProject,viewProject} = require("../../controllers/project.controller")



router.post("/createProject/:managerId", createProject);
router.get("/listProject",listProject)
router.post("/addDevelopersToProject/:managerId/:projectId",addDeveloperToProject);
router.post("/addManagerToProject/:managerId/:projectId",addManagerToProject);
router.get("/viewProject",viewProject)

module.exports = router;