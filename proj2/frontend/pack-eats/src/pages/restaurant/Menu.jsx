import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Menu.css';

const AUTH_URL = 'http://localhost:8080/api/auth';
const MENU_URL = 'http://localhost:8080/api/menu';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', available: true });
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${AUTH_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      if (data.success && data.userId) {
        localStorage.setItem('userId', data.userId);
        setLoggedIn(true);
        fetchMenu();
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchMenu = async () => {
    try {
      const data = await getMenu();
      setMenuItems(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError(err.message || 'Failed to load menu');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addMenuItem({ ...form, price: parseFloat(form.price) });
      setForm({ name: '', description: '', price: '', category: '', available: true });
      fetchMenu();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMenuItem(id);
      fetchMenu();
    } catch {
      setError('Failed to delete menu item');
    }
  };

  const handleToggleAvailability = async (id, item) => {
    try {
      await updateMenuItem(id, { ...item, available: !item.available });
      fetchMenu();
    } catch {
      setError('Failed to update availability');
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setLoggedIn(true);
      fetchMenu();
    }
  }, []);

  if (!loggedIn) {
    return (
      <div className="menu-container">
        <h2>Login</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleLogin} className="menu-form">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="menu-container">
      {/* Navigation buttons */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button
          style={{ padding: '10px 20px', backgroundColor: '#1976D2', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          onClick={() => navigate('/orders')}
        >
          Go to Orders
        </button>
      </div>

      <h2>Menu</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} className="menu-form">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <label>
          Available
          <input name="available" type="checkbox" checked={form.available} onChange={handleChange} />
        </label>
        <button type="submit">Add</button>
      </form>

      <table className="menu-table">
        <thead>
          <tr>
            <th>Name</th><th>Description</th><th>Price</th><th>Category</th><th>Available</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{item.price}</td>
              <td>{item.category}</td>
              <td>{item.available ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
                <button onClick={() => handleToggleAvailability(item.id, item)}>Toggle</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- Helper functions ---
const getMenu = async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) throw new Error('No userId found');
  const res = await fetch(`${MENU_URL}?userId=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch menu');
  const text = await res.text();
  return text ? JSON.parse(text) : [];
};

const addMenuItem = async (item) => {
  const userId = localStorage.getItem('userId');
  const res = await fetch(`${MENU_URL}?userId=${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error('Failed to add item');
};

const updateMenuItem = async (id, item) => {
  const res = await fetch(`${MENU_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error('Failed to update item');
};

const deleteMenuItem = async (id) => {
  const res = await fetch(`${MENU_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete item');
};

export default Menu;
