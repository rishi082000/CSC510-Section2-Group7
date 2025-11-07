// src/services/__tests__/AuthService.test.jsx
import AuthService from '../AuthService';

beforeEach(() => {
  // clear mocks and localStorage before each test
  jest.clearAllMocks();
  localStorage.clear();
  global.fetch = jest.fn();
});

describe('AuthService', () => {
  describe('login', () => {
    it('should login successfully and store userId', async () => {
      const mockResponse = { success: true, userId: '123' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await AuthService.login('test@example.com', 'password');
      expect(result).toEqual(mockResponse);
      expect(localStorage.getItem('userId')).toBe('123');
    });

    it('should return failure message on network error', async () => {
      fetch.mockRejectedValueOnce(new Error('Network failure'));
      const result = await AuthService.login('test@example.com', 'password');
      expect(result).toEqual({ success: false, message: 'Network error' });
    });

    it('should throw error if login fails with server message', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        text: async () => 'Invalid credentials',
      });
      const result = await AuthService.login('test@example.com', 'wrongpass');
      expect(result).toEqual({ success: false, message: 'Network error' });
    });
  });

  describe('fetchMenu', () => {
    it('should fetch menu successfully', async () => {
      localStorage.setItem('userId', '123');
      const menuData = [{ id: 1, name: 'Pizza' }];
      fetch.mockResolvedValueOnce({ ok: true, json: async () => menuData });

      const result = await AuthService.fetchMenu();
      expect(result).toEqual(menuData);
    });

    it('should return empty array if userId missing', async () => {
      const result = await AuthService.fetchMenu();
      expect(result).toEqual([]); // service returns [] on error
    });

    it('should return empty array on fetch failure', async () => {
      localStorage.setItem('userId', '123');
      fetch.mockResolvedValueOnce({ ok: false, status: 500 });

      const result = await AuthService.fetchMenu();
      expect(result).toEqual([]);
    });
  });

  describe('addMenuItem', () => {
    const item = { name: 'Burger', price: '10' };

    it('should add menu item successfully', async () => {
      localStorage.setItem('userId', '123');
      fetch.mockResolvedValueOnce({ ok: true, json: async () => item });

      const result = await AuthService.addMenuItem(item);
      expect(result).toEqual(item);
    });

    it('should throw error if userId missing', async () => {
      await expect(AuthService.addMenuItem(item)).rejects.toThrow('No userId found');
    });

    it('should throw error on failed fetch', async () => {
      localStorage.setItem('userId', '123');
      fetch.mockResolvedValueOnce({ ok: false, status: 500 });

      await expect(AuthService.addMenuItem(item)).rejects.toThrow('Failed to add menu item: 500');
    });
  });

  describe('updateMenuItem', () => {
    const item = { name: 'Burger', price: '10' };

    it('should update menu item successfully', async () => {
      fetch.mockResolvedValueOnce({ ok: true, json: async () => item });
      const result = await AuthService.updateMenuItem(1, item);
      expect(result).toEqual(item);
    });

    it('should throw error on failed update', async () => {
      fetch.mockResolvedValueOnce({ ok: false, status: 500 });
      await expect(AuthService.updateMenuItem(1, item)).rejects.toThrow('Failed to update menu item: 500');
    });
  });

  describe('deleteMenuItem', () => {
    it('should delete menu item successfully', async () => {
      fetch.mockResolvedValueOnce({ ok: true });
      await expect(AuthService.deleteMenuItem(1)).resolves.toBeUndefined();
    });

    it('should throw error on failed delete', async () => {
      fetch.mockResolvedValueOnce({ ok: false, status: 500 });
      await expect(AuthService.deleteMenuItem(1)).rejects.toThrow('Failed to delete menu item: 500');
    });
  });
});
