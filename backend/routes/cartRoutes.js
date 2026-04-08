import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import { clearCart, getCart, upsertCart } from "../controllers/cartController.js";

const router = express.Router();

router.get("/", protect, authorize("user", "admin"), getCart);
router.post("/", protect, authorize("user", "admin"), upsertCart);
router.delete("/", protect, authorize("user", "admin"), clearCart);

export default router;
