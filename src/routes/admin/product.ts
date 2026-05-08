import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  updateProductStatus,
} from "../../controllers/admin/product.js";
import { authorizeRoles, isAuthenticated } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validation.js";
import { createProductSchema } from "../../validation/product.validation.js";
import { upload } from "../../middlewares/multer.js";

const router = Router();

// router.post("/search/ai-search", aiSearchProducts);

router.use(isAuthenticated, authorizeRoles("admin"));

router
  .get("/", getAllProducts)
  .get("/:id", getProduct)
  .post(
    "/",
    upload.array("images", 5),
    validate(createProductSchema),
    addProduct,
  )
  .put(
    "/:id",
    upload.array("images", 5),
    validate(createProductSchema),
    updateProduct,
  )
  .patch("/status/:id", updateProductStatus)
  .delete("/:id", deleteProduct);

export default router;
