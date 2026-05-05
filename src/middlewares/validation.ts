// src/middleware/validate.ts
import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const validate =
  (schema: Joi.ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const formattedErrors: Record<string, string> = {};

      error.details.forEach((err) => {
        const field = err.path[0] as string;
        const message = err.message.replace(/"/g, "");

        formattedErrors[field] = message;
      });

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: formattedErrors,
      });
    }

    next();
  };