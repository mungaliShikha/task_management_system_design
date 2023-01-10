const router = require("express").Router();
const {login} = require("../../controllers/admin.controller");
const auth = require('../../middleware/auth');
const { route } = require("../userRoute/user.route");



router.post('/login', login);




module.exports = router;


