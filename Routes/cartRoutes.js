import express from "express"
import {  addToCart, clearCart, getCart, removeFromCart, updateCartItem } from "../Controllers/cartController.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";


const router = express.Router();

router.get("/getAll", authMiddleware, getCart);

router.post("/add", authMiddleware, addToCart);

router.put("/update/:id", authMiddleware, updateCartItem);

router.delete("/remove/:id", authMiddleware, removeFromCart);

router.delete("/clear", authMiddleware, clearCart);

export default router;