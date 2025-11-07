import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Orders from '../Orders';
import OrderService from '../../../services/OrderService';

// Mock the OrderService
jest.mock('../../../services/OrderService');

describe('Orders Component', () => {
  const setItemMock = jest.spyOn(window.localStorage.__proto__, 'setItem');
  const getItemMock = jest.spyOn(window.localStorage.__proto__, 'getItem');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays orders for logged in user', async () => {
    getItemMock.mockReturnValue('rest123');

    const ordersMock = [
      { id: 1, items: [{ name: 'Pizza', quantity: 2 }], status: 'PLACED' },
      { id: 2, items: [{ name: 'Burger', quantity: 1 }], status: 'READY' },
    ];

    OrderService.fetchOrders.mockResolvedValueOnce(ordersMock);

    render(
      <MemoryRouter>
        <Orders />
      </MemoryRouter>
    );

    // Wait for orders to appear
    await waitFor(() => expect(screen.getByText(/Pizza — Qty: 2/i)).toBeInTheDocument());
    expect(screen.getByText(/Burger — Qty: 1/i)).toBeInTheDocument();
  });

  test('changes order status', async () => {
    getItemMock.mockReturnValue('rest123');

    const ordersMock = [
      { id: 1, items: [{ name: 'Pizza', quantity: 2 }], status: 'PLACED' },
    ];

    OrderService.fetchOrders.mockResolvedValueOnce(ordersMock);
    OrderService.updateOrderStatus.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <Orders />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText(/Pizza — Qty: 2/i)).toBeInTheDocument());

    // Select the <li> containing the order
    const pizzaOrder = screen.getByText(/Pizza — Qty: 2/i).closest('li');
    const select = pizzaOrder.querySelector('select');

    fireEvent.change(select, { target: { value: 'PREPARING' } });

    await waitFor(() =>
      expect(OrderService.updateOrderStatus).toHaveBeenCalledWith(1, 'PREPARING')
    );
  });

  test('displays error if fetchOrders fails', async () => {
    getItemMock.mockReturnValue('rest123');
    OrderService.fetchOrders.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(
      <MemoryRouter>
        <Orders />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText(/Failed to fetch/i)).toBeInTheDocument());
  });

  test('displays error if updateOrderStatus fails', async () => {
    getItemMock.mockReturnValue('rest123');

    const ordersMock = [
      { id: 1, items: [{ name: 'Pizza', quantity: 2 }], status: 'PLACED' },
    ];

    OrderService.fetchOrders.mockResolvedValueOnce(ordersMock);
    OrderService.updateOrderStatus.mockRejectedValueOnce(new Error('Failed to update'));

    render(
      <MemoryRouter>
        <Orders />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText(/Pizza — Qty: 2/i)).toBeInTheDocument());

    const pizzaOrder = screen.getByText(/Pizza — Qty: 2/i).closest('li');
    const select = pizzaOrder.querySelector('select');

    fireEvent.change(select, { target: { value: 'PREPARING' } });

    await waitFor(() => expect(screen.getByText(/Failed to update/i)).toBeInTheDocument());
  });

  test('shows error if userId not in localStorage', async () => {
    getItemMock.mockReturnValue(null);

    render(
      <MemoryRouter>
        <Orders />
      </MemoryRouter>
    );

    expect(await screen.findByText(/No userId found/i)).toBeInTheDocument();
  });
});
