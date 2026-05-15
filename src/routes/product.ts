import { Router } from "express";
import { getAllProducts, getAllProductsByMcp, getProduct } from "../controllers/admin/product.js";

const router = Router();

router
    .get("/", getAllProducts)
    .get("/ai/search", getAllProductsByMcp)
    .get("/:id", getProduct);

export default router;
