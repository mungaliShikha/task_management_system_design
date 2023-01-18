const mongoose = require("mongoose");
const { declaredEnum } = require("../helper/enum/enums");
const schema = mongoose.Schema;

var task_model = new schema(
  {
    projectId: {
      type: schema.Types.ObjectId,
      ref: "project",
    },
    manager: {
      type: schema.Types.ObjectId,
      ref: "users",
    },
    developer_assigned: [
      {
        type: schema.Types.ObjectId,
        ref: "users",
      },
    ],
    status: {
      type: String,
      enum: declaredEnum.status,
    },

    name: {
      type: String,
      required: true,
    },

    taskStatus: {
      type: String,
      enum: declaredEnum.taskStatus,
      default: "inProgress",
      required: true,
    },
    type: {
      type: String,
      enum: declaredEnum.type,
    },

    priority: {
      type: String,
      enum: declaredEnum.priority,
    },

    start_date: {
      type: Date
    },
    due_date: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("task", task_model);
