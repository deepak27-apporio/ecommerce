import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Product name is required",
  }),

  description: Joi.string().min(10).optional().messages({
    "string.empty": "Description is required",
  }),

  price: Joi.number().positive().required().messages({
    "number.base": "Price must be a number",
    "number.positive": "Price must be greater than 0",
  }),

  category: Joi.string().min(2).required().messages({
    "string.empty": "Category is required",
  }),
  stock: Joi.number().integer().min(0).required().messages({
    "number.base": "Stock must be a number",
    "number.integer": "Stock must be an integer",
    "number.min": "Stock cannot be negative",
  }),

  isActive: Joi.boolean().optional(),
}).required();