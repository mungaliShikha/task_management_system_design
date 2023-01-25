const Joi = require("joi");
const enums = require("../helper/enum/enums");

module.exports = {
  forgetPasswordAdmin: (payload) => {
    const schema = Joi.object({
      email: Joi.string().email().lowercase().required(),
    });
    return schema.validate(payload);
  },
  resetPasswordAdmin: (payload) => {
    const schema = Joi.object({ password: Joi.string().required().min(7) });
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
      first_name: Joi.string().min(2).max(10).required(),
      last_name: Joi.string().min(2).max(10).required(),
      email: Joi.string().email().lowercase().required(),
      mobile_number: Joi.string()
        .regex(/^[0-9]{10}$/)
        .required(),
    });
    return schema.validate(payload);
  },

  statusChangeByAdmin: (payload) => {
    const schema = Joi.object({
      status: Joi.string()
        .valid(
          enums.declaredEnum.status.BLOCKED,
          enums.declaredEnum.status.ACTIVE
        )
        .required(),
      _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    });
    return schema.validate(payload);
  },

  userDeleteByAdmin: (payload) => {
    const schema = Joi.object({
      status: Joi.string()
        .valid(
          enums.declaredEnum.status.DELETE
        )
        .required(),
      _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    });
    return schema.validate(payload);
  },


};
