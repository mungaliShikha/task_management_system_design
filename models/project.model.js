const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
var mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const bcrypt = require("bcryptjs");
const commonFunction = require("../helper/commonFunction");
const schema = mongoose.Schema;

var project_model = new schema(
  {
    project_name: {
      type: String,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["started", "ongoing", "completed"],
      default: "started",
    },
    active_status: {
      type: String,
      enum: ["ACTIVE", "BLOCK", "DELETE"],
      default: "ACTIVE",
    },
    project_task: [
      {
        type: schema.Types.ObjectId,
        ref: "user",
      },
    ],

    developers: [
      {
        type: schema.Types.ObjectId,
        ref: "user",
      },
    ],
    manager: [
      {
        type: schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  { timestamps: true }
);

userModel.plugin(mongoosePaginate);
userModel.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("project", project_model);