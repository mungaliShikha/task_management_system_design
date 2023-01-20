const joi = require("joi");

const validation = joi.object({
    first_name: joi.string().alphanum().min(3).max(25).trim(true).required(),
    last_name: joi.string().alphanum().min(3).max(25).trim(true).required(),

    email: joi.string().email().trim(true).required(),
    password: joi.string().min(8).trim(true).required(),
    mobileNumber: joi.string().length(10).pattern(/[6-9]{1}[0-9]{9}/).required(),
    status: joi.boolean().default(true),
});


