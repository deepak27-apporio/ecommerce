import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../../controllers/admin/product.js";
import { authorizeRoles, isAuthenticated } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validation.js";
import { createProductSchema } from "../../validation/product.validation.js";
import { upload } from "../../middlewares/multer.js";

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", getProduct);
// router.post("/search/ai-search", aiSearchProducts);

router.use(isAuthenticated, authorizeRoles("admin"));

router.post("/",upload.array("images", 5), validate(createProductSchema), addProduct);
router.put("/:id",upload.array("images", 5), validate(createProductSchema), updateProduct);
router.delete("/:id", deleteProduct);

export default router;