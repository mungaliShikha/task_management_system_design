const router = require("express").Router();
const userController = require("../../controllers/user.controller")
const auth = require('../../middleware/auth');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });


// router.get('/getProfile', auth.verifyToken, userController.getProfile);






module.exports = router;