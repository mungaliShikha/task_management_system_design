const mongoose = require("mongoose");
const schema = mongoose.Schema;

var comment_model = new schema(
  {
    comment: {
      type: String,
      required: true,
    },
    user: {
      type: schema.Types.ObjectId,
      ref: "users",
    },
    taskId: {
      type: schema.Types.ObjectId,
      ref: "task",
    },
    isDeleted :{
      type:Boolean,
      default:false
    }
  },
  { timestamps: false }
);

module.exports = mongoose.model("comment", comment_model);
