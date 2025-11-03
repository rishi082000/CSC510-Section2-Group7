import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CartCheckout from "./CartCheckout";

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("CartCheckout Component", () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockReset();
  });

  test("renders empty cart message when localStorage is empty", () => {
    render(
      <MemoryRouter>
        <CartCheckout />
      </MemoryRouter>
    );
    expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
  });

  test("renders cart items correctly", () => {
    const cart = [
      { name: "Pizza", restaurant_name: "Pizzeria", quantity: 2, price: 15 },
    ];
    localStorage.setItem("packeats_cart", JSON.stringify(cart));

    render(
      <MemoryRouter>
        <CartCheckout />
      </MemoryRouter>
    );

    expect(screen.getByText("Pizza")).toBeInTheDocument();
    expect(screen.getByText("Pizzeria")).toBeInTheDocument();
    expect(screen.getByText("Quantity: 2 × $15.00")).toBeInTheDocument();
    expect(screen.getByText("Total: $30.00")).toBeInTheDocument();
  });

  test("calculates subtotal, tax, delivery, and total correctly", () => {
    const cart = [
      { name: "Pizza", restaurant_name: "Pizzeria", quantity: 2, price: 15 },
    ];
    localStorage.setItem("packeats_cart", JSON.stringify(cart));

    render(
      <MemoryRouter>
        <CartCheckout />
      </MemoryRouter>
    );

    // Use regex to ignore minor rounding differences
    expect(screen.getByText(/Subtotal: \$30\.00/)).toBeInTheDocument();
    expect(screen.getByText(/Tax \(7\.25%\): \$2\.1[7-8]/)).toBeInTheDocument();
    expect(screen.getByText(/Delivery Fee: \$5\.00/)).toBeInTheDocument();
    expect(screen.getByText(/Total: \$37\.1[7-8]/)).toBeInTheDocument();
  });

  test("changes delivery method when eco is selected", () => {
    const cart = [
      { name: "Pizza", restaurant_name: "Pizzeria", quantity: 1, price: 15 },
    ];
    localStorage.setItem("packeats_cart", JSON.stringify(cart));

    render(
      <MemoryRouter>
        <CartCheckout />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByLabelText("Eco Delivery ($2)"));
    expect(screen.getByText("Delivery Fee: $2.00")).toBeInTheDocument();
  });

  test("changes payment method when Netbanking is selected", () => {
    const cart = [
      { name: "Pizza", restaurant_name: "Pizzeria", quantity: 1, price: 15 },
    ];
    localStorage.setItem("packeats_cart", JSON.stringify(cart));

    render(
      <MemoryRouter>
        <CartCheckout />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByLabelText("Netbanking"));
    expect(screen.getByLabelText("Netbanking").checked).toBe(true);
  });

  test("places order and shows success message", () => {
    const cart = [
      { name: "Pizza", restaurant_name: "Pizzeria", quantity: 1, price: 15 },
    ];
    localStorage.setItem("packeats_cart", JSON.stringify(cart));

    render(
      <MemoryRouter>
        <CartCheckout />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Place Order/i));

    expect(screen.getByText(/✅ Payment Successful/i)).toBeInTheDocument();
    expect(
      screen.getByText((content, element) =>
        content.includes("Your cart is now") && element.querySelector("strong")
      )
    ).toBeInTheDocument();
  });

  test("back button navigates to browse page", () => {
    render(
      <MemoryRouter>
        <CartCheckout />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Return to Browse/i));
    expect(mockNavigate).toHaveBeenCalledWith("/browse");
  });

  test("Go Back to Browse button navigates correctly after order", () => {
    const cart = [
      { name: "Pizza", restaurant_name: "Pizzeria", quantity: 1, price: 15 },
    ];
    localStorage.setItem("packeats_cart", JSON.stringify(cart));

    render(
      <MemoryRouter>
        <CartCheckout />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Place Order/i));
    fireEvent.click(screen.getByText(/Go Back to Browse/i));
    expect(mockNavigate).toHaveBeenCalledWith("/browse");
  });

  test("handles invalid JSON in localStorage gracefully", () => {
    localStorage.setItem("packeats_cart", "invalid json");

    render(
      <MemoryRouter>
        <CartCheckout />
      </MemoryRouter>
    );

    expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
  });

  test("cart is empty after placing order", () => {
    const cart = [
      { name: "Pizza", restaurant_name: "Pizzeria", quantity: 1, price: 15 },
    ];
    localStorage.setItem("packeats_cart", JSON.stringify(cart));

    render(
      <MemoryRouter>
        <CartCheckout />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Place Order/i));

    expect(
      screen.getByText((content, element) =>
        content.includes("Your cart is now") && element.querySelector("strong")
      )
    ).toBeInTheDocument();

    // Ensure cart items are not rendered
    expect(screen.queryByText("Pizza")).not.toBeInTheDocument();
  });
});
