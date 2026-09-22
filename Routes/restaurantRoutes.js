import express from "express";

import {
  createRestaurant,
  getRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from "../Controllers/restaurantController.js";

import  { allowRoles, authMiddleware } from "../Middleware/authMiddleware.js";


const router = express.Router();


router.post("/create",authMiddleware,allowRoles("admin"),createRestaurant);

router.get(
  "/getAll",
  getRestaurants
);
router.get(
  "/getOne/:id",
  getRestaurant
);

router.put(
  "/update/:id",
  authMiddleware,
  allowRoles("admin"),
  updateRestaurant
);

router.delete(
  "/delete/:id",
  authMiddleware,
  allowRoles("admin"),
  deleteRestaurant
);


export default router;