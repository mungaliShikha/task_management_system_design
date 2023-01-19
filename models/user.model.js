const mongoose = require("mongoose");
const logger = require("../helper/logger/logger")
const { generateHash } = require("../helper/commonFunction")
const enums = require("../helper/enum/enums")
const schema = mongoose.Schema;
var userModel = new schema(
  {
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    mobile_number: {
      type: String,
      unique: true,
    },
    address: {
      type: String,
    },
    profile_image: {
      type: String,
    },
    employee_id: {
      type: String,
    },
    role: {
      type: String,
      enum: [enums.declaredEnum.role.MANAGER, enums.declaredEnum.role.DEVELOPER, enums.declaredEnum.role.ADMIN]
    },
    status: {
      type: String,
      enum: [enums.declaredEnum.status.ACTIVE,enums.declaredEnum.status.BLOCKED,enums.declaredEnum.status.DELETE],
      default: enums.declaredEnum.status.ACTIVE,
    },
    tech_stack: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userModel);

mongoose.model("users", userModel).find({ role:enums.declaredEnum.role.ADMIN }, async (err, result) => {
  if (err) {
    logger.info(`"DEFAULT ADMIN ERROR", ${err}`);
  }
  else if (result.length != 0) {
    logger.info("Default Admin.");
  }
  else {
    let obj = {
      first_name: "Shikha",
      last_name: "Mungali",
      email: "shikha1081998@gmail.com",
      password: generateHash("test@123345"),
      mobile_number: "9998887772",
      role: enums.declaredEnum.role.ADMIN
    };


    mongoose.model("users", userModel).create(obj, async (err1, result1) => {
      if (err1) {
        logger.info(`"DEFAULT ADMIN  creation ERROR", ${err1}`);
      } else {
        logger.info(`"DEFAULT ADMIN Created", ${result1}`);
      }
    });
  }
});
