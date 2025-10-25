import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import path from "node:path";
import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/error.js";
import authRoutes from "./modules/auth/routes.js";
import healthRoutes from "./modules/health/routes.js";
import orderRoutes from "./modules/orders/routes.js";
import productRoutes from "./modules/products/routes.js";
import uploadRoutes from "./modules/uploads/routes.js";
import userRoutes from "./modules/users/routes.js";

const app = express();
app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 60_000, max: 120 }));

// static for uploads
app.use("/uploads", express.static(path.resolve(env.UPLOAD_DIR)));

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/uploads", uploadRoutes);
app.use("/health", healthRoutes);

app.use(errorHandler);
export default app;
