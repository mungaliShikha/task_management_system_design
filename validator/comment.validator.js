const Joi = require("joi");


module.exports = {
    createCommentValidator: (payload) => {
      const schema = Joi.object({
        comment: Joi.string().min(10).max(50).required(),
      });
      return schema.validate(payload);
    },
  };
