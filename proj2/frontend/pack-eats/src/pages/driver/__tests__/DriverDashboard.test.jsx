import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import DriverDashboard from "../DriverDashboard";
 // adjust the path if needed

jest.mock("axios");
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("DriverDashboard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("redirects to login if driverData is not found in localStorage", async () => {
    render(
      <MemoryRouter>
        <DriverDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/driver/login");
    });
  });

  test("renders loading state while fetching orders", async () => {
    const mockDriverData = { id: 1, fullName: "John Doe", email: "john@example.com" };
    localStorage.setItem("driverData", JSON.stringify(mockDriverData));

    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <DriverDashboard />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Loading orders.../i)).toBeInTheDocument();
  });

  test("renders available orders when fetched", async () => {
    const mockDriverData = { id: 1, fullName: "John Doe", email: "john@example.com" };
    localStorage.setItem("driverData", JSON.stringify(mockDriverData));

    const mockOrders = [
      {
        id: 101,
        restaurantName: "Pasta Place",
        customerName: "Alice",
        deliveryAddress: "123 Main St",
        totalAmount: 25.5,
        items: [
          { name: "Spaghetti", quantity: 1 },
          { name: "Garlic Bread", quantity: 2 },
        ],
      },
    ];

    axios.get.mockResolvedValueOnce({ data: mockOrders });

    render(
      <MemoryRouter>
        <DriverDashboard />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Available Orders/i)).toBeInTheDocument();
    expect(await screen.findByText(/Pasta Place/)).toBeInTheDocument();
    expect(await screen.findByText(/Alice/)).toBeInTheDocument();
    expect(await screen.findByText(/\$25.50/)).toBeInTheDocument();
  });

  test("shows 'No orders available' message when no orders are returned", async () => {
    const mockDriverData = { id: 2, fullName: "Jane Smith", email: "jane@example.com" };
    localStorage.setItem("driverData", JSON.stringify(mockDriverData));

    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <DriverDashboard />
      </MemoryRouter>
    );

    expect(await screen.findByText(/No orders available right now/i)).toBeInTheDocument();
  });

  test("handles order acceptance successfully", async () => {
    const mockDriverData = { id: 1, fullName: "Driver", email: "driver@example.com" };
    localStorage.setItem("driverData", JSON.stringify(mockDriverData));

    const mockOrders = [
      {
        id: 202,
        restaurantName: "Pizza House",
        customerName: "Bob",
        deliveryAddress: "456 Elm St",
        totalAmount: 18.99,
        items: [{ name: "Pepperoni Pizza", quantity: 1 }],
      },
    ];

    axios.get.mockResolvedValueOnce({ data: mockOrders });
    axios.post.mockResolvedValueOnce({ status: 200 });

    render(
      <MemoryRouter>
        <DriverDashboard />
      </MemoryRouter>
    );

    const acceptButton = await screen.findByText(/Accept Order/i);
    window.alert = jest.fn();

    fireEvent.click(acceptButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:8080/api/driver/orders/202/accept",
        { driverId: 1 }
      );
      expect(window.alert).toHaveBeenCalledWith("Order accepted successfully!");
    });
  });

  test("handles logout correctly", async () => {
    const mockDriverData = { id: 3, fullName: "John Driver", email: "jd@example.com" };
    localStorage.setItem("driverData", JSON.stringify(mockDriverData));

    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <DriverDashboard />
      </MemoryRouter>
    );

    const logoutBtn = await screen.findByText(/Logout/i);
    fireEvent.click(logoutBtn);

    expect(localStorage.getItem("driverData")).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith("/driver/login");
  });
});
