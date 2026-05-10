// ============================================================
// routes/orders.js — Order routes (all protected)
//
// POST /api/orders          → place a new order
// GET  /api/orders/mine     → get the logged-in user's orders
//
// Both routes require the user to be logged in (protect middleware)
// ============================================================

const express = require("express");
const Order   = require("../models/Order");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ── POST /api/orders ────────────────────────────────────────
// Creates a new order from the user's cart
// The frontend sends: { items, shippingAddress, totalPrice }
router.post("/", protect, async (req, res) => {
  const { items, shippingAddress, totalPrice } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Your cart is empty." });
  }

  try {
    const order = await Order.create({
      user:            req.user._id,  // req.user is set by the protect middleware
      items,
      shippingAddress,
      totalPrice,
      isPaid:          true,          // we simulate payment (no real payment gateway)
    });

    res.status(201).json({ message: "Order placed successfully!", order });
  } catch (err) {
    res.status(500).json({ message: "Could not place order. Please try again." });
  }
});

// ── GET /api/orders/mine ────────────────────────────────────
// Returns only the orders that belong to the logged-in user
// Sorted newest first
router.get("/mine", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch orders." });
  }
});

module.exports = router;
