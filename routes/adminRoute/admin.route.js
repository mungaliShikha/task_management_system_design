const router = require("express").Router();
const {login,forgetPassword,resetPassword,updateAdmin,getAdmin} = require("../../controllers/admin.controller");
const {loginDeveloper,addDeveloper,listDeveloper,viewDeveloper} = require("../../controllers/user.controller");
const { loginManager, createManager } = require("../../controllers/admin.controller");
const auth = require('../../middleware/auth');
const { upload } = require("../../services/aws/aws");



router.post('/login', login);
router.post('/forgetPassword',forgetPassword)
router.post('/resetPassword/:userId/:token',resetPassword)
router.put('/updateAdmin/:userId',upload.single("profile_image"),updateAdmin)
router.get('/getAdminDetails/:userId',getAdmin)

/// admin can create manager
router.post("/loginManager", loginManager);
router.post("/createManager", createManager);



router.post('/addDeveloper', addDeveloper)
router.post('/loginDeveloper', loginDeveloper);
router.get('/listDeveloper', listDeveloper)
router.get('/viewDeveloper', viewDeveloper)




module.exports = router;






module.exports = router;


