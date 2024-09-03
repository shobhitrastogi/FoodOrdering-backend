import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Configuring environment variables
dotenv.config();

import { connectDB } from "./config/db.js";  // Importing DB configuration
import foodRouter from "./routes/foodRoute.js";  // Importing Food routes
import userRouter from "./routes/userRoute.js";  // Importing User routes
import cartRouter from "./routes/cartRoute.js";  // Importing Cart routes
import orderRouter from "./routes/orderRoute.js";  // Importing Order routes

// App config
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to Database
connectDB();

// API endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));  // Serving static files from "uploads" directory
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

export default app;  // Exporting the app
