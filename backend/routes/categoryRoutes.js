import express from "express";
import { authorize, protect } from "../middleware/auth.js";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", protect, authorize("admin"), createCategory);
router.put("/:id", protect, authorize("admin"), updateCategory);
router.delete("/:id", protect, authorize("admin"), deleteCategory);

export default router;
