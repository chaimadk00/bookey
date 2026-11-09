import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public endpoints
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Protected endpoints (JWT authentication required)
router.post("/", authenticateToken);
router.put("/:id", authenticateToken);
router.delete("/:id", authenticateToken);

export default router;
