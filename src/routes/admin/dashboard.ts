import { Router } from "express";
import { authorizeRoles, isAuthenticated } from "../../middlewares/auth.js";
import { getDashboardDetail } from "../../controllers/admin/dashboard.js";

const router = Router();

router.use(isAuthenticated, authorizeRoles("admin"));

router.get("/", getDashboardDetail);

export default router;
