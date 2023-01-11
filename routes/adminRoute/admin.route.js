const router = require("express").Router();
const {login,forgetPassword,resetPassword,updateAdmin,getAdmin} = require("../../controllers/admin.controller");
const auth = require('../../middleware/auth');



router.post('/login', login);
router.post('/forgetPassword',forgetPassword)
router.post('/resetPassword/:userId/:token',resetPassword)
router.put('/updateAdmin/:userId',updateAdmin)
router.get('/getAdminDetails/:userId',getAdmin)





module.exports = router;


