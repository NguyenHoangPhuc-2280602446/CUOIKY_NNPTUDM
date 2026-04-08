import express from "express";
import { authorize, protect } from "../middleware/auth.js";
import { createReview, getReviewsForBook } from "../controllers/reviewController.js";

const router = express.Router({ mergeParams: true });

router.get("/:bookId", getReviewsForBook);
router.post("/:bookId", protect, authorize("user", "admin"), createReview);

export default router;
