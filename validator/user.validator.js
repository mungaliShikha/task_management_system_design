const Joi = require('joi');
module.exports= {

     addManager : (payload) =>{
        const schema = Joi.object({
            first_name: Joi.string().required().error(new Error("")),
            last_name: Joi.string().required().error(new Error("Email is not correct")),
            email: Joi.string().email().lowercase().required().error(new Error("Email is not correct")),
            mobile: Joi.string().required(),
        })
        return schema.validate(payload)
        },


        
}




