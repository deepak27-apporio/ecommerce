import express, { Application } from "express";
import cors from "cors";

import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/order.js";
import productRoutes from "./routes/admin/product.js";
import adminOrderRoutes from "./routes/admin/order.js";
import { globalErrorHandler } from "./middlewares/errorHandler.js";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import path from "path/win32";
import cookieParser from "cookie-parser";

dotenv.config();
const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(morgan("dev"));

app.use(
  "/api/",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later." },
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/admin/product", productRoutes);
app.use("/api/admin/order", adminOrderRoutes);

app.use(globalErrorHandler);
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "public", "uploads")),
);

app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`),
);
