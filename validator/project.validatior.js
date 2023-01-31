const Joi = require("joi");
const enums = require("../helper/enum/enums");

module.exports = {
  createProjectValidation: (payload) => {
    const schema = Joi.object({
      // projectId: Joi.string().required(),
      project_name: Joi.string().required(),
      description: Joi.string().required(),
      projectStatus: Joi.string().valid(
        enums.declaredEnum.projectStatus.STARTED,
        enums.declaredEnum.projectStatus.COMPLETED,
        enums.declaredEnum.projectStatus.ONGOING
      ),
      project_task: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
      manager: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
    });

    return schema.validate(payload);
  },
  addManagerValidator: (payload) => {
    const schema = Joi.object({
      manager: Joi.array()
        .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
        .required(),
    });
    return schema.validate(payload);
  },
  addTaskValidator: (payload) => {
    const schema = Joi.object({
      project_task: Joi.array()
        .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
        .required(),
    });
    return schema.validate(payload);
  },
  removeManagerProjectValidator: (payload) => {
    const schema = Joi.object({
      manager: Joi.array()
        .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
        .required(),
    });

    return schema.validate(payload);
  },
  updateProjectValidator: (payload) => {
    const schema = Joi.object({
      projectStatus: Joi.string().valid(
        enums.declaredEnum.projectStatus.STARTED,
        enums.declaredEnum.projectStatus.COMPLETED,
        enums.declaredEnum.projectStatus.ONGOING,
        enums.declaredEnum.projectStatus.CANCEL
      ),
    });

    return schema.validate(payload);
  },

  removeProjectValidator: (payload) => {
    const schema = Joi.object({
      manager: Joi.array()
        .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
        .required(),
    });

    return schema.validate(payload);
  },
};
