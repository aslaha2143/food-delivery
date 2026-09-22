
import Cart from "../models/cartModel.js";
import Food from "../models/foodModel.js";


const getCart = async (req, res) => {
  try {
    const customerId = req.user.id;

    const cart = await Cart.findOne({
      customerId
    }).populate("items.foodId");

    if (!cart) {
      return res.status(200).json({
        customerId,
        items: [],
        total: 0
      });
    }

    return res.status(200).json(cart);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};



const addToCart = async (req, res) => {
  try {
    const { foodId, quantity } = req.body;

    if (!foodId || !quantity) {
      return res.status(400).json({
        message: "Food ID and quantity are required"
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1"
      });
    }

  
    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({
        message: "Food not found"
      });
    }

    const customerId = req.user.id;

    let cart = await Cart.findOne({
      customerId
    });


    if (!cart) {
      cart = new Cart({
        customerId,
        items: [],
        total: 0
      });
    }

    // Check if food already exists in cart
    const existingItem = cart.items.find(
      (item) => item.foodId.toString() === foodId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        foodId,
        quantity
      });
    }

    // Calculate total
    cart.total = await calculateTotal(cart);

    await cart.save();

    await cart.populate("items.foodId");

    return res.status(201).json({
      message: "Food added to cart",
      cart
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// UPDATE CART ITEM
const updateCartItem = async (req, res) => {
  try {
    const { foodId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1"
      });
    }

    const customerId = req.user.id;

    const cart = await Cart.findOne({
      customerId
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found"
      });
    }

    const item = cart.items.find(
      (item) => item.foodId.toString() === foodId
    );

    if (!item) {
      return res.status(404).json({
        message: "Food not found in cart"
      });
    }

    item.quantity = quantity;

    cart.total = await calculateTotal(cart);

    await cart.save();

    await cart.populate("items.foodId");

    return res.status(200).json({
      message: "Cart updated",
      cart
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// REMOVE FROM CART
const removeFromCart = async (req, res) => {
  try {
    const { foodId } = req.params;

    const customerId = req.user.id;

    const cart = await Cart.findOne({
      customerId
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found"
      });
    }

    const itemExists = cart.items.some(
      (item) => item.foodId.toString() === foodId
    );

    if (!itemExists) {
      return res.status(404).json({
        message: "Food not found in cart"
      });
    }

    cart.items = cart.items.filter(
      (item) => item.foodId.toString() !== foodId
    );

    cart.total = await calculateTotal(cart);

    await cart.save();

    await cart.populate("items.foodId");

    return res.status(200).json({
      message: "Food removed from cart",
      cart
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// CLEAR CART
const clearCart = async (req, res) => {
  try {
    const customerId = req.user.id;

    const cart = await Cart.findOne({
      customerId
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found"
      });
    }

    cart.items = [];
    cart.total = 0;

    await cart.save();

    return res.status(200).json({
      message: "Cart cleared",
      cart
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// CALCULATE CART TOTAL
const calculateTotal = async (cart) => {
  let total = 0;

  for (const item of cart.items) {
    const food = await Food.findById(item.foodId);

    if (food) {
      total += food.price * item.quantity;
    }
  }

  return total;
};


export {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};
