const router = require("express").Router();
const { upload } = require("../../services/aws/aws");
const {addDeveloper,loginDeveloper,listDeveloper,viewDeveloper} = require("../../controllers/user.controller")


router.post("/addDeveloper/:userId",upload.array("profile_image"), addDeveloper);
router.post("/loginDeveloper", loginDeveloper);
router.get("/listDeveloper", listDeveloper);
router.get("/viewDeveloper", viewDeveloper);

module.exports = router;



