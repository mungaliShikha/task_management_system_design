const router = require("express").Router();
const { upload } = require("../../utils/aws/aws");
const auth = require("../../middleware/auth");
const userController = require("../../controllers/user.controller");
const {validationMiddleware}=require("../../middleware/joeValidator")
const {logIn,createDeveloper,updateData,} = require("../../validator/user.validator")

router.post("/addDeveloper", auth.verifyToken,validationMiddleware(createDeveloper), userController.addDeveloper);

router.post('/login',validationMiddleware(logIn), userController.login);


router.get("/getProfile", auth.verifyToken, userController.getProfile); // get profile for manager and developer

router.put(
  "/updateProfile",
  auth.verifyToken,
  upload.array("profile_image"),
  validationMiddleware(updateData),
  userController.updateProfile
); //update api for manager and developer

router.get("/listTheManager", auth.verifyToken, userController.listTheManager);

router.get("/listTheDeveloper",auth.verifyToken, userController.listTheDeveloper)




module.exports = router;
