const BASE_URL = 'http://localhost:8080/api/auth';
const MENU_URL = 'http://localhost:8080/api/menu';
const ORDERS_URL = 'http://localhost:8080/api/orders';

const login = async (email, password) => {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Login failed: ${errText}`);
    }
    const data = await res.json();
    if (data.success && data.userId) localStorage.setItem('userId', data.userId);
    return data;
  } catch (err) {
    console.error('Network or server error during login:', err);
    return { success: false, message: 'Network error' };
  }
};

const fetchMenu = async () => {
  try {
    const userId = localStorage.getItem('userId');
    if (!userId) throw new Error('No userId found');
    const res = await fetch(`${MENU_URL}?userId=${userId}`);
    if (!res.ok) throw new Error(`Failed to fetch menu: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};

const addMenuItem = async (item) => {
  try {
    const userId = localStorage.getItem('userId');
    if (!userId) throw new Error('No userId found');
    const res = await fetch(`${MENU_URL}?userId=${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...item, price: parseFloat(item.price) }),
    });
    if (!res.ok) throw new Error(`Failed to add menu item: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const updateMenuItem = async (id, item) => {
  try {
    const res = await fetch(`${MENU_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...item, price: parseFloat(item.price) }),
    });
    if (!res.ok) throw new Error(`Failed to update menu item: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const deleteMenuItem = async (id) => {
  try {
    const res = await fetch(`${MENU_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Failed to delete menu item: ${res.status}`);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const fetchOrders = async () => {
  try {
    const userId = localStorage.getItem('userId');
    if (!userId) throw new Error('No userId found');
    const res = await fetch(`${ORDERS_URL}?userId=${userId}`);
    if (!res.ok) throw new Error(`Failed to fetch orders: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};

const updateOrderStatus = async (id, status) => {
  try {
    const res = await fetch(`${ORDERS_URL}/${id}?status=${status}`, { method: 'PUT' });
    if (!res.ok) throw new Error(`Failed to update order status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default {
  login,
  fetchMenu,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  fetchOrders,
  updateOrderStatus,
};
