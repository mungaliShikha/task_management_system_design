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
    project_task: [
      {
        type: schema.ObjectId,
        ref: "task"
    }
    ],
    manager: [
      {
        type: schema.ObjectId,
        ref: "users"
    }
    ]
    ,
  },
  { timestamps: true }
);

project_model.plugin(mongoosePaginate);
project_model.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("project", project_model);
