// ============================================================
// HomePage.js — The main product listing page
//
// Fetches all products from the backend and shows them in a grid.
// Has a search bar and category filter buttons.
// ============================================================

import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";

const CATEGORIES = ["All", "Electronics", "Accessories", "Clothing", "Home", "Stationery"];

function HomePage({ onViewProduct, onAddToCart }) {
  const [products,       setProducts]       = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState("");
  const [search,         setSearch]         = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Fetch all products when the page loads
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch("/api/products");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setProducts(data);
    } catch (err) {
      setError("Could not load products. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // Filter products in the browser based on search and category
  // (For a small app this is fine — no need to call the API every keystroke)
  const filtered = products.filter((p) => {
    const matchesSearch   = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="home-page">

      {/* Hero banner */}
      <div className="hero">
        <h1 className="hero-title">Welcome to ShopEasy</h1>
        <p className="hero-sub">Find everything you need — delivered to your door</p>
      </div>

      <div className="page-container">

        {/* Search bar */}
        <div className="search-wrapper">
          <input
            className="search-bar"
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category filter buttons */}
        <div className="category-bar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`cat-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        {!loading && !error && (
          <p className="results-info">
            Showing {filtered.length} product{filtered.length !== 1 ? "s" : ""}
            {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
            {search ? ` matching "${search}"` : ""}
          </p>
        )}

        {/* Loading / Error states */}
        {loading && <p className="status-text">Loading products...</p>}
        {error   && (
          <div className="error-box">
            <p>{error}</p>
            <button className="retry-btn" onClick={fetchProducts}>Retry</button>
          </div>
        )}

        {/* Product grid */}
        {!loading && !error && (
          <div className="products-grid">
            {filtered.length === 0 ? (
              <p className="no-results">No products found. Try a different search.</p>
            ) : (
              filtered.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onViewProduct={onViewProduct}
                  onAddToCart={onAddToCart}
                />
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default HomePage;
