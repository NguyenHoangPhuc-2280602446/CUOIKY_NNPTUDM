import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Author from "../models/Author.js";
import Category from "../models/Category.js";

dotenv.config({ path: process.env.SEED_ENV_PATH || ".env" });

const categories = [
  { name: "Kỹ năng sống" },
  { name: "Công nghệ thông tin" },
  { name: "Văn học cổ điển" },
];

const authors = [
  { name: "Dale Carnegie" },
  { name: "Robert Martin" },
  { name: "Nguyễn Nhật Ánh" },
];

const run = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);

    const catResults = [];
    for (const c of categories) {
      const doc = await Category.findOneAndUpdate({ name: c.name }, c, { upsert: true, new: true });
      catResults.push(doc);
    }

    const authorResults = [];
    for (const a of authors) {
      const doc = await Author.findOneAndUpdate({ name: a.name }, a, { upsert: true, new: true });
      authorResults.push(doc);
    }

    console.log("Seeded categories:");
    catResults.forEach((c) => console.log(`- ${c.name}: ${c._id}`));
    console.log("Seeded authors:");
    authorResults.forEach((a) => console.log(`- ${a.name}: ${a._id}`));
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
  }
};

run();
