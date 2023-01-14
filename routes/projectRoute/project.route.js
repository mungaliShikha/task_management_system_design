const router = require("express").Router();
const {createProject,listProject} = require("../../controllers/project.controller")



router.post("/createProject/:managerId", createProject);
router.post("/listProject",listProject)

module.exports = router;