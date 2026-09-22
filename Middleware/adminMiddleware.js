import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const adminOnly = (req, res, next) => {

  
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message:
        "Access denied. Only admin can perform this action",
    });
  }

  next();
};

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access token required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {
    console.log("JWT ERROR:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

const isDelivery = (req, res, next) => {

  if (req.user.role !== "delivery") {
    return res.status(403).json({
      message: "Delivery partner access required"
    });
  }

  next();
};

export { adminOnly ,verifyToken, isDelivery};

