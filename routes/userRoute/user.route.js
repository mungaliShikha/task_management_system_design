const router = require("express").Router();
const {loginDeveloper,addDeveloper,listDeveloper,viewDeveloper} = require("../../controllers/user.controller");
const { loginManager, createManager } = require("../../controllers/user.controller");

const auth = require('../../middleware/auth');
const { upload } = require("../../services/aws/aws");


// router.post('/addDeveloper', addDeveloper)
router.post('/loginDeveloper', loginDeveloper);
// router.get('/listDeveloper', listDeveloper)
// router.get('/viewDeveloper', viewDeveloper)





router.post("/loginManager", loginManager);
// router.post("/createManager", createManager);

module.exports = router;




module.exports = router;