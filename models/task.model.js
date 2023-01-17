const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
var mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const commonFunction = require("../helper/commonFunction");
const schema = mongoose.Schema;

var task_model = new schema(
  {

    projectId:
    {
      type: schema.Types.ObjectId,
      ref: "project",
    },
    manager:
    {
      type: schema.Types.ObjectId,
      ref: "users",
    },

    name: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["inProgress", "inQA", "completed"],
      default: "inProgress",
      required: true,
    },
    type: {
      type: String,
      enum: ["bug", "enhancement", "new-feature"],
    },

    priority: {
      type: String,
      enum: ["urgent", "high", "medium", "low"],
    },

    start_date: {
      type: Date,
    },
    due_date: {
      type: Date,
    },
    developer_assigned:
    {
      type: schema.Types.ObjectId,
      ref: "user",
    }
  },
  { timestamps: true }
);

task_model.plugin(mongoosePaginate);
task_model.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("task", task_model);

