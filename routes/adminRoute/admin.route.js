const router = require("express").Router();
const { route } = require("../userRoute/user.route");

const { upload } = require("../../services/aws/aws");
const auth = require("../../middleware/auth");
const Token = require("../../helper/commonFunction");
const generateToken = Token.generateToken();
const {
  login,
  createManager,
  getManager,
  forgetPassword,
  resetPassword,
  updateAdmin,
  getAdmin,
} = require("../../controllers/admin.controller");

router.post("/login", login);
router.post("/createManager", auth.verifyToken(generateToken), createManager);

router.post("/forgetPassword", forgetPassword);
router.post("/resetPassword/:userId/:token", resetPassword);
router.put("/updateAdmin/:userId", upload.single("profile_image"), updateAdmin);
router.get("/getAdminDetails/:userId", getAdmin);
router.get("/getManager", getManager);

module.exports = router;
