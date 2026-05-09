import cors from "cors";
import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);

app.use(notFound);
app.use(errorHandler);
