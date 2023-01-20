const Joi = require('joi');
module.exports= {

     addManager : (payload) =>{
        const schema = Joi.object({
            first_name: Joi.string().required(),
            last_name: Joi.string().required(),
            email: Joi.string().email().lowercase().required(),
            mobile: Joi.string().required(),
        })
        return schema.validate(payload)
        },


        
}




