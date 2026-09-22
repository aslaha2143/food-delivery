
import express from "express";

import { createOrder, getMyOrders, getOrder, getOrders, updateOrderStatus } from "../Controllers/orderController.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";



const router = express.Router();

router.post("/create",authMiddleware,createOrder);

router.get("/my-orders",authMiddleware,getMyOrders);

router.get("/getOne:id", authMiddleware,getOrder);

router.get("/getAll",authMiddleware,getOrders);

router.put("/update/:id/status",authMiddleware,updateOrderStatus);


export default router;