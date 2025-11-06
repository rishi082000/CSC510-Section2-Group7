// src/pages/restaurant/__tests__/Dashboard.test.jsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';

const mockNavigate = jest.fn();

// Mock useNavigate from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders welcome message', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(screen.getByText(/Welcome!/i)).toBeInTheDocument();
  });

  test('renders Menu Items and Orders buttons', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /Menu Items/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Orders/i })).toBeInTheDocument();
  });

  test('clicking Menu Items button navigates to /menu', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Menu Items/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/menu');
  });

  test('clicking Orders button navigates to /orders', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Orders/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/orders');
  });

  test('buttons have correct styling', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    const menuButton = screen.getByRole('button', { name: /Menu Items/i });
    const ordersButton = screen.getByRole('button', { name: /Orders/i });

    expect(menuButton).toHaveStyle('background-color: #FF6B35');
    expect(menuButton).toHaveStyle('color: #fff');
    expect(ordersButton).toHaveStyle('background-color: #66BB6A');
    expect(ordersButton).toHaveStyle('color: #fff');
  });

  test('matches snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
