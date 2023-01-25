const Joi = require("joi");
const enums = require("../helper/enum/enums");

module.exports = {
  projectCreation: (payload) => {
    const schema = Joi.object({
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
  addManager: (payload) => {
    const schema = Joi.object({
      manager: Joi.array()
        .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
        .required(),
    });
    return schema.validate(payload);
  },
  addTask: (payload) => {
    const schema = Joi.object({
      project_task: Joi.array()
        .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
        .required(),
    });
    return schema.validate(payload);
  },
  removeProject: (payload) => {
    const schema = Joi.object({
      manager: Joi.array()
        .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
        .required(),
    });

    return schema.validate(payload);
  },
  updateSingleProject: (payload) => {
    const schema = Joi.object({
      projectStatus: Joi.string().valid(
        enums.declaredEnum.projectStatus.STARTED,
        enums.declaredEnum.projectStatus.COMPLETED,
        enums.declaredEnum.projectStatus.ONGOING
      ),
    });

    return schema.validate(payload);
  },
};
