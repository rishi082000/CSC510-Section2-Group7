import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Cart from "../Cart";

describe("Cart Component", () => {
  const mockUpdateCart = jest.fn();

  const renderCart = (cartItems, totalPrice) => {
    return render(
      <BrowserRouter>
        <Cart
          cartItems={cartItems}
          totalPrice={totalPrice}
          handleUpdateCart={mockUpdateCart}
        />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders empty cart message when there are no items", () => {
    renderCart([], 0);
    expect(screen.getByText("Cart")).toBeInTheDocument();
    expect(screen.getByText("Your cart is empty.")).toBeInTheDocument();
    expect(screen.queryByText(/Go to Checkout/)).not.toBeInTheDocument();
  });

  test("renders cart items with correct name, price, and quantity", () => {
    const items = [
      { id: 1, name: "Pepperoni Pizza", price: 12.5, quantity: 2 },
      { id: 2, name: "Veggie Pizza", price: 10.0, quantity: 1 },
    ];
    renderCart(items, 35);

    expect(screen.getByText("Cart")).toBeInTheDocument();
    expect(screen.getByText("Pepperoni Pizza - $12.50")).toBeInTheDocument();
    expect(screen.getByText("Veggie Pizza - $10.00")).toBeInTheDocument();
    expect(screen.getByText("Total: $35.00")).toBeInTheDocument();

    // Simulate button clicks
    const minusButtons = screen.getAllByText("-");
    const plusButtons = screen.getAllByText("+");

    fireEvent.click(minusButtons[0]);
    fireEvent.click(plusButtons[0]);

    expect(mockUpdateCart).toHaveBeenCalledTimes(2);
    expect(mockUpdateCart).toHaveBeenNthCalledWith(1, items[0], "DECREMENT");
    expect(mockUpdateCart).toHaveBeenNthCalledWith(2, items[0], "ADD");
  });

  test("shows checkout link when cart has items", () => {
    const items = [{ id: 1, name: "Margherita", price: 9.99, quantity: 1 }];
    renderCart(items, 9.99);

    const checkoutLink = screen.getByText(/Go to Checkout/);
    expect(checkoutLink).toBeInTheDocument();
    expect(checkoutLink.closest("a")).toHaveAttribute("href", "/checkout");
  });
});
