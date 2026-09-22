import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req, res, next) => {
  try {
    // Get Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header is required",
      });
    }

    // Check Bearer token
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Invalid authorization format",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token is required",
      });
    }

    
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Store user information in request
    req.user = decoded;

    // Continue to next middleware/controller
    next();

  } catch (error) {
    console.error("Authentication error:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};


const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    next();
  };
};


export {authMiddleware, allowRoles};














// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";

// dotenv.config();





// const protect = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     // Check Authorization header
//     if (
//       !authHeader ||
//       !authHeader.startsWith("Bearer ")
//     ) {
//       return res.status(401).json({
//         message: "Authorization token is required",
//       });
//     }

//     // Get token
//     const token = authHeader.split(" ")[1];

//     // Verify JWT
//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET
//     );

//     // Store decoded user information
//     req.user = decoded;

//     next();

//   } catch (error) {
//     console.error(error);

//     return res.status(401).json({
//       message: "Invalid or expired token",
//     });
//   }
// };


// export { protect };
