import { Router } from "express";
import { login, logout, refreshToken, register } from "../controllers/auth.js";
import { validate } from "../middlewares/validation.js";
import {
  createUserSchema,
  loginSchema,
} from "../validation/auth.validation.js";
import { generateAccessToken, verifyRefreshToken } from "../utils/jwt.js";

const router = Router();
router
  .post("/login", validate(loginSchema), login)
  .post("/register", validate(createUserSchema), register)
  .post("/refresh", refreshToken)
  .post("/logout", logout);

export default router;
