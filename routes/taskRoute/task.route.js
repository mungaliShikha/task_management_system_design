const router = require("express").Router();
const taskController = require("../../controllers/task.controller")
const auth = require("../../middleware/auth")


router.post("/addTaskToProject",auth.verifyToken, taskController.addTaskToProject);
router.get("/listTaskOnparticularProject",auth.verifyToken,taskController.listTaskOnparticularProject)



module.exports = router;
