import Order from "../models/orderModel.js";
import Food from "../models/foodModel.js";
import User from "../models/userModel.js";



const validStatuses = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "picked_up",
  "out_for_delivery",
  "delivered",
  "cancelled"
];


const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Order items are required"
      });
    }

    if (!deliveryAddress) {
      return res.status(400).json({
        message: "Delivery address is required"
      });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      if (!item.foodId || !item.quantity) {
        return res.status(400).json({
          message: "Food ID and quantity are required"
        });
      }

      if (item.quantity < 1) {
        return res.status(400).json({
          message: "Quantity must be at least 1"
        });
      }

      const food = await Food.findById(item.foodId);

      if (!food) {
        return res.status(404).json({
          message: `Food ${item.foodId} not found`
        });
      }

      const itemTotal = food.price * item.quantity;

      orderItems.push({
        foodId: food._id,
        name: food.name,
        quantity: item.quantity,
        price: food.price,
        itemTotal
      });

      totalAmount += itemTotal;
    }

    const order = await Order.create({
      customerId: req.user.id,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      status: "pending",
      deliveryPartnerId: null
    });

    return res.status(201).json({
      message: "Order placed successfully",
      order
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};




const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customerId", "name email")
      .populate("items.foodId");

    return res.status(200).json({
      count: orders.length,
      orders
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const myOrders = await Order.find({
      customerId: req.user.id
    })
      .populate("items.foodId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: myOrders.length,
      orders: myOrders
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


const getOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("customerId", "name email")
      .populate("items.foodId");

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }
    
    if (req.user.role === "admin") {
      return res.status(200).json({
        order
      });
    }
    
    if (req.user.role === "delivery") {

      if (
        !order.deliveryPartnerId ||
        order.deliveryPartnerId._id.toString() !== req.user.id
      ) {
        return res.status(403).json({
          message: "This order is not assigned to you"
        });
      }

      return res.status(200).json({
        order
      });
    }


    

    if (order.customerId._id.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only view your own orders"
      });
    }

    return res.status(200).json({
      order
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};



const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
        validStatuses
      });
    }

    
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can update order status"
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    order.status = status;

    await order.save();

    return res.status(200).json({
      message: "Order status updated successfully",
      order
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


export {
  createOrder,
  getOrders,
  getMyOrders,
  getOrder,
  updateOrderStatus
};

