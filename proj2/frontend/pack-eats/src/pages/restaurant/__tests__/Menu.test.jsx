import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Menu from '../Menu';

beforeEach(() => {
  jest.restoreAllMocks();
  window.localStorage.clear();
  global.fetch = jest.fn();
});

describe('Menu Component', () => {
  // ----- LOGIN & MENU TESTS -----
  test('login success fetches menu', async () => {
    const setItemMock = jest.spyOn(window.localStorage.__proto__, 'setItem');
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValueOnce(null);

    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, userId: 'rest123' }) })
      .mockResolvedValueOnce({
        ok: true,
        text: async () =>
          JSON.stringify([{ id: 1, name: 'Pizza', description: 'Cheese', price: 10, category: 'Fast Food', available: true }]),
      });

    render(
      <MemoryRouter>
        <Menu />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'user@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'pass123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => expect(screen.getByText('Pizza')).toBeInTheDocument());
    expect(setItemMock).toHaveBeenCalledWith('userId', 'rest123');
  });

  test('handles login failure', async () => {
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValueOnce(null);

    global.fetch.mockResolvedValueOnce({ ok: false, text: async () => 'Invalid credentials' });

    render(
      <MemoryRouter>
        <Menu />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'bad@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => expect(screen.getByText(/Login failed/i)).toBeInTheDocument());
  });

  test('displays menu if user already logged in', async () => {
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue('rest123');

    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: async () =>
        JSON.stringify([{ id: 1, name: 'Burger', description: 'Beef', price: 8, category: 'Fast Food', available: true }]),
    });

    render(
      <MemoryRouter>
        <Menu />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('Burger')).toBeInTheDocument());
  });

  // ----- ADD MENU ITEM -----
  test('adds a new menu item', async () => {
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue('rest123');

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify([]), // initial menu fetch
      })
      .mockResolvedValueOnce({ ok: true }) // addMenuItem POST
      .mockResolvedValueOnce({
        ok: true,
        text: async () =>
          JSON.stringify([{ id: 2, name: 'Pasta', description: 'Tomato', price: 12, category: 'Italian', available: true }]),
      }); // fetchMenu after add

    render(
      <MemoryRouter>
        <Menu />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Pasta' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'Tomato' } });
    fireEvent.change(screen.getByPlaceholderText('Price'), { target: { value: '12' } });
    fireEvent.change(screen.getByPlaceholderText('Category'), { target: { value: 'Italian' } });
    fireEvent.click(screen.getByRole('button', { name: /Add/i }));

    await waitFor(() => expect(screen.getByText('Pasta')).toBeInTheDocument());
  });

  // ----- DELETE MENU ITEM -----
  test('deletes a menu item', async () => {
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue('rest123');

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        text: async () =>
          JSON.stringify([{ id: 3, name: 'Salad', description: 'Fresh', price: 5, category: 'Healthy', available: true }]),
      })
      .mockResolvedValueOnce({ ok: true }) // deleteMenuItem
      .mockResolvedValueOnce({ ok: true, text: async () => JSON.stringify([]) }); // fetchMenu after delete

    render(
      <MemoryRouter>
        <Menu />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('Salad')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => expect(screen.queryByText('Salad')).not.toBeInTheDocument());
  });

  // ----- TOGGLE AVAILABILITY -----
  test('toggles menu item availability', async () => {
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue('rest123');

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        text: async () =>
          JSON.stringify([{ id: 4, name: 'Soup', description: 'Hot', price: 6, category: 'Starter', available: true }]),
      })
      .mockResolvedValueOnce({ ok: true }) // updateMenuItem PUT
      .mockResolvedValueOnce({
        ok: true,
        text: async () =>
          JSON.stringify([{ id: 4, name: 'Soup', description: 'Hot', price: 6, category: 'Starter', available: false }]),
      }); // fetchMenu after toggle

    render(
      <MemoryRouter>
        <Menu />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('Soup')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Toggle'));

    await waitFor(() => expect(screen.getByText('No')).toBeInTheDocument()); // availability toggled
  });
});
