const router = require("express").Router();
const adminController = require("../../controllers/admin.controller");
const auth = require("../../middleware/auth");
const { validationMiddleware } = require("../../middleware/joeValidator");

const {
  updateAdminValidation,
  createmanager,
  resetPasswordAdmin,
  forgetPasswordAdmin,
} = require("../../validator/admin.validator");

const { upload } = require("../../utils/aws/aws");
const {
  resetPassword,
  forgetPassword,
  createManager,
  getAdminDetails,
  updateAdmin,
  listAllUsers,
} = require("../../controllers/admin.controller");

const {
  resetPassword,
  forgetPassword,
  addManager,
  getAdminDetails,
  updateAdmin,
  listManager,
  viewManager,
} = require("../../controllers/admin.controller");

router.post(
  "/forgetPassword",
  validationMiddleware(forgetPasswordAdmin),
  forgetPassword
);

router.post(
  "/resetPassword/:userId/:token",
  validationMiddleware(resetPasswordAdmin),
  resetPassword
);

router.put(
  "/updateAdmin",
  auth.verifyToken,
  upload.array("profile_image"),
  validationMiddleware(updateAdminValidation),
  updateAdmin
);

router.get("/getAdminDetails", auth.verifyToken, getAdminDetails);

/// admin only can create manager
router.post(
  "/createManager",
  auth.verifyToken,
  validationMiddleware(createmanager),
  addManager
);

router.get("/listManager", adminController.listManager);
router.get("/viewManager", adminController.viewManager);

// router.post(
//   "/addDeveloper/:userId",
//   upload.array("profile_image"),
//   adminController.addDeveloper
// );
// router.post("/loginDeveloper", adminController.loginDeveloper);
// router.get("/listDeveloper", adminController.listDeveloper);
// router.get("/viewDeveloper", adminController.viewDeveloper);

//********************** get the list of all manager and developer ******************************* */
router.get("/listAllUser", auth.verifyToken, listAllUsers);

module.exports = router;
