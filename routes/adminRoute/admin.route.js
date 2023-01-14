const router = require("express").Router();
const adminController = require("../../controllers/admin.controller");
const auth = require('../../middleware/auth');
const { upload } = require("../../services/aws/aws");

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     tags:
 *       - ADMIN
 *     description: Admin Login
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: email
 *         in: formData
 *         required: true
 *       - name: password
 *         description: password
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Your login is successful.
 *       404:
 *         description: Requested data not found.
 *       402:
 *         description: Invalid login credentials.
 *       500:
 *         description: Internal Server Error
 */
router.post('/login', adminController.login);
router.post('/forgetPassword',adminController.forgetPassword)
router.post('/resetPassword/:userId/:token',adminController.resetPassword)
router.put('/updateAdmin/:userId',upload.array("profile_image"),adminController.updateAdmin)
router.get('/getAdminDetails/:userId',adminController.getAdmin)


/// admin can create manager
router.post("/loginManager", adminController.loginManager);
router.post("/createManager/:userId",upload.array("profile_image"), adminController.createManager);


module.exports = router;
