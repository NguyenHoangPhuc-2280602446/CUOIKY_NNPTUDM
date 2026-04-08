import express from "express";
import { authorize, protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { createBook, deleteBook, getBook, getBooks, updateBook } from "../controllers/bookController.js";

const router = express.Router();

router.get("/", getBooks);
router.get("/:id", getBook);
router.post("/", protect, authorize("admin"), upload.single("coverImage"), createBook);
router.put("/:id", protect, authorize("admin"), upload.single("coverImage"), updateBook);
router.delete("/:id", protect, authorize("admin"), deleteBook);

export default router;
