const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
var mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const bcrypt = require("bcryptjs");
const commonFunction = require("../helper/commonFunction");
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

userModel.plugin(mongoosePaginate);
userModel.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("comment", comment_model);

