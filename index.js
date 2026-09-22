import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./Routes/authRoutes.js";
import restaurantRoutes from "./Routes/restaurantRoutes.js";
import foodRoutes from "./Routes/foodRoutes.js";
import cartRoutes from "./Routes/cartRoutes.js";
import orderRoutes from "./Routes/orderRoutes.js";
import { createAdmin } from "./Controllers/authController.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/", authRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/foods", foodRoutes);
app.use("/carts", cartRoutes);
app.use("/orders", orderRoutes);


app.get("/", (req, res) => {
  res.json({
    message: "Food delivery API is running",
  });
});


mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(async () => {
    console.log("MongoDB connected successfully!");

    await createAdmin();

    app.listen(5000, () => {
      console.log("Server started on port 5000");
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });