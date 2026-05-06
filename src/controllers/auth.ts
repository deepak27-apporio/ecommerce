import { Request, Response, NextFunction } from "express";
import { tryCatch } from "../middlewares/errorHandler.js";
import ErrorHandler from "../utils/errorClass.js";
import bcrypt from "bcrypt";
import { prisma } from "../utils/client.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { StatusCodes } from "../utils/apiResponse.js";

export const login = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return next(
        new ErrorHandler("Invalid email or password", StatusCodes.BAD_REQUEST),
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(
        new ErrorHandler("Invalid email or password", StatusCodes.BAD_REQUEST),
      );
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Login successful",
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  },
);

export const register = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, gender } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser)
      return next(
        new ErrorHandler("Email already exists", StatusCodes.BAD_REQUEST),
      );

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        gender,
      },
      select: {
        id: true,
        name: true,
        email: true,
        gender: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  },
);

export const logout = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Logout successful",
    });
  },
);

export const refreshToken = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.refreshToken;
    if (!token)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    const decoded: any = verifyRefreshToken(token);

    const accessToken = generateAccessToken(decoded);

    res.status(StatusCodes.OK).json({ accessToken });
  },
);
