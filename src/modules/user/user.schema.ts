import * as Joi from '@hapi/joi';


export const loginSchema = {
    id : Joi.string().required(),
    password: Joi.string().required()
}

export const signupSchema = Joi.object({
    id: Joi.string().required(),
    nickname : Joi.string().required(),
    password : Joi.string().required(),
})