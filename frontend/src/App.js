// ============================================================
// App.js — Root component
//
// Instead of using React Router (which adds complexity), we use
// a simple "page" state variable to decide which screen to show.
// This is a perfectly valid approach for a beginner project.
//
// Pages:
//   "home"     → product listing
//   "detail"   → single product detail
//   "cart"     → shopping cart
//   "checkout" → shipping form
//   "orders"   → my past orders
//   "auth"     → login / register
// ============================================================

import React, { useState, useEffect } from "react";
import Navbar       from "./components/Navbar";
import HomePage     from "./pages/HomePage";
import DetailPage   from "./pages/DetailPage";
import CartPage     from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage   from "./pages/OrdersPage";
import AuthPage     from "./pages/AuthPage";
import "./App.css";

function App() {
  // ── Auth state ─────────────────────────────────────────────
  // Load saved user and token from localStorage (survives refresh)
  const [user,  setUser]  = useState(JSON.parse(localStorage.getItem("ecUser"))  || null);
  const [token, setToken] = useState(localStorage.getItem("ecToken") || null);

  // ── Page / navigation state ────────────────────────────────
  const [page,          setPage]          = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null); // for detail page

  // ── Cart state ─────────────────────────────────────────────
  // Cart is an array of objects: { product, qty }
  // Saved in localStorage so it survives page refresh
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("ecCart")) || []
  );

  // Keep localStorage in sync whenever cart changes
  useEffect(() => {
    localStorage.setItem("ecCart", JSON.stringify(cart));
  }, [cart]);

  // ── Auth handlers ──────────────────────────────────────────
  const handleLogin = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("ecUser",  JSON.stringify(userData));
    localStorage.setItem("ecToken", jwtToken);
    setPage("home"); // go to shop after login
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("ecUser");
    localStorage.removeItem("ecToken");
    setPage("home");
  };

  // ── Cart handlers ──────────────────────────────────────────
  const addToCart = (product) => {
    setCart((prev) => {
      // If this product is already in the cart, increase qty by 1
      const existing = prev.find((item) => item.product._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item.product._id === product._id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      // Otherwise add it as a new cart item with qty = 1
      return [...prev, { product, qty: 1 }];
    });
  };

  const updateQty = (productId, newQty) => {
    if (newQty < 1) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product._id === productId ? { ...item, qty: newQty } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product._id !== productId));
  };

  const clearCart = () => setCart([]);

  // Total number of items in the cart (used for the navbar badge)
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  // ── Navigation helper ──────────────────────────────────────
  const goTo = (pageName, product = null) => {
    setSelectedProduct(product);
    setPage(pageName);
    window.scrollTo(0, 0); // scroll to top on page change
  };

  // ── Render the correct page ────────────────────────────────
  const renderPage = () => {
    switch (page) {
      case "home":
        return <HomePage onViewProduct={(p) => goTo("detail", p)} onAddToCart={addToCart} />;
      case "detail":
        return <DetailPage product={selectedProduct} onAddToCart={addToCart} onBack={() => goTo("home")} />;
      case "cart":
        return <CartPage cart={cart} onUpdateQty={updateQty} onRemove={removeFromCart} onCheckout={() => {
          if (!user) { goTo("auth"); } else { goTo("checkout"); }
        }} />;
      case "checkout":
        return <CheckoutPage cart={cart} token={token} user={user} onOrderPlaced={() => { clearCart(); goTo("orders"); }} onBack={() => goTo("cart")} />;
      case "orders":
        return <OrdersPage token={token} />;
      case "auth":
        return <AuthPage onLogin={handleLogin} />;
      default:
        return <HomePage onViewProduct={(p) => goTo("detail", p)} onAddToCart={addToCart} />;
    }
  };

  return (
    <div className="app">
      <Navbar
        user={user}
        cartCount={cartCount}
        page={page}
        onNavigate={goTo}
        onLogout={handleLogout}
      />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
