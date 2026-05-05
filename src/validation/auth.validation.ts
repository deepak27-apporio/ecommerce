import Joi from "joi";

export const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name cannot exceed 50 characters",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required",
  }),

  gender: Joi.string().valid("male", "female").required().messages({
    "any.only": "Gender must be male or female",
    "string.empty": "Gender is required",
  }),

  role: Joi.string().valid("admin", "user").optional().messages({
    "any.only": "Role must be admin or user",
  }),

  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
  }),
  confirmPassword: Joi.string().min(6).required().messages({
    "string.empty": "Please confirm your password",
    "string.min": "Password must be at least 6 characters",
  }),
}).required();


export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required",
  }),

  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
  }),
}).required();
