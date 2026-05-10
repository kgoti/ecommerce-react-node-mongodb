// ============================================================
// Navbar.js — Top navigation bar
//
// Shows: logo, navigation links, cart icon with item count,
//        user name or login button
// ============================================================

import React from "react";

function Navbar({ user, cartCount, page, onNavigate, onLogout }) {
  return (
    <nav className="navbar">
      <div className="nav-inner">

        {/* Logo */}
        <button className="nav-logo" onClick={() => onNavigate("home")}>
          🛒 ShopEasy
        </button>

        {/* Right side links */}
        <div className="nav-links">

          {/* Shop link */}
          <button
            className={`nav-link ${page === "home" ? "active" : ""}`}
            onClick={() => onNavigate("home")}
          >
            Shop
          </button>

          {/* Cart with badge */}
          <button
            className={`nav-link cart-link ${page === "cart" ? "active" : ""}`}
            onClick={() => onNavigate("cart")}
          >
            🛍 Cart
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </button>

          {/* If logged in: show My Orders + name + logout */}
          {user ? (
            <>
              <button
                className={`nav-link ${page === "orders" ? "active" : ""}`}
                onClick={() => onNavigate("orders")}
              >
                My Orders
              </button>
              <span className="nav-username">Hi, {user.name.split(" ")[0]}</span>
              <button className="nav-logout" onClick={onLogout}>
                Log Out
              </button>
            </>
          ) : (
            // If logged out: show Login button
            <button
              className={`nav-link ${page === "auth" ? "active" : ""}`}
              onClick={() => onNavigate("auth")}
            >
              Login
            </button>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
