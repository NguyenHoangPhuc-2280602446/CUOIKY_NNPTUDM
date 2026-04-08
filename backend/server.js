import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import authorRoutes from "./routes/authorRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { initSocket } from "./socket/index.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "http://localhost:5173",
].filter(Boolean);

const corsOrigin = allowedOrigins.length ? allowedOrigins : "*";

const io = new SocketIOServer(server, {
  cors: {
    origin: corsOrigin,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  },
});
initSocket(io);

// middleware
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsPath = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsPath));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/authors", authorRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/notifications", notificationRoutes);

// health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error.message);
    process.exit(1);
  }
};

start();
