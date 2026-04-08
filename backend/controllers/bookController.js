import mongoose from "mongoose";
import Book from "../models/Book.js";
import Author from "../models/Author.js";
import Category from "../models/Category.js";
import Notification from "../models/Notification.js";
import { emitNewBook } from "../socket/index.js";

const isTransactionUnsupported = (err) =>
  typeof err?.message === "string" &&
  err.message.includes("Transaction numbers are only allowed on a replica set member or mongos");

export const createBook = async (req, res, next) => {
  const session = await mongoose.startSession();
  const title = req.body.title ?? req.body.Title;
  const description = req.body.description ?? req.body.Description;
  const author = req.body.author ?? req.body.authorID ?? req.body.AuthorID;
  const category = req.body.category ?? req.body.categoryID ?? req.body.CategoryID;
  const price = req.body.price ?? req.body.Price;
  const stock = req.body.stock ?? req.body.Stock;
  const coverImage = req.file ? `/uploads/${req.file.filename}` : undefined;

  const createBookAndNotification = async (txnSession = null) => {
    let authorQuery = Author.findById(author);
    let categoryQuery = Category.findById(category);

    if (txnSession) {
      authorQuery = authorQuery.session(txnSession);
      categoryQuery = categoryQuery.session(txnSession);
    }

    const authorExists = await authorQuery;
    const categoryExists = await categoryQuery;
    if (!authorExists || !categoryExists) {
      return { error: { status: 400, message: "Author or category invalid" } };
    }

    let book;
    if (txnSession) {
      [book] = await Book.create(
        [{ title, description, author, category, price, stock, coverImage }],
        { session: txnSession }
      );
      await Notification.create(
        [{ type: "book", message: `Sach moi ${book.title} vua duoc them`, user: null }],
        { session: txnSession }
      );
    } else {
      book = await Book.create({ title, description, author, category, price, stock, coverImage });
      await Notification.create({ type: "book", message: `Sach moi ${book.title} vua duoc them`, user: null });
    }

    return { book };
  };

  try {
    session.startTransaction();
    const result = await createBookAndNotification(session);
    if (result.error) {
      await session.abortTransaction();
      return res.status(result.error.status).json({ message: result.error.message });
    }

    await session.commitTransaction();
    emitNewBook(result.book);
    return res.status(201).json(result.book);
  } catch (err) {
    try {
      await session.abortTransaction();
    } catch (_abortErr) {
      // ignore
    }

    if (isTransactionUnsupported(err)) {
      try {
        const result = await createBookAndNotification();
        if (result.error) return res.status(result.error.status).json({ message: result.error.message });
        emitNewBook(result.book);
        return res.status(201).json(result.book);
      } catch (fallbackErr) {
        return next ? next(fallbackErr) : res.status(500).json({ message: fallbackErr.message });
      }
    }

    return next ? next(err) : res.status(500).json({ message: err.message });
  } finally {
    session.endSession();
  }
};

export const getBooks = async (req, res) => {
  const { q } = req.query;
  const filter = q ? { $text: { $search: q } } : {};
  const books = await Book.find(filter).populate("author category");
  res.json(books);
};

export const getBook = async (req, res) => {
  const book = await Book.findById(req.params.id).populate("author category");
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
};

export const updateBook = async (req, res) => {
  const updates = { ...req.body };
  if (updates.Title !== undefined) updates.title = updates.Title;
  if (updates.Description !== undefined) updates.description = updates.Description;
  if (updates.AuthorID !== undefined) updates.author = updates.AuthorID;
  if (updates.authorID !== undefined) updates.author = updates.authorID;
  if (updates.CategoryID !== undefined) updates.category = updates.CategoryID;
  if (updates.categoryID !== undefined) updates.category = updates.categoryID;
  if (updates.Price !== undefined) updates.price = updates.Price;
  if (updates.Stock !== undefined) updates.stock = updates.Stock;

  delete updates.Title;
  delete updates.Description;
  delete updates.AuthorID;
  delete updates.authorID;
  delete updates.CategoryID;
  delete updates.categoryID;
  delete updates.Price;
  delete updates.Stock;

  if (req.file) updates.coverImage = `/uploads/${req.file.filename}`;
  const book = await Book.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json({ message: "Success", book });
};

export const deleteBook = async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json({ message: "Success" });
};
