import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderService from '../../services/OrderService';
import '../../styles/Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadOrders = async () => {
    try {
      const data = await OrderService.fetchOrders();
      setOrders(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) loadOrders();
    else setError('No userId found in localStorage');
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      await OrderService.updateOrderStatus(orderId, status);
      loadOrders();
    } catch (err) {
      setError(err.message || 'Failed to update order status');
    }
  };

  return (
    <div className="orders-container">
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button
          style={{ padding: '10px 20px', backgroundColor: '#1976D2', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          onClick={() => navigate('/menu')}
        >
          Go to Menu
        </button>
      </div>

      <h2>Orders</h2>
      {error && <div className="error">{error}</div>}
      <ul className="orders-list">
        {orders.map(order => (
          <li key={order.id} className="order-item">
            <div className="order-items">
              {order.items?.map((item, idx) => (
                <div key={idx}>{item.name} — Qty: {item.quantity}</div>
              ))}
            </div>
            <div className="order-status">
              Status:
              <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)}>
                <option value="PLACED">Placed</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="PREPARING">Preparing</option>
                <option value="READY">Ready</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;
