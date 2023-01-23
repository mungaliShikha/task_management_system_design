const router = require("express").Router();
const adminController = require("../../controllers/admin.controller");
const auth = require('../../middleware/auth');
const {validationMiddleware}=require("../../middleware/joeValidator")
<<<<<<< HEAD
const { updateAdmin,createmanager } = require("../../validator/admin.validator");
const { upload } = require("../../utils/aws/aws");
const { resetPassword, forgetPassword, createManager } = require("../../controllers/admin.controller");

/**
 * @swagger
 * /api/admin/addDeveloper:
 *   post:
 *     tags:
 *       - ADMIN_DEVELOPER_DASHBOARD
 *     description: Developer Added
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: email
 *         description: email
 *         in: formData
 *         required: true
 *       - name: first_name
 *         description: first_name
 *         in: formData
 *         required: true
 *       - name: last_name
 *         description: last_name
 *         in: formData
 *         required: true
 *       - name: mobile_number
 *         description: mobile_number
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Developer added successfully.
 *       404:
 *         description: Requested data not found.
 *       402:
 *         description: Invalid login credentials.
 *       500:
 *         description: Internal Server Error
 */
// router.post('/addDeveloper', adminController.addDeveloper)


/**
 * @swagger
 * /api/admin/listDeveloper:
 *   get:
 *     tags:
 *       - ADMIN_DEVELOPER_DASHBOARD
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Developer list successfully.
 *       404:
 *         description: Requested data not found.
 *       402:
 *         description: Invalid login credentials.
 *       500:
 *         description: Internal Server Error
 */
// router.get('/listDeveloper', adminController.listDeveloper)


/**
 * @swagger
 * /api/admin/viewDeveloper:
 *   get:
 *     tags:
 *       - ADMIN_DEVELOPER_DASHBOARD
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: _id
 *         in: query
 *         required: true
 *     responses:
 *       200:
 *         description: Developer view successfully.
 *       404:
 *         description: Requested data not found.
 *       402:
 *         description: Invalid login credentials.
 *       500:
 *         description: Internal Server Error
 */
// router.get('/viewDeveloper', adminController.viewDeveloper)

/**
 * @swagger
 * /api/admin/forgetPassword:
 *   get:
 *     tags:
 *       - ADMIN
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Developer list successfully.
 *       404:
 *         description: Requested data not found.
 *       402:
 *         description: Invalid login credentials.
 *       500:
 *         description: Internal Server Error
 */
router.post('/forgetPassword',validationMiddleware(forgetPassword),adminController.forgetPassword)
router.post('/resetPassword/:userId/:token',validationMiddleware(resetPassword),adminController.resetPassword)
router.put('/updateAdmin',auth.verifyToken, upload.array("profile_image"),validationMiddleware(updateAdmin),adminController.updateAdmin)
router.get('/getAdminDetails',auth.verifyToken, adminController.getAdminDetails)


/// admin can create manager
router.post("/createManager",auth.verifyToken,validationMiddleware(createmanager), adminController.createManager);
=======
const { updateAdminValidation,createmanager, resetPasswordAdmin,forgetPasswordAdmin } = require("../../validator/admin.validator");
const { upload } = require("../../utils/aws/aws");
const { resetPassword, forgetPassword, createManager,getAdminDetails ,updateAdmin} = require("../../controllers/admin.controller");


router.post('/forgetPassword',validationMiddleware(forgetPasswordAdmin),forgetPassword)

router.post('/resetPassword/:userId/:token',validationMiddleware(resetPasswordAdmin),resetPassword)

router.put('/updateAdmin',auth.verifyToken, upload.array("profile_image"),validationMiddleware(updateAdminValidation),updateAdmin)

router.get('/getAdminDetails',auth.verifyToken,getAdminDetails)


/// admin only can create manager
router.post("/createManager",auth.verifyToken,validationMiddleware(createmanager),createManager);
>>>>>>> main


module.exports = router;
