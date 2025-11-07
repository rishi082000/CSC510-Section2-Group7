import MenuService from '../MenuService';

global.fetch = jest.fn();

describe('MenuService', () => {
  const localStorageGetItemMock = jest.spyOn(Storage.prototype, 'getItem');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- getMenu ---
  test('getMenu returns menu items when userId exists', async () => {
    localStorageGetItemMock.mockReturnValue('123');
    const menuItems = [{ id: 1, name: 'Pizza' }];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => menuItems,
    });

    const result = await MenuService.getMenu();
    expect(result).toEqual(menuItems);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/menu?userId=123'));
  });

  test('getMenu throws error if no userId', async () => {
    localStorageGetItemMock.mockReturnValue(null);
    await expect(MenuService.getMenu()).rejects.toThrow('No userId found');
  });

  test('getMenu throws error if fetch fails', async () => {
    localStorageGetItemMock.mockReturnValue('123');
    fetch.mockResolvedValueOnce({ ok: false });
    await expect(MenuService.getMenu()).rejects.toThrow('Failed to fetch menu');
  });

  // --- addMenuItem ---
  test('addMenuItem sends POST request', async () => {
    localStorageGetItemMock.mockReturnValue('123');
    const item = { name: 'Burger', price: '5.5' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...item, id: 1 }),
    });

    const result = await MenuService.addMenuItem(item);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/menu?userId=123'), expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...item, price: 5.5 }),
    }));
    expect(result).toEqual({ ...item, id: 1 });
  });

  test('addMenuItem throws error if no userId', async () => {
    localStorageGetItemMock.mockReturnValue(null);
    await expect(MenuService.addMenuItem({})).rejects.toThrow('No userId found');
  });

  test('addMenuItem throws error if fetch fails', async () => {
    localStorageGetItemMock.mockReturnValue('123');
    fetch.mockResolvedValueOnce({ ok: false });
    await expect(MenuService.addMenuItem({})).rejects.toThrow('Failed to add menu item');
  });

  // --- updateMenuItem ---
  test('updateMenuItem sends PUT request', async () => {
    const item = { name: 'Pizza', price: '10' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...item, id: 1 }),
    });

    const result = await MenuService.updateMenuItem(1, item);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/menu/1'), expect.objectContaining({
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...item, price: 10 }),
    }));
    expect(result).toEqual({ ...item, id: 1 });
  });

  test('updateMenuItem throws error if fetch fails', async () => {
    fetch.mockResolvedValueOnce({ ok: false });
    await expect(MenuService.updateMenuItem(1, {})).rejects.toThrow('Failed to update menu item');
  });

  // --- deleteMenuItem ---
  test('deleteMenuItem sends DELETE request', async () => {
    fetch.mockResolvedValueOnce({ ok: true });
    await expect(MenuService.deleteMenuItem(1)).resolves.toBeUndefined();
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/menu/1'), { method: 'DELETE' });
  });

  test('deleteMenuItem throws error if fetch fails', async () => {
    fetch.mockResolvedValueOnce({ ok: false });
    await expect(MenuService.deleteMenuItem(1)).rejects.toThrow('Failed to delete menu item');
  });
});
