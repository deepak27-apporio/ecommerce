import { Router } from "express";
import { getAllProducts, getProduct } from "../controllers/admin/product.js";

const router = Router();

router.get("/", getAllProducts).get("/:id", getProduct);

export default router;
