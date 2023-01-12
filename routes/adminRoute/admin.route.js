const router = require("express").Router();
const { login, createManager } = require("../../controllers/admin.controller");
const auth = require("../../middleware/auth");
const { route } = require("../userRoute/user.route");

router.post("/login", login);
router.post("/createManager", createManager);

module.exports = router;
