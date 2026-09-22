
import express from "express";

import { createFood, deleteFood, getAllFoods, getFood, getFoodsByRestaurant, updateFood } from "../Controllers/foodController.js";
import { allowRoles, authMiddleware } from "../Middleware/authMiddleware.js";


const router = express.Router();

router.post("/create",authMiddleware,allowRoles("admin"),createFood);

router.get("/getAll", getAllFoods);

router.get("/getOne/:id", getFood);

router.put("/update/:id",authMiddleware,allowRoles("admin"), updateFood);

router.delete("/delete/:id",authMiddleware,allowRoles("admin"), deleteFood);

router.get("/restaurant/food/:id", getFoodsByRestaurant);

export default router;







