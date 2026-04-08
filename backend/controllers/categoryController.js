import Category from "../models/Category.js";

export const createCategory = async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json(category);
};

export const getCategories = async (_req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

export const updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!category) return res.status(404).json({ message: "Category not found" });
  res.json(category);
};

export const deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return res.status(404).json({ message: "Category not found" });
  res.json({ message: "Category deleted" });
};
