const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
var mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
<<<<<<< HEAD
const bcrypt = require("bcryptjs");
const commonFunction = require("../helper/commonFunction");
=======
const {generateHash} = require("../helper/commonFunction")
>>>>>>> 6f768ff4d45227f1df9b95d7a2c4fc66cd4b8d93
const schema = mongoose.Schema;
var userModel = new schema(
  {
    userId: {
      type: schema.Types.ObjectId,
      ref: "users",
    },
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
      unique: true
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
      enum: ["Manager", "Developer", "Admin"],
    },
    tech_stack: {
      type: String,
    },
  },
  { timestamps: true }
);
userModel.plugin(mongoosePaginate);
userModel.plugin(mongooseAggregatePaginate);


module.exports = mongoose.model("users", userModel);

<<<<<<< HEAD
mongoose
  .model("users", userModel)
  .find({ role: "Admin" }, async (err, result) => {
    if (err) {
      console.log("DEFAULT ADMIN ERROR", err);
    } else if (result.length != 0) {
      console.log("Default Admin.");
    } else {
      let obj = {
        first_name: "nitin",
        last_name: "sharma",
        email: "nitin.antino@gmail.com",
        password: bcrypt.hashSync("test@12345"),
        mobile_number: "9988776655",
        role: "Admin",
      };
=======
mongoose.model("users", userModel).find({ role: "Admin" }, async (err, result) => {
  if (err) {
    console.log("DEFAULT ADMIN ERROR", err);
  }
  else if (result.length != 0) {
    console.log("Default Admin.");
  }
  else {
    let obj = {
      first_name: "Shikha",
      last_name: "Mungali",
      email: "shikha1081998@gmail.com",
      password: generateHash("test@123345"),
      mobile_number: "9998887772",
      role: "Admin"
    };
>>>>>>> 6f768ff4d45227f1df9b95d7a2c4fc66cd4b8d93

      mongoose.model("users", userModel).create(obj, async (err1, result1) => {
        if (err1) {
          console.log("DEFAULT ADMIN  creation ERROR", err1);
        } else {
          console.log("DEFAULT ADMIN Created", result1);
        }
      });
    }
  });
