import Review from "../models/Review.js";

export const createReview = async (req, res) => {
  const { rating, comment } = req.body;
  const review = await Review.create({
    user: req.user._id,
    book: req.params.bookId,
    rating,
    comment,
  });
  res.status(201).json(review);
};

export const getReviewsForBook = async (req, res) => {
  const reviews = await Review.find({ book: req.params.bookId }).populate("user", "name");
  res.json(reviews);
};
