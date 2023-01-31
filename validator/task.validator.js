const Joi = require("joi");
const enums = require("../helper/enum/enums");

module.exports = {
  createTaskValidation: (payload) => {
    const schema = Joi.object({
      projectId: Joi.string().required(),
      name: Joi.string().min(2).max(20).required(),
      type: Joi.string()
        .valid(
          enums.declaredEnum.type.BUG,
          enums.declaredEnum.type.ENHANCEMENT,
          enums.declaredEnum.type.NEWFEATURE
        )
        .required(),
      priority: Joi.string()
        .valid(
          enums.declaredEnum.priority.URGENT,
          enums.declaredEnum.priority.HIGH,
          enums.declaredEnum.priority.LOW
        )
        .required(),
      status: Joi.string().valid(
        enums.declaredEnum.status.ACTIVE,
        enums.declaredEnum.status.BLOCKED,
        enums.declaredEnum.status.DELETE,
        enums.declaredEnum.status.CANCEL
      ),
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
      type: Joi.string().valid(
        enums.declaredEnum.type.BUG,
        enums.declaredEnum.type.ENHANCEMENT,
        enums.declaredEnum.type.NEWFEATURE
      ),
      priority: Joi.string().valid(
        enums.declaredEnum.priority.URGENT,
        enums.declaredEnum.priority.HIGH,
        enums.declaredEnum.priority.LOW
      ),
      status: Joi.string().valid(
        enums.declaredEnum.status.ACTIVE,
        enums.declaredEnum.status.BLOCKED,
        enums.declaredEnum.status.DELETE,
        enums.declaredEnum.status.CANCEL
      ),
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
      status: Joi.string().valid(
        enums.declaredEnum.status.ACTIVE,
        enums.declaredEnum.status.BLOCKED,
        enums.declaredEnum.status.DELETE,
        enums.declaredEnum.status.CANCEL
      ),
    });
    return schema.validate(payload);
  },
};