import express from "express";
import { protect } from "../middleware/auth.js";
import { getNotifications, markRead } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.patch("/:id/read", protect, markRead);

export default router;
