const Joi = require("joi");

module.exports = {

  forgetPasswordAdmin: (payload) => {
    const schema = Joi.object({ email: Joi.string().email().lowercase().required() });
    return schema.validate(payload);
  }
  ,

  resetPasswordAdmin: (payload) => {
    const schema = Joi.object({ password: Joi.string().required() });
    return schema.validate(payload);
  },

  updateAdminValidation: (payload) => {
    const schema = Joi.object({
      first_name: Joi.string().min(2).max(10),
      last_name: Joi.string().min(2).max(10),
      email: Joi.string().email().lowercase(),
      address: Joi.string(),
      password: Joi.string().min(6),
      mobile: Joi.string().regex(/^[0-9]{10}$/),
      profile_image: Joi.string(),
    });
    return schema.validate(payload);
  },
  createmanager: (payload) => {
    const schema = Joi.object({
      first_name: Joi.string().min(2).max(10).required().error(new Error("First Name is required")),
      last_name: Joi.string().min(2).max(10).required().error(new Error("Last Name is  correct")),
      email: Joi.string().email().lowercase().required().error(new Error("Email is not correct")),
      mobile_number: Joi.string().regex(/^[0-9]{10}$/).required()
    });
    return schema.validate(payload);
  },
};
