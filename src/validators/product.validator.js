import Joi from 'joi';

export const productSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(150)
        .required(),

    category: Joi.string()
        .valid('MAKANAN', 'MINUMAN', 'CEMILAN')
        .required(),

    price: Joi.number()
        .positive()
        .precision(2)
        .required(),

    stock: Joi.number()
        .integer()
        .min(0)
        .default(0)
});