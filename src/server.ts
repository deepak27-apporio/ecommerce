import express, { Application } from "express";
import cors from "cors";

import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/order.js";
import adminProductRoutes from "./routes/admin/product.js";
import productRoutes from "./routes/product.js";
import adminOrderRoutes from "./routes/admin/order.js";
import adminDashboardRoutes from "./routes/admin/dashboard.js";
import { globalErrorHandler } from "./middlewares/errorHandler.js";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import path from "path/win32";
import cookieParser from "cookie-parser";

dotenv.config();
const app: Application = express();
app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://ecommerce-frontend-lpaw.onrender.com",
    ],
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
app.use("/api/product", productRoutes);
app.use("/api/admin/product", adminProductRoutes);
app.use("/api/admin/order", adminOrderRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);

app.use(globalErrorHandler);
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "public", "uploads")),
);

app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`),
);
