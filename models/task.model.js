const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
var mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const commonFunction = require("../helper/commonFunction");
const schema = mongoose.Schema;

var task_model = new schema(
  {
    name: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["inProgress", "inQA", "completed"],
      default: "started",
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
      type: String,
    },
    due_date: {
      type: String,
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

