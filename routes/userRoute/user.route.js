const router = require("express").Router();
const { upload } = require("../../utils/aws/aws");
const auth = require("../../middleware/auth");
const userController = require("../../controllers/user.controller");
const {validationMiddleware}=require("../../middleware/joeValidator")
const {logIn} = require("../../validator/admin.validator")

router.post("/addDeveloper", auth.verifyToken, userController.addDeveloper);

router.post('/login',validationMiddleware(logIn), userController.login);


router.get("/getProfile", auth.verifyToken, userController.getProfile); // get profile for manager and developer

router.put(
  "/updateProfile",
  auth.verifyToken,
  upload.array("profile_image"),
  userController.updateProfile
); //update api for manager and developer


module.exports = router;
