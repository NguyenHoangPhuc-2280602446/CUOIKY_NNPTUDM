import mongoose from "mongoose";
import Order from "../models/Order.js";
import Book from "../models/Book.js";
import { emitOrderStatus } from "../socket/index.js";

export const createOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const items = req.body.items || [];
    if (!items.length) return res.status(400).json({ message: "No items" });

    const orderItems = [];
    let total = 0;

    for (const item of items) {
      const book = await Book.findById(item.book).session(session);
      if (!book || book.stock < item.quantity) {
        throw new Error("Stock not available");
      }
      book.stock -= item.quantity;
      await book.save({ session });
      orderItems.push({ book: book._id, quantity: item.quantity, price: book.price });
      total += book.price * item.quantity;
    }

    const order = await Order.create(
      [
        {
          user: req.user._id,
          items: orderItems,
          total,
          status: "paid",
          paymentStatus: "paid",
        },
      ],
      { session }
    );

    await session.commitTransaction();
    emitOrderStatus(order[0]);
    res.status(201).json(order[0]);
  } catch (err) {
    await session.abortTransaction();
    return next(err);
  } finally {
    session.endSession();
  }
};

export const getOrders = async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { user: req.user._id };
  const orders = await Order.find(filter).populate("items.book").sort({ createdAt: -1 });
  res.json(orders);
};

export const updateOrderStatus = async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!order) return res.status(404).json({ message: "Order not found" });
  emitOrderStatus(order);
  res.json(order);
};
