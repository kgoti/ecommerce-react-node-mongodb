// ============================================================
// ProductCard.js — A single product card shown in the grid
//
// Shows: image, name, category, price, Add to Cart button
// ============================================================

import React, { useState } from "react";

function ProductCard({ product, onViewProduct, onAddToCart }) {
  // Show a brief "Added!" message when the button is clicked
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="product-card">
      {/* Product image — clicking opens the detail page */}
      <div className="card-img-wrapper" onClick={() => onViewProduct(product)}>
        <img
          src={product.image}
          alt={product.name}
          className="card-img"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
          }}
        />
      </div>

      <div className="card-body">
        {/* Category badge */}
        <span className="card-category">{product.category}</span>

        {/* Product name */}
        <h3
          className="card-name"
          onClick={() => onViewProduct(product)}
        >
          {product.name}
        </h3>

        {/* Price and Add to Cart */}
        <div className="card-footer">
          <span className="card-price">€{product.price.toFixed(2)}</span>
          <button
            className={`add-btn ${added ? "added" : ""}`}
            onClick={handleAdd}
            disabled={product.countInStock === 0}
          >
            {product.countInStock === 0 ? "Out of Stock" : added ? "Added!" : "+ Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
