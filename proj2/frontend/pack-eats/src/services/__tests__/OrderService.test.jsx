import OrderService from '../OrderService';

global.fetch = jest.fn();

describe('OrderService', () => {
  const localStorageGetItemMock = jest.spyOn(Storage.prototype, 'getItem');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- fetchOrders ---
  test('fetchOrders returns array of orders when userId exists', async () => {
    localStorageGetItemMock.mockReturnValue('123');
    const orders = [{ id: 1, items: [{ name: 'Pizza', quantity: 2 }], status: 'PLACED' }];
    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify(orders),
    });

    const result = await OrderService.fetchOrders();
    expect(result).toEqual(orders);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/orders?userId=123'));
  });

  test('fetchOrders wraps single object as array', async () => {
    localStorageGetItemMock.mockReturnValue('123');
    const order = { id: 1, items: [], status: 'PLACED' };
    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify(order),
    });

    const result = await OrderService.fetchOrders();
    expect(result).toEqual([order]);
  });

  test('fetchOrders returns empty array if parsing fails', async () => {
    localStorageGetItemMock.mockReturnValue('123');
    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => '{invalid json}',
    });

    const result = await OrderService.fetchOrders();
    expect(result).toEqual([]);
  });

  test('fetchOrders throws error if no userId', async () => {
    localStorageGetItemMock.mockReturnValue(null);
    await expect(OrderService.fetchOrders()).rejects.toThrow('No userId found');
  });

  test('fetchOrders throws error if fetch fails', async () => {
    localStorageGetItemMock.mockReturnValue('123');
    fetch.mockResolvedValueOnce({ ok: false });
    await expect(OrderService.fetchOrders()).rejects.toThrow('Failed to fetch orders');
  });

  // --- updateOrderStatus ---
  test('updateOrderStatus sends PUT request and returns updated order', async () => {
    const updatedOrder = { id: 1, status: 'PREPARING' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => updatedOrder,
    });

    const result = await OrderService.updateOrderStatus(1, 'PREPARING');
    expect(result).toEqual(updatedOrder);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/orders/1/status'), expect.objectContaining({
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'PREPARING' }),
    }));
  });

  test('updateOrderStatus throws error if fetch fails', async () => {
    fetch.mockResolvedValueOnce({ ok: false });
    await expect(OrderService.updateOrderStatus(1, 'READY')).rejects.toThrow('Failed to update order status');
  });

  // --- deleteOrder ---
  test('deleteOrder sends DELETE request', async () => {
    fetch.mockResolvedValueOnce({ ok: true });
    await expect(OrderService.deleteOrder(1)).resolves.toBeUndefined();
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/orders/1'), { method: 'DELETE' });
  });

  test('deleteOrder throws error if fetch fails', async () => {
    fetch.mockResolvedValueOnce({ ok: false });
    await expect(OrderService.deleteOrder(1)).rejects.toThrow('Failed to delete order');
  });
});
