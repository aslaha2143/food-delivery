import Food from "../models/foodModel.js";

// CREATE FOOD
const createFood = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      restaurantId
    } = req.body;

    if (!name || !price || !category || !restaurantId) {
      return res.status(400).json({
        message: "Name, price, category and restaurantId are required"
      });
    }

    if (price <= 0) {
      return res.status(400).json({
        message: "Price must be greater than 0"
      });
    }

    const food = await Food.create({
      name,
      description: description || "",
      price,
      category,
      restaurantId
    });

    res.status(201).json({
      message: "Food created successfully",
      food
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create food",
      error: error.message
    });
  }
};


// GET ALL FOODS
const getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find();

    res.status(200).json({
      count: foods.length,
      foods
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch foods",
      error: error.message
    });
  }
};


// GET FOOD BY ID
const getFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        message: "Food not found"
      });
    }

    res.status(200).json({
      food
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch food",
      error: error.message
    });
  }
};


// UPDATE FOOD
const updateFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        message: "Food not found"
      });
    }

    const {
      name,
      description,
      price,
      category,
      restaurantId
    } = req.body;

    if (price !== undefined && price <= 0) {
      return res.status(400).json({
        message: "Price must be greater than 0"
      });
    }

    food.name = name ?? food.name;
    food.description = description ?? food.description;
    food.price = price ?? food.price;
    food.category = category ?? food.category;
    food.restaurantId = restaurantId ?? food.restaurantId;

    await food.save();

    res.status(200).json({
      message: "Food updated successfully",
      food
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update food",
      error: error.message
    });
  }
};


// DELETE FOOD
const deleteFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);

    if (!food) {
      return res.status(404).json({
        message: "Food not found"
      });
    }

    res.status(200).json({
      message: "Food deleted successfully",
      food
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete food",
      error: error.message
    });
  }
};


// GET FOODS BY RESTAURANT
const getFoodsByRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const foods = await Food.find({
      restaurantId: id
    });

    res.status(200).json({
      restaurantId: id,
      count: foods.length,
      foods
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch restaurant foods",
      error: error.message
    });
  }
};


export {
  createFood,
  getAllFoods,
  getFood,
  updateFood,
  deleteFood,
  getFoodsByRestaurant
};