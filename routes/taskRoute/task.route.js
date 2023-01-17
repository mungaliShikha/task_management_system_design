const router = require("express").Router();
const taskController = require("../../controllers/task.controller")
const auth = require("../../middleware/auth")


router.post("/addTaskToProject",auth.verifyToken, taskController.addTaskToProject);
router.get("/listTaskOnparticularProject",auth.verifyToken,taskController.listTaskOnparticularProject)
router.put("/addDeveloperToTask",auth.verifyToken,taskController.addDeveloperToTask)


module.exports = router;
