// ============================================================
// models/User.js — Defines what a User looks like in MongoDB
//
// A Mongoose "model" is like a blueprint for your data.
// Every user document stored in MongoDB will follow this shape.
// ============================================================

const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, "Name is required"],
      trim:     true,       // removes extra spaces automatically
    },
    email: {
      type:     String,
      required: [true, "Email is required"],
      unique:   true,       // no two users can share the same email
      lowercase: true,      // always saved as lowercase
      trim:     true,
    },
    password: {
      type:      String,
      required:  [true, "Password is required"],
      minlength: 6,
    },
    // "admin" users can add products; regular users just shop
    isAdmin: {
      type:    Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

// ── Hash the password before saving ────────────────────────
// This runs automatically every time a user is saved.
// We NEVER store plain-text passwords — always hashed.
userSchema.pre("save", async function (next) {
  // Only hash if the password was just changed (avoids double-hashing)
  if (!this.isModified("password")) return next();
  const salt    = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Custom method: check if an entered password is correct ──
// Used in the login route: const ok = await user.matchPassword("abc123")
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
