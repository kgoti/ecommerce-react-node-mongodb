// ============================================================
// models/Product.js — Defines what a Product looks like
//
// Each product has a name, description, price, image URL,
// category, and stock count.
// ============================================================

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, "Product name is required"],
      trim:     true,
    },
    description: {
      type:    String,
      default: "",
    },
    price: {
      type:     Number,
      required: [true, "Price is required"],
      min:      [0, "Price cannot be negative"],
    },
    // We use image URLs from the internet so we don't need file uploads
    // (file uploads would add a lot of complexity for a beginner project)
    image: {
      type:    String,
      default: "https://via.placeholder.com/300x200?text=No+Image",
    },
    category: {
      type:    String,
      default: "General",
      trim:    true,
    },
    // How many units are in stock
    countInStock: {
      type:    Number,
      default: 10,
      min:     0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
