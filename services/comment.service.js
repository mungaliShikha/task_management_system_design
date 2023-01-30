const Comment = require("../models/comment.model");

module.exports = {
  getOneComment: async (params) => {
    return Comment.findOne(params);
  },

  getAllComment: async (params) => {
    return Comment.find(params);
  },
  getCommentData: async () => {
    return Comment.find();
  },
  getCommentById: async (id) => {
    return Comment.findById(id);
  },
  getCommentAndUpdate: async (id, update, data) => {
    return Comment.findByIdAndDelete(id, update, data);
  },
  getOneCommentAndUpdate: async (params, update, data) => {
    return Comment.findOneAndUpdate(params, update, data);
  },
  createComment: async (data) => {
    return Comment.create(data);
  },
};
