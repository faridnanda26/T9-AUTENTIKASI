import Joi from 'joi';

export const orderSchema = Joi.object({
    productId: Joi.number()
        .integer()
        .positive()
        .required(),

    quantity: Joi.number()
        .integer()
        .positive()
        .min(1)
        .required()
});