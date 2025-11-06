import React, { useState, useEffect } from "react";
import "../../styles/DriverDashboard.css";

export default function DriverDashboard() {
  const [earnings, setEarnings] = useState(null);
  const [orders, setOrders] = useState([]);

  // 🔹 Later, you’ll fetch from backend using axios:
  // useEffect(() => {
  //   axios.get("http://localhost:8080/api/driver/dashboard")
  //     .then(res => {
  //       setEarnings(res.data.earnings);
  //       setOrders(res.data.orders);
  //     })
  //     .catch(err => console.error("Error fetching dashboard data:", err));
  // }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1 className="dashboard-title">
          Pack<span className="accent">Eats</span> Driver Dashboard
        </h1>

        <div className="earnings-section">
          <h2>Total Earnings</h2>
          {earnings !== null ? (
            <p className="earnings-amount">${earnings}</p>
          ) : (
            <p className="no-data">Earnings data not available yet.</p>
          )}
        </div>

        <div className="orders-section">
          <h2>Available Orders</h2>
          {orders.length > 0 ? (
            <ul>
              {orders.map((order) => (
                <li key={order.id} className="order-item">
                  <div>
                    <p><strong>Customer:</strong> {order.customer}</p>
                    <p><strong>Address:</strong> {order.address}</p>
                  </div>
                  <div className="order-right">
                    <p className="amount">{order.amount}</p>
                    <button className="accept-btn">Accept</button>
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
