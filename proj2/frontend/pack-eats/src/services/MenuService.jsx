const BASE_URL = 'http://localhost:8080/api/menu';

const getMenu = async () => {
  const userId = localStorage.getItem('userId');

  console.log("getMenu userId:", userId);
  if (!userId) throw new Error('No userId found');

  const res = await fetch(`${BASE_URL}?userId=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch menu');
  return await res.json();
};

const addMenuItem = async (item) => {
  const userId = localStorage.getItem('userId');
  if (!userId) throw new Error('No userId found');

  const res = await fetch(`${BASE_URL}?userId=${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...item, price: parseFloat(item.price) }),
  });

  if (!res.ok) throw new Error('Failed to add menu item');
  return await res.json();
};

const updateMenuItem = async (id, item) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...item, price: parseFloat(item.price) }),
  });

  if (!res.ok) throw new Error('Failed to update menu item');
  return await res.json();
};

const deleteMenuItem = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete menu item');
};

export default { getMenu, addMenuItem, updateMenuItem, deleteMenuItem };
