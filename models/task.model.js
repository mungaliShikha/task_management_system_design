const mongoose = require("mongoose");
const enums = require("../helper/enum/enums");
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
      enum: [
        enums.declaredEnum.status.ACTIVE,
        enums.declaredEnum.status.BLOCKED,
        enums.declaredEnum.status.DELETE,
      ],
      default: enums.declaredEnum.status.ACTIVE,
    },

    name: {
      type: String,
      required: true,
    },

    taskStatus: {
      type: String,
      enum: [
        enums.declaredEnum.taskStatus.INPROGRESS,
        enums.declaredEnum.taskStatus.COMPLETED,
        enums.declaredEnum.taskStatus.INQA,
      ],
      default: enums.declaredEnum.taskStatus.INPROGRESS,
      required: true,
    },
    type: {
      type: String,
      enum: [
        enums.declaredEnum.type.BUG,
        enums.declaredEnum.type.ENHANCEMENT,
        enums.declaredEnum.type.NEWFEATURE,
      ],
    },

    priority: {
      type: String,
      enum: [
        enums.declaredEnum.priority.HIGH,
        enums.declaredEnum.priority.LOW,
        enums.declaredEnum.priority.MEDIUM,
        enums.declaredEnum.priority.URGENT,
      ],
    },

    start_date: {
      type: Date,
    },
    due_date: {
      type: Date,
    },
    comments_in_task: [
      {
        type: schema.Types.ObjectId,
        ref: "comment",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("task", task_model);
