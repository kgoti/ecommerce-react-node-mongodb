// ============================================================
// CartPage.js — Shopping cart
//
// Shows all items in the cart with quantity controls.
// Calculates total price. Has a Proceed to Checkout button.
// ============================================================

import React from "react";

function CartPage({ cart, onUpdateQty, onRemove, onCheckout }) {

  // Calculate total price by adding up (price × qty) for each item
  const total = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  // Empty cart state
  if (cart.length === 0) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <span className="empty-icon">🛍</span>
          <h2>Your cart is empty</h2>
          <p>Go back to the shop and add some products!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Your Cart</h1>

      <div className="cart-layout">

        {/* Cart items list */}
        <div className="cart-items">
          {cart.map((item) => (
            <div className="cart-item" key={item.product._id}>

              {/* Product image */}
              <img
                src={item.product.image}
                alt={item.product.name}
                className="cart-item-img"
                onError={(e) => { e.target.src = "https://via.placeholder.com/80x80?text=Img"; }}
              />

              {/* Product name and price */}
              <div className="cart-item-info">
                <p className="cart-item-name">{item.product.name}</p>
                <p className="cart-item-price">€{item.product.price.toFixed(2)} each</p>
              </div>

              {/* Quantity controls */}
              <div className="cart-qty-controls">
                <button className="qty-btn" onClick={() => onUpdateQty(item.product._id, item.qty - 1)}>–</button>
                <span className="qty-value">{item.qty}</span>
                <button className="qty-btn" onClick={() => onUpdateQty(item.product._id, item.qty + 1)}>+</button>
              </div>

              {/* Line total */}
              <p className="cart-item-total">
                €{(item.product.price * item.qty).toFixed(2)}
              </p>

              {/* Remove button */}
              <button
                className="cart-remove-btn"
                onClick={() => onRemove(item.product._id)}
                title="Remove from cart"
              >
                ✕
              </button>

            </div>
          ))}
        </div>

        {/* Order summary box */}
        <div className="cart-summary">
          <h2 className="summary-title">Order Summary</h2>

          {cart.map((item) => (
            <div className="summary-line" key={item.product._id}>
              <span>{item.product.name} × {item.qty}</span>
              <span>€{(item.product.price * item.qty).toFixed(2)}</span>
            </div>
          ))}

          <div className="summary-divider" />

          <div className="summary-total">
            <span>Total</span>
            <span>€{total.toFixed(2)}</span>
          </div>

          <button className="checkout-btn" onClick={onCheckout}>
            Proceed to Checkout →
          </button>

          <p className="summary-note">
            You will enter your shipping address on the next step.
          </p>
        </div>

      </div>
    </div>
  );
}

export default CartPage;
