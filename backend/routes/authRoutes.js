import express from "express";
import { login, register, me } from "../controllers/authController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, me);

export default router;
