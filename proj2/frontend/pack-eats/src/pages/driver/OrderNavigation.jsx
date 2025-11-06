import React from "react";
import "../../styles//OrderNavigation.css";

export default function OrderNavigation() {
  return (
    <div className="order-page-container">
      <div className="order-card">
        <h1 className="order-title">
          Wolf<span className="accent">Cafe</span> Order Navigation
        </h1>

        <div className="map-container">
          <p className="placeholder">🗺️ Map will appear here</p>
        </div>

        <div className="status-section">
          <h2>Order Status</h2>
          <div className="status-box">
            <p>Status: <span className="status-placeholder">Pending...</span></p>
            <p>Pickup Location: <span className="status-placeholder">—</span></p>
            <p>Delivery Location: <span className="status-placeholder">—</span></p>
            <p>Estimated Time: <span className="status-placeholder">—</span></p>
          </div>
        </div>

        <div className="actions">
          <button className="btn btn-start">Start Navigation</button>
          <button className="btn btn-complete">Mark as Delivered</button>
        </div>
      </div>
    </div>
  );
}
