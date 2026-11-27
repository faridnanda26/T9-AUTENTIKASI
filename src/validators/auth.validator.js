import Joi from 'joi';

export const authSchema = Joi.object({
    email:    Joi.string().email().max(100).required(),
    password: Joi.string().min(8).max(72).required()
});