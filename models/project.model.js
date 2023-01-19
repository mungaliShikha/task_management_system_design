const mongoose = require("mongoose");
const enums = require("../helper/enum/enums")
const schema = mongoose.Schema;

var project_model = new schema(
  {
    project_name: {
      type: String,
    },
    description: {
      type: String,
    },
    projectStatus: {
      type: String,
      enum: [enums.declaredEnum.projectStatus.STARTED,enums.declaredEnum.projectStatus.COMPLETED,enums.declaredEnum.projectStatus.ONGOING]
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



module.exports = mongoose.model("project", project_model);
