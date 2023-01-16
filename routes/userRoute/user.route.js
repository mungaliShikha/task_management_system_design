const router = require("express").Router();
const { upload } = require("../../services/aws/aws");
const auth = require('../../middleware/auth');
const userController = require("../../controllers/user.controller")


/**
 * @swagger
 * /api/admin/addDeveloper/:userId:
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
 *       - name: password
 *         description: password
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
router.post("/developerLogin",userController.developerLogin)


/**
 * @swagger
 * /api/user/getDeveloperProfile:
 *   post:
 *     tags:
 *       - DEVELOPER
 *     description: Developer Login
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *     responses:
 *       200:
 *         description: Your profile details get successfully.
 *       404:
 *         description: Requested data not found.
 *       402:
 *         description: Invalid login credentials.
 *       500:
 *         description: Internal Server Error
 */
router.get("/getProfile",auth.verifyToken, userController.getProfile);

router.put("/updateProfile",auth.verifyToken, upload.single("profile_image"),userController.updateProfile)

router.post("/loginManager", userController.loginManager);

router.post("/addDeveloper",auth.verifyToken,userController.addDeveloper)

module.exports = router;



