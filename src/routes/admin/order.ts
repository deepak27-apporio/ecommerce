import { Router } from "express";
import { authorizeRoles, isAuthenticated } from "../../middlewares/auth.js";
import { getAllOrders } from "../../controllers/admin/order.js";

const router = Router();

router.use(isAuthenticated, authorizeRoles("admin"));

router.get("/", getAllOrders);
// router.get("/:id", getOrder);
// router.post("/search/ai-search", aiSearchProducts);

export default router;