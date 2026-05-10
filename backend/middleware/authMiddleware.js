// ============================================================
// middleware/authMiddleware.js — Protect private routes
//
// "Middleware" is a function that runs BETWEEN a request arriving
// and the route handler running. Think of it as a security guard.
//
// This middleware:
//   1. Reads the JWT token from the Authorization header
//   2. Checks it is valid
//   3. Attaches the user's ID to req.user so the route can use it
//   4. If the token is missing or wrong → sends a 401 error
//
// How to use on any route:
//   router.get("/my-orders", protect, getMyOrders)
//                             ^^^^^^^ add this
// ============================================================

const jwt  = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // The frontend sends the token in the Authorization header like:
  // "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      // Remove "Bearer " from the start to get just the token string
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using our JWT_SECRET from .env
      // If valid, decoded = { userId: "abc123", iat: ..., exp: ... }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the user from MongoDB (without their password field)
      // We attach the user object to req so route handlers can use it
      req.user = await User.findById(decoded.userId).select("-password");

      next(); // everything OK — proceed to the route handler

    } catch (err) {
      return res.status(401).json({ message: "Token is invalid or has expired. Please log in again." });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided. Please log in." });
  }
};

module.exports = protect;
