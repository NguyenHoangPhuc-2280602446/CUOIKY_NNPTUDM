import Cart from "../models/Cart.js";

export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.book");
  res.json(cart || { items: [] });
};

export const upsertCart = async (req, res) => {
  const { book, quantity } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  const idx = cart.items.findIndex((i) => i.book.toString() === book);
  if (idx > -1) cart.items[idx].quantity = quantity;
  else cart.items.push({ book, quantity });
  await cart.save();
  res.json(cart);
};

export const clearCart = async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  res.json({ message: "Cart cleared" });
};
