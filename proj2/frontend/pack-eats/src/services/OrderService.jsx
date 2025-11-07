const BASE_URL = 'http://localhost:8080/api/orders';

const fetchOrders = async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) throw new Error('No userId found');

  const res = await fetch(`${BASE_URL}?userId=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch orders');

  try {
    const text = await res.text();
    const data = text ? JSON.parse(text) : [];
    return Array.isArray(data) ? data : [data]; // always array
  } catch (err) {
    console.error('Failed to parse orders JSON', err);
    return [];
  }
};

const updateOrderStatus = async (orderId, status) => {
  const res = await fetch(`${BASE_URL}/${orderId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update order status');
  return await res.json();
};

const deleteOrder = async (orderId) => {
  const res = await fetch(`${BASE_URL}/${orderId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete order');
};

export default { fetchOrders, updateOrderStatus, deleteOrder };
