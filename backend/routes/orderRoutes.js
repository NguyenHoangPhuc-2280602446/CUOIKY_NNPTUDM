import express from "express";
import { authorize, protect } from "../middleware/auth.js";
import { createOrder, getOrders, updateOrderStatus } from "../controllers/orderController.js";

const router = express.Router();

router.get("/", protect, getOrders);
router.post("/", protect, createOrder);
router.put("/:id/status", protect, authorize("admin"), updateOrderStatus);

export default router;
