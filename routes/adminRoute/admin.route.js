const router = require("express").Router();
const adminController = require("../../controllers/admin.controller");
const { upload } = require("../../services/aws/aws");
const auth = require("../../middleware/auth");
const Token = require("../../helper/commonFunction");
const { verifyToken } = require("../../middleware/auth");

// const {
//   login,
//   createManager,
//   getManager,
//   forgetPassword,
//   resetPassword,
//   updateAdmin,
//   getAdmin,
// } = require("../../controllers/admin.controller");

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
router.post("/login", adminController.login);
router.post("/forgetPassword", adminController.forgetPassword);
router.post("/resetPassword/:userId/:token", adminController.resetPassword);
router.put(
  "/updateAdmin/:userId",
  upload.array("profile_image"),
  adminController.updateAdmin
);
router.get("/getAdminDetails/:userId", adminController.getAdmin);

router.post("/forgetPassword", adminController.forgetPassword);
router.post("/resetPassword/:userId/:token", adminController.resetPassword);
router.put(
  "/updateAdmin/:userId",
  upload.single("profile_image"),
  adminController.updateAdmin
);
router.get("/getAdminDetails/:userId", adminController.getAdmin);

/// admin can create manager
router.post("/loginManager", adminController.loginManager);
router.post(
  "/createManager/:userId",
  upload.array("profile_image"),
  adminController.createManager
);
router.put(
  "/updateManager/:userId",
  upload.single("profile_image"),
  adminController.updateManager
);

router.get("/listManager", adminController.listManager);
router.get("/viewManager", adminController.viewManager);

router.post(
  "/addDeveloper/:userId",
  upload.array("profile_image"),
  adminController.addDeveloper
);
router.post("/loginDeveloper", adminController.loginDeveloper);
router.get("/listDeveloper", adminController.listDeveloper);
router.get("/viewDeveloper", adminController.viewDeveloper);

module.exports = router;
