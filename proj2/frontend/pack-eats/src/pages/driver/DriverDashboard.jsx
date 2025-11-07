import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/DriverDashboard.css";

export default function DriverDashboard() {
  const [driverData, setDriverData] = useState(null);
  const [earnings, setEarnings] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const storedData = localStorage.getItem("driverData");
    
    if (!storedData) {
      // Not logged in, redirect to login
      navigate("/driver/login");
      return;
    }

    try {
      const data = JSON.parse(storedData);
      setDriverData(data);
      
      // Fetch available orders
      fetchAvailableOrders();
    } catch (err) {
      console.error("Error parsing driver data:", err);
      navigate("/driver/login");
    }
  }, [navigate]);

  const fetchAvailableOrders = async () => {
    try {
      setLoading(true);
      // Fetch orders with status READY (ready for pickup by driver)
      const response = await axios.get("http://localhost:8080/api/driver/orders/available");
      
      if (response.data && Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      const storedData = localStorage.getItem("driverData");
      const driverData = JSON.parse(storedData);
      
      await axios.post(`http://localhost:8080/api/driver/orders/${orderId}/accept`, {
        driverId: driverData.id
      });
      
      // Refresh orders list
      fetchAvailableOrders();
      
      alert("Order accepted successfully!");
    } catch (err) {
      console.error("Error accepting order:", err);
      alert("Failed to accept order. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("driverData");
    navigate("/driver/login");
  };

  // Show loading while checking authentication
  if (!driverData) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-card">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            Pack<span className="accent">Eats</span> Driver Dashboard
          </h1>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

        <div className="welcome-section">
          <h2>Welcome, {driverData.fullName}!</h2>
          <p className="driver-email">{driverData.email}</p>
          {driverData.status && (
            <p className="driver-status">
              Status: <span className={`status-badge ${driverData.status}`}>
                {driverData.status}
              </span>
            </p>
          )}
        </div>

        <div className="earnings-section">
          <h2>Total Earnings</h2>
          {earnings !== null ? (
            <p className="earnings-amount">${earnings.toFixed(2)}</p>
          ) : (
            <p className="no-data">Earnings data not available yet.</p>
          )}
        </div>

        <div className="orders-section">
          <h2>Available Orders</h2>
          {loading ? (
            <p className="no-data">Loading orders...</p>
          ) : orders.length > 0 ? (
            <ul>
              {orders.map((order) => (
                <li key={order.id} className="order-item">
                  <div className="order-details">
                    <p><strong>Order ID:</strong> #{order.id}</p>
                    <p><strong>Restaurant:</strong> {order.restaurantName || "N/A"}</p>
                    <p><strong>Customer:</strong> {order.customerName || "N/A"}</p>
                    <p><strong>Delivery Address:</strong> {order.deliveryAddress || "N/A"}</p>
                    <p><strong>Items:</strong></p>
                    <ul className="order-items-list">
                      {order.items && order.items.map((item, idx) => (
                        <li key={idx}>{item.name} × {item.quantity}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="order-right">
                    <p className="amount">${order.totalAmount?.toFixed(2) || "0.00"}</p>
                    <button 
                      className="accept-btn"
                      onClick={() => handleAcceptOrder(order.id)}
                    >
                      Accept Order
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-data">No orders available right now.</p>
          )}
        </div>
      </div>
    </div>
  );
}