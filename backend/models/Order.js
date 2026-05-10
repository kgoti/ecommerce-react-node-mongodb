// ============================================================
// models/Order.js — Defines what an Order looks like
//
// An order belongs to one user and contains one or more items.
// Each item references a product and stores how many were ordered.
// ============================================================

const mongoose = require("mongoose");

// A single item inside an order
// e.g. { product: <id>, name: "Laptop", qty: 2, price: 999 }
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  "Product",   // links to the Product model
    required: true,
  },
  name:  { type: String,  required: true },
  qty:   { type: Number,  required: true, min: 1 },
  price: { type: Number,  required: true },
  image: { type: String,  default: "" },
});

const orderSchema = new mongoose.Schema(
  {
    // Which user placed this order
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },
    // Array of items in this order
    items: [orderItemSchema],

    // Delivery address
    shippingAddress: {
      address: String,
      city:    String,
      zip:     String,
      country: String,
    },

    // Total cost of the order
    totalPrice: {
      type:     Number,
      required: true,
      default:  0,
    },

    // Has the order been paid?
    isPaid: {
      type:    Boolean,
      default: false,
    },

    // Has the order been delivered?
    isDelivered: {
      type:    Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt = when order was placed
  }
);

module.exports = mongoose.model("Order", orderSchema);
