const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
var mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
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
        type: String,
      }
    ],

    developer: [
      {
        type: String,
      }
    ],
    manager: [
      {
        type: String,
      }
    ],
  },
  { timestamps: true }
);

project_model.plugin(mongoosePaginate);
project_model.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("project", project_model);
