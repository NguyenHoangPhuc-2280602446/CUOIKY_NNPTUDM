import Author from "../models/Author.js";

export const createAuthor = async (req, res) => {
  const author = await Author.create(req.body);
  res.status(201).json(author);
};

export const getAuthors = async (_req, res) => {
  const authors = await Author.find();
  res.json(authors);
};

export const updateAuthor = async (req, res) => {
  const author = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!author) return res.status(404).json({ message: "Author not found" });
  res.json(author);
};

export const deleteAuthor = async (req, res) => {
  const author = await Author.findByIdAndDelete(req.params.id);
  if (!author) return res.status(404).json({ message: "Author not found" });
  res.json({ message: "Author deleted" });
};
