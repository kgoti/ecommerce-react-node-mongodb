// ============================================================
// routes/auth.js — Register and Login
//
// POST /api/auth/register → create a new account
// POST /api/auth/login    → log in and receive a JWT token
//
// These two routes are PUBLIC — no token needed
// ============================================================

const express = require("express");
const jwt     = require("jsonwebtoken");
const User    = require("../models/User");

const router = express.Router();

// Helper: create a JWT token that expires in 7 days
const createToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ── POST /api/auth/register ─────────────────────────────────
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please fill in all fields." });
  }

  try {
    // Check if this email is already registered
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    // Create the user — password is hashed automatically by the pre-save hook
    const user  = await User.create({ name, email, password });
    const token = createToken(user._id);

    res.status(201).json({
      message: "Account created successfully!",
      token,
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// ── POST /api/auth/login ────────────────────────────────────
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please enter your email and password." });
  }

  try {
    const user = await User.findOne({ email });

    // We intentionally use the same error message whether the email
    // or password is wrong — this prevents guessing which one failed
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = createToken(user._id);

    res.json({
      message: "Logged in successfully!",
      token,
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;
