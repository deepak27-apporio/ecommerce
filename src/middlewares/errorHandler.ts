import { Request, Response, NextFunction } from "express";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("Error:::", err);
  err.message = err.message || "Internal server error";
  err.statusCode = err.statusCode || 500;

  if (err.name === "CastError") {
    err.message = "Invalid ID";
  }

  return res.status(err.statusCode).json({
    status: err.statusCode,
    message: err.message,
  });
};

export const tryCatch =
  (func: Function) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(func(req, res, next)).catch(next);
  };
