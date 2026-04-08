import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "completed", "canceled"],
      default: "pending",
    },
    paymentStatus: { type: String, enum: ["unpaid", "paid", "refunded"], default: "unpaid" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
