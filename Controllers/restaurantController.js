import Restaurant from "../models/restaurantModel.js";

// CREATE RESTAURANT
const createRestaurant = async (req, res) => {
  try {
    const {
      name,
      description,
      address,
      phone,
      image,
      isOpen
    } = req.body;

    if (!name || !address || !phone) {
      return res.status(400).json({
        message: "Name, address and phone are required"
      });
    }

    const restaurant = await Restaurant.create({
      name,
      description: description || "",
      address,
      phone,
      image: image || "",
      isOpen: isOpen ?? true
    });

    res.status(201).json({
      message: "Restaurant created successfully",
      restaurant
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create restaurant",
      error: error.message
    });
  }
};


// GET ALL RESTAURANTS
const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();

    res.status(200).json({
      count: restaurants.length,
      restaurants
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch restaurants",
      error: error.message
    });
  }
};


// GET RESTAURANT BY ID
const getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found"
      });
    }

    res.status(200).json({
      restaurant
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch restaurant",
      error: error.message
    });
  }
};


// UPDATE RESTAURANT
const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found"
      });
    }

    const {
      name,
      description,
      address,
      phone,
      image,
      isOpen
    } = req.body;

    restaurant.name = name ?? restaurant.name;
    restaurant.description = description ?? restaurant.description;
    restaurant.address = address ?? restaurant.address;
    restaurant.phone = phone ?? restaurant.phone;
    restaurant.image = image ?? restaurant.image;
    restaurant.isOpen = isOpen ?? restaurant.isOpen;

    await restaurant.save();

    res.status(200).json({
      message: "Restaurant updated successfully",
      restaurant
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update restaurant",
      error: error.message
    });
  }
};


// DELETE RESTAURANT
const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found"
      });
    }

    res.status(200).json({
      message: "Restaurant deleted successfully",
      restaurant
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete restaurant",
      error: error.message
    });
  }
};


export {
  createRestaurant,
  getRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant
};
