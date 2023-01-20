const Joi = require("joi");

module.exports = {
  logIn: (payload) => {
    const schema = Joi.object({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      email: Joi.string().email().required(),
      address: Joi.string().required(),
      password: Joi.string().required().min(6),
      mobile: Joi.string().required(),
    });
    return schema.validate(payload);
  },

  resetPassword: (payload) => {
    const schema = Joi.object({ password: Joi.string().required().min(6) });
    return schema.validate(payload);
  },

  updateAdmin: (payload) => {
    const schema = Joi.object({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      email: Joi.string().email().required(),
      address: Joi.string().required(),
      password: Joi.string().required(),
      mobile: Joi.string().required(),
    });
    return schema.validate(payload);
  },
};
