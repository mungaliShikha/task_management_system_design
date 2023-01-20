const Joi = require('joi');

module.exports = {

    logIn: (payload) => {
        const schema = Joi.object({
            first_name: Joi.string().min(2).max(10).required(),
            last_name: Joi.string().min(2).max(10).required(),
            email: Joi.string().email().lowercase().required(),
            address: Joi.string().required(),
            password: Joi.string().required().min(6),
            mobile: Joi.string().regex(/^[0-9]{10}$/).required(),
        })
        return schema.validate(payload)
    },

    resetPassword: (payload) => {
        const schema = Joi.object({ password: Joi.string().required().min(6) });
        return schema.validate(payload)
    },

    updateAdmin: (payload) => {
        const schema = Joi.object({
            first_name: Joi.string().min(2).max(10).required(),
            last_name: Joi.string().min(2).max(10).required(),
            email: Joi.string().email().lowercase().required(),
            address: Joi.string().required(),
            password: Joi.string().required().min(6),
            mobile: Joi.string().regex(/^[0-9]{10}$/).required(),
        })
        return schema.validate(payload)
    }
}

