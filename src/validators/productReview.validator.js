import Joi from 'joi';

export const productReviewSchema = Joi.object({
    reviewer: Joi.string()
        .min(3)
        .max(100)
        .required(),

    comment: Joi.string()
        .min(5)
        .required(),

    rating: Joi.number()
        .integer()
        .min(1)
        .max(5)
        .required(),

    productId: Joi.number()
        .integer()
        .positive()
        .required()
});
