import { Router } from "express";

import { isAuthenticated } from "../middlewares/auth.js";
import { orderSchema } from "../validation/order.validation.js";
import {
  CreateOrder,
  getAllOrders,
  getOrderDetailById,
  verifyPayment,
} from "../controllers/order.js";
import { validate } from "../middlewares/validation.js";

const router = Router();

router.use(isAuthenticated);

router.post("/create", isAuthenticated, validate(orderSchema), CreateOrder);
router.post("/verify-payment", isAuthenticated, verifyPayment);
router.get("/all-orders", isAuthenticated, getAllOrders);
router.get("/:id", isAuthenticated, getOrderDetailById);

export default router;
