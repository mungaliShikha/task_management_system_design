const router = require("express").Router();
const {login,forgetPassword,resetPassword,updateAdmin,getAdmin} = require("../../controllers/admin.controller");
const auth = require('../../middleware/auth');
const { upload } = require("../../services/aws/aws");



router.post('/login', login);
router.post('/forgetPassword',forgetPassword)
router.post('/resetPassword/:userId/:token',resetPassword)
router.put('/updateAdmin/:userId',upload.single("profile_image"),updateAdmin)
router.get('/getAdminDetails/:userId',getAdmin)









module.exports = router;


