// src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.js";
import { StatusCodes } from "../utils/apiResponse.js";


export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];

    if (!accessToken) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Not authenticated, no tokens found",
      });
    }

    const decoded = verifyAccessToken(accessToken);
    req.user = {
      id: Number(decoded.id),
      role: decoded.role,
    };

    return next();
  } catch (error) {
    console.log("Authentication error:", error);
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Invalid or expired token" });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log("Authorizing roles:", roles, "for user:", req.user);
    if (!req.user || !req.user.role) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "Access denied" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: `Role '${req.user.role}' is not allowed`,
      });
    }

    next();
  };
};
