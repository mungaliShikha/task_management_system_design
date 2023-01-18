const mongoose = require("mongoose");
const schema = mongoose.Schema;

var comment_model = new schema(
  {
    title: {
      type: String,
      required: true,
    },

    task: [
      {
        type: schema.Types.ObjectId,
        ref: "user",
      },
    ],
    developer: [
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


module.exports = mongoose.model("comment", comment_model);

