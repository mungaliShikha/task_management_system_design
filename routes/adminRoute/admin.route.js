const router = require("express").Router();
const cors = require('cors');
// const adminController = require("../../controllers/adminController");
const auth = require('../../middleware/auth');
const { route } = require("../userRoute/user.route");
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }
})

var upload = multer({ storage: storage })


// router.post('/login', adminController.login);




module.exports = router;


