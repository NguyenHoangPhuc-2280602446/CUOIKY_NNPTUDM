import express from "express";
import { authorize, protect } from "../middleware/auth.js";
import { createAuthor, deleteAuthor, getAuthors, updateAuthor } from "../controllers/authorController.js";

const router = express.Router();

router.get("/", getAuthors);
router.post("/", protect, authorize("admin"), createAuthor);
router.put("/:id", protect, authorize("admin"), updateAuthor);
router.delete("/:id", protect, authorize("admin"), deleteAuthor);

export default router;
