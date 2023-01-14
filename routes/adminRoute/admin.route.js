const router = require("express").Router();
const {
  login,
  forgetPassword,
  resetPassword,
  updateAdmin,
  getAdmin,
  loginManager,
  createManager,
} = require("../../controllers/admin.controller");
const auth = require("../../middleware/auth");
const { upload } = require("../../services/aws/aws");

router.post("/login", login);
router.post("/forgetPassword", forgetPassword);
router.post("/resetPassword/:userId/:token", resetPassword);
router.put("/updateAdmin/:userId", upload.array("profile_image"), updateAdmin);
router.get("/getAdminDetails/:userId", getAdmin);

/// admin can create manager
router.post("/loginManager", loginManager);
router.post("/createManager/:userId",upload.array("profile_image"), createManager);



module.exports = router;
