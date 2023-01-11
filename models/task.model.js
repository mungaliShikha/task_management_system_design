const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
var mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const bcrypt = require("bcryptjs");
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
      enum: ["bug", "enchancement", "new-feature"],
    },

    priority: {
      type: string,
      enum: ["urgent", "high", "medium", "low"],
    },

    start_date: {
      type: string,
    },
    due_date: {
      type: string,
    },
    developer_assigned: [
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
module.exports = mongoose.model("task", task_model);
