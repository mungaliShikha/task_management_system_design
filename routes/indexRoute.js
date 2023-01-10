const router = require("express").Router();
const user = require('./userRoute/user.route');
const admin = require('./adminRoute/admin.route');
const task = require("./taskRoute/task.route")
const project = require('./projectRoute/project.route')
const comment = require('./commentRoute/comment.route')

router.use('/user', user);
router.use('/admin', admin);
router.use('/task',task);
router.use('/project',project);
router.use('/comment',comment)

module.exports = router;