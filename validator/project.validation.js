const Joi = require("joi");

module.exports = {
  createProjectValidation: (payload) => {
    const schema = Joi.object({
      project_name: Joi.string().min(2).max(10).required(),
      description: Joi.string().min(10).max(50).required(),
      project_task: Joi.string(),
      status: Joi.string().valid("started", "ongoing", "completed", "canceled"),
      developers: Joi.string().min(2).max(10).required(),
      active_status: Joi.string(),
    });
    return schema.validate(payload);
  },

  addManagerValidator: (payload) => {
    const schema = Joi.object({
      manager: Joi.string().min(2).max(10).required(),
    });
    return schema.validate(payload);
  },
  addTaskValidator: (payload) => {
    const schema = Joi.object({
      project_task: Joi.string(),
    });
    return schema.validate(payload);
  },

  updateProjectValidator: (payload) => {
    const schema = Joi.object({
      project_name: Joi.string().min(2).max(20),
      description: Joi.string().min(10).max(50),
      project_task: Joi.string(),
      status: Joi.string().valid("started", "ongoing", "completed", "canceled"),
      developers: Joi.string().min(2).max(10),
      active_status: Joi.string(),
    });
    return schema.validate(payload);
  },

  removeProjectValidator: (payload) => {
    const schema = Joi.object({
      status: Joi.string().valid("canceled"),
    });
    return schema.validate(payload);
  },
};
