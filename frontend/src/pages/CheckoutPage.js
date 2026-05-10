// ============================================================
// CheckoutPage.js — Shipping address form + Place Order
//
// The user fills in their address, then clicks "Place Order".
// We send the cart items and address to the backend.
// No real payment is processed — this is a demo app.
// ============================================================

import React, { useState } from "react";

function CheckoutPage({ cart, token, user, onOrderPlaced, onBack }) {
  // Shipping address form fields
  const [address,  setAddress]  = useState("");
  const [city,     setCity]     = useState("");
  const [zip,      setZip]      = useState("");
  const [country,  setCountry]  = useState("Germany");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  // Calculate total
  const total = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (!address || !city || !zip || !country) {
      setError("Please fill in all address fields.");
      return;
    }

    setLoading(true);

    try {
      // Build the order body to send to the backend
      // We format cart items into the shape the Order model expects
      const orderBody = {
        items: cart.map((item) => ({
          product: item.product._id,
          name:    item.product.name,
          qty:     item.qty,
          price:   item.product.price,
          image:   item.product.image,
        })),
        shippingAddress: { address, city, zip, country },
        totalPrice: parseFloat(total.toFixed(2)),
      };

      const res  = await fetch("/api/orders", {
        method:  "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${token}`, // send the JWT token
        },
        body: JSON.stringify(orderBody),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Success — clear the cart and go to orders page
      onOrderPlaced();

    } catch (err) {
      setError(err.message || "Could not place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <button className="back-btn" onClick={onBack}>← Back to Cart</button>
      <h1 className="page-title">Checkout</h1>

      <div className="checkout-layout">

        {/* Shipping address form */}
        <div className="checkout-form-wrapper">
          <h2 className="section-title">Shipping Address</h2>

          <form className="checkout-form" onSubmit={handlePlaceOrder}>

            <div className="form-group">
              <label className="form-label">Street Address</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Hauptstrasse 12"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. Magdeburg"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Postcode</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. 39104"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Country</label>
              <input
                className="form-input"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>

            {error && <p className="form-error">⚠️ {error}</p>}

            <div className="demo-notice">
              💳 <strong>Demo app:</strong> No real payment is processed. Click "Place Order" to simulate a completed purchase.
            </div>

            <button
              className="place-order-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Placing Order..." : `Place Order — €${total.toFixed(2)}`}
            </button>

          </form>
        </div>

        {/* Order summary on the right */}
        <div className="checkout-summary">
          <h2 className="section-title">Your Items</h2>
          {cart.map((item) => (
            <div className="checkout-item" key={item.product._id}>
              <img
                src={item.product.image}
                alt={item.product.name}
                className="checkout-item-img"
                onError={(e) => { e.target.src = "https://via.placeholder.com/50x50"; }}
              />
              <div className="checkout-item-info">
                <p className="checkout-item-name">{item.product.name}</p>
                <p className="checkout-item-qty">Qty: {item.qty}</p>
              </div>
              <p className="checkout-item-price">
                €{(item.product.price * item.qty).toFixed(2)}
              </p>
            </div>
          ))}
          <div className="checkout-total">
            <span>Total</span>
            <span>€{total.toFixed(2)}</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CheckoutPage;
