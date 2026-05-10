// ============================================================
// OrdersPage.js — Shows the logged-in user's past orders
//
// Fetches orders from GET /api/orders/mine using the JWT token.
// Each order shows the items, total price, date, and status.
// ============================================================

import React, { useState, useEffect } from "react";

// Format "2025-04-29T10:30:00.000Z" → "29 Apr 2025"
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });

function OrdersPage({ token }) {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res  = await fetch("/api/orders/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setOrders(data);
    } catch (err) {
      setError("Could not load your orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="page-container"><p className="status-text">Loading your orders...</p></div>;
  if (error)   return <div className="page-container"><p className="error-text">⚠️ {error}</p></div>;

  if (orders.length === 0) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <span className="empty-icon">📦</span>
          <h2>No orders yet</h2>
          <p>Place your first order from the shop!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">My Orders</h1>

      <div className="orders-list">
        {orders.map((order) => (
          <div className="order-card" key={order._id}>

            {/* Order header */}
            <div className="order-header">
              <div>
                <p className="order-id">Order #{order._id.slice(-8).toUpperCase()}</p>
                <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
              </div>
              <div className="order-badges">
                <span className={`badge ${order.isPaid ? "badge-green" : "badge-gray"}`}>
                  {order.isPaid ? "Paid" : "Unpaid"}
                </span>
                <span className={`badge ${order.isDelivered ? "badge-green" : "badge-yellow"}`}>
                  {order.isDelivered ? "Delivered" : "Processing"}
                </span>
              </div>
            </div>

            {/* Items in this order */}
            <div className="order-items">
              {order.items.map((item, i) => (
                <div className="order-item-row" key={i}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="order-item-img"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/50x50"; }}
                  />
                  <span className="order-item-name">{item.name}</span>
                  <span className="order-item-qty">× {item.qty}</span>
                  <span className="order-item-price">€{(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Order footer: shipping address + total */}
            <div className="order-footer">
              <p className="order-address">
                📍 {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.zip}, {order.shippingAddress.country}
              </p>
              <p className="order-total">Total: <strong>€{order.totalPrice.toFixed(2)}</strong></p>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default OrdersPage;
