// ============================================================
// DetailPage.js — Full product detail view
//
// Shows the full product image, description, price, stock,
// a quantity selector, and Add to Cart button.
// ============================================================

import React, { useState } from "react";

function DetailPage({ product, onAddToCart, onBack }) {
  const [qty,   setQty]   = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="page-container">
        <p>Product not found.</p>
        <button className="back-btn" onClick={onBack}>Back to Shop</button>
      </div>
    );
  }

  const handleAdd = () => {
    // Add the product multiple times based on qty chosen
    for (let i = 0; i < qty; i++) {
      onAddToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="page-container">

      {/* Back button */}
      <button className="back-btn" onClick={onBack}>
        ← Back to Shop
      </button>

      <div className="detail-layout">

        {/* Left: product image */}
        <div className="detail-img-wrapper">
          <img
            src={product.image}
            alt={product.name}
            className="detail-img"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
            }}
          />
        </div>

        {/* Right: product info */}
        <div className="detail-info">
          <span className="detail-category">{product.category}</span>
          <h1 className="detail-name">{product.name}</h1>
          <p className="detail-price">€{product.price.toFixed(2)}</p>
          <p className="detail-description">{product.description}</p>

          {/* Stock status */}
          <p className={`detail-stock ${product.countInStock === 0 ? "out" : "in"}`}>
            {product.countInStock > 0
              ? `In Stock (${product.countInStock} available)`
              : "Out of Stock"}
          </p>

          {/* Quantity selector + Add to Cart */}
          {product.countInStock > 0 && (
            <div className="detail-actions">
              <div className="qty-selector">
                <button
                  className="qty-btn"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  –
                </button>
                <span className="qty-value">{qty}</span>
                <button
                  className="qty-btn"
                  onClick={() => setQty((q) => Math.min(product.countInStock, q + 1))}
                >
                  +
                </button>
              </div>

              <button
                className={`add-to-cart-btn ${added ? "added" : ""}`}
                onClick={handleAdd}
              >
                {added ? "✓ Added to Cart!" : "Add to Cart"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetailPage;
