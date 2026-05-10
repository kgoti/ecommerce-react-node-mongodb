// ============================================================
// server.js — Main entry point for the E-Commerce backend
//
// What this file does (in order):
//   1. Loads secret variables from the .env file
//   2. Creates the Express app
//   3. Adds middleware (cors, json parsing)
//   4. Connects all route files
//   5. Connects to MongoDB
//   6. Starts listening for requests
// ============================================================

const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");
require("dotenv").config(); // reads .env file into process.env

// Import route files
const authRoutes    = require("./routes/auth");
const productRoutes = require("./routes/products");
const orderRoutes   = require("./routes/orders");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────
// cors()         → allows the React frontend (port 3000) to
//                  call this backend (port 5000) without errors
// express.json() → lets us read req.body as a JavaScript object
app.use(cors());
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────
// Each route file handles a group of related endpoints
app.use("/api/auth",     authRoutes);    // register, login
app.use("/api/products", productRoutes); // get all products, get one product
app.use("/api/orders",   orderRoutes);   // place order, get my orders

// ── Health check ────────────────────────────────────────────
// Visit http://localhost:5000 to confirm the server is running
app.get("/", (req, res) => {
  res.json({ message: "E-Commerce API is running!" });
});

// ── Connect to MongoDB, then start the server ───────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
