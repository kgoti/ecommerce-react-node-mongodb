// ============================================================
// routes/products.js — Product routes
//
// GET  /api/products         → get all products (public)
// GET  /api/products/:id     → get one product by ID (public)
// POST /api/products/seed    → add sample products to the DB
//                              (only used once to set up demo data)
// ============================================================

const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// ── GET /api/products ───────────────────────────────────────
// Returns all products, optionally filtered by category
// Example: GET /api/products?category=Electronics
router.get("/", async (req, res) => {
  try {
    const filter = {};

    // If ?category=Electronics is in the URL, filter by it
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // If ?search=laptop is in the URL, do a case-insensitive search on name
    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: "i" };
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch products." });
  }
});

// ── GET /api/products/:id ───────────────────────────────────
// Returns a single product by its MongoDB ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch product." });
  }
});

// ── POST /api/products/seed ─────────────────────────────────
// Adds 12 sample products to the database so the shop has something to show.
// Visit POST http://localhost:5000/api/products/seed once after setup.
router.post("/seed", async (req, res) => {
  try {
    // Clear existing products first so we don't get duplicates
    await Product.deleteMany({});

    const sampleProducts = [
      {
        name: "Wireless Headphones",
        description: "Over-ear Bluetooth headphones with 30-hour battery life and active noise cancellation. Perfect for commuting or working from home.",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
        category: "Electronics",
        countInStock: 15,
      },
      {
        name: "Mechanical Keyboard",
        description: "Compact 75% mechanical keyboard with RGB backlight and tactile switches. Great for coding and gaming.",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop",
        category: "Electronics",
        countInStock: 8,
      },
      {
        name: "USB-C Hub",
        description: "7-in-1 USB-C hub with HDMI, USB 3.0 ports, SD card reader, and 100W power delivery. Works with all laptops.",
        price: 34.99,
        image: "https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=400&h=300&fit=crop",
        category: "Electronics",
        countInStock: 20,
      },
      {
        name: "Laptop Stand",
        description: "Adjustable aluminium laptop stand with 6 height settings. Improves posture and keeps your laptop cool.",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop",
        category: "Accessories",
        countInStock: 12,
      },
      {
        name: "Running Shoes",
        description: "Lightweight running shoes with memory foam insole and breathable mesh upper. Available in sizes 38-46.",
        price: 64.99,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
        category: "Clothing",
        countInStock: 25,
      },
      {
        name: "Backpack",
        description: "Water-resistant 30L backpack with padded laptop compartment (fits up to 15 inch). Ideal for work or travel.",
        price: 49.99,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
        category: "Accessories",
        countInStock: 18,
      },
      {
        name: "Desk Lamp",
        description: "LED desk lamp with 3 brightness levels, USB charging port, and flexible gooseneck arm. Eye-care certified.",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
        category: "Home",
        countInStock: 30,
      },
      {
        name: "Notebook Set",
        description: "Set of 3 A5 dotted notebooks with 120gsm paper. Great for bullet journaling, sketching, or taking notes.",
        price: 14.99,
        image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=300&fit=crop",
        category: "Stationery",
        countInStock: 50,
      },
      {
        name: "Plant Pot Set",
        description: "Set of 4 ceramic plant pots in different sizes with drainage holes. Comes with matching saucers.",
        price: 19.99,
        image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=300&fit=crop",
        category: "Home",
        countInStock: 22,
      },
      {
        name: "Water Bottle",
        description: "1L insulated stainless steel water bottle. Keeps drinks cold for 24 hours or hot for 12 hours. BPA free.",
        price: 22.99,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop",
        category: "Accessories",
        countInStock: 35,
      },
      {
        name: "Desk Organiser",
        description: "Bamboo desk organiser with 5 compartments for pens, notebooks, and cables. Keeps your workspace tidy.",
        price: 17.99,
        image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=400&h=300&fit=crop",
        category: "Stationery",
        countInStock: 40,
      },
      {
        name: "Wireless Mouse",
        description: "Silent wireless mouse with 1600 DPI sensor, 12-month battery life, and USB nano receiver. Plug and play.",
        price: 19.99,
        image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=300&fit=crop",
        category: "Electronics",
        countInStock: 28,
      },
    ];

    await Product.insertMany(sampleProducts);
    res.json({ message: `${sampleProducts.length} products added successfully!` });
  } catch (err) {
    res.status(500).json({ message: "Could not seed products." });
  }
});

module.exports = router;
