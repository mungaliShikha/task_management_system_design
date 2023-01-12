const router = require("express").Router();
const admin = require("../routes/adminRoute/admin.route");
const user = require("../routes/userRoute/user.route");
const task = require("../routes/taskRoute/task.route");
const project = require("../routes/projectRoute/project.route");
const comment = require("../routes/commentRoute/comment.route");




router.use("/user", user);
router.use("/admin", admin);
router.use("/task", task);
router.use("/project", project);
router.use("/comment", comment);

module.exports = router;
