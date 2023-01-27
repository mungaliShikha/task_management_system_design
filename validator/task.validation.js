const Joi = require("joi");
const { join } = require("lodash");

module.exports = {
  createTaskValidation: (payload) => {
    const schema = Joi.object({
      projectId: Joi.string().required(),
      name: Joi.string().min(2).max(20).required(),
      type: Joi.string().valid("bug", "enchancement", "new-feature").required(),
      priority: Joi.string()
        .valid("urgent", "high", "medium", "low")
        .required(),
      status: Joi.string().valid("started", "ongoing", "completed", "canceled"),
      start_date: Joi.date().iso().required(),
      due_date: Joi.date().iso().required(),
      developer_assigned: Joi.array().required(),
    });

    return schema.validate(payload);
  },

  updateTaskValidation: (payload) => {
    const schema = Joi.object({
      taskId: Joi.string().required(),
      name: Joi.string().min(2).max(20),
      type: Joi.string().valid("bug", "enchancement", "new-feature"),
      priority: Joi.string().valid("urgent", "high", "medium", "low"),
      status: Joi.string().valid("started", "ongoing", "completed", "canceled"),
      start_date: Joi.date().iso(),
      due_date: Joi.date().iso(),
      developer_assigned: Joi.array().required(),
    });
    return schema.validate(payload);
  },

  addDeveloperValidator: (payload) => {
    const schema = Joi.object({
      taskId: Joi.string().required(),
      developer_assigned: Joi.array().required(),
    });
    return schema.validate(payload);
  },

  removeDeveloperValidator: (payload) => {
    const schema = Joi.object({
      taskId: Joi.string().required(),
      developer_assigned: Joi.array().required(),
    });
    return schema.validate(payload);
  },
  changeTaskStatusValidator: (payload) => {
    const schema = Joi.object({
      taskId: Joi.string().required(),
      status: Joi.string().valid("started", "ongoing", "completed", "canceled"),
    });
    return schema.validate(payload);
  },
};
