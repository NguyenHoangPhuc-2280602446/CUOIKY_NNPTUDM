import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Author", required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    coverImage: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

bookSchema.index({ title: "text", description: "text" });

export default mongoose.model("Book", bookSchema);
