import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>Welcome!</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '50px' }}>
        <button
          style={{
            padding: '20px 40px',
            backgroundColor: '#FF6B35',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '18px',
          }}
          onClick={() => navigate('/menu')}
        >
          Menu Items
        </button>
        <button
          style={{
            padding: '20px 40px',
            backgroundColor: '#66BB6A',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '18px',
          }}
          onClick={() => navigate('/orders')}
        >
          Orders
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
