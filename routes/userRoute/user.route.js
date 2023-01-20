const router = require("express").Router();
const { upload } = require("../../utils/aws/aws");
const auth = require("../../middleware/auth");
const userController = require("../../controllers/user.controller");
const {validationMiddleware}=require("../../middleware/joeValidator")
const {logIn} = require("../../validator/admin.validator")

router.post("/addDeveloper", auth.verifyToken, userController.addDeveloper);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     tags:
 *       - ADMIN_DEVELOPER_DASHBOARD
 *     description: Developer Added
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
 *         description: Developer added successfully.
 *       404:
 *         description: Requested data not found.
 *       402:
 *         description: Invalid login credentials.
 *       500:
 *         description: Internal Server Error
 */
router.post('/login',validationMiddleware(logIn), userController.login);

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
router.get("/getProfile", auth.verifyToken, userController.getProfile); // get profile for manager and developer

router.put(
  "/updateProfile",
  auth.verifyToken,
  upload.array("profile_image"),
  userController.updateProfile
); //update api for manager and developer


module.exports = router;
