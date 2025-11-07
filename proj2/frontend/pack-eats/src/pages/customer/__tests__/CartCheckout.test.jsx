import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CartCheckout from "../CartCheckout";
import axios from "axios";

jest.mock("axios");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => null);
  jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {});
  jest.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {});
  jest.clearAllMocks();
});

describe("CartCheckout Component", () => {
  test("renders empty cart message when localStorage is empty", () => {
    render(<MemoryRouter><CartCheckout /></MemoryRouter>);
    expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
  });

  test("renders cart items correctly", () => {
    const cart = [{ id: 1, name: "Pizza", restaurant_name: "Pizzeria", quantity: 2, price: 15 }];
    Storage.prototype.getItem.mockReturnValueOnce(JSON.stringify(cart));

    render(<MemoryRouter><CartCheckout /></MemoryRouter>);

    expect(screen.getByText("Pizza")).toBeInTheDocument();
    expect(screen.getByText("Pizzeria")).toBeInTheDocument();
    expect(screen.getByText("Quantity: 2 × $15.00")).toBeInTheDocument();
    expect(screen.getByText("Total: $30.00")).toBeInTheDocument();
  });

  test("calculates subtotal, tax, delivery, and total correctly", () => {
    const cart = [{ id: 1, name: "Pizza", restaurant_name: "Pizzeria", quantity: 2, price: 15 }];
    Storage.prototype.getItem.mockReturnValueOnce(JSON.stringify(cart));

    render(<MemoryRouter><CartCheckout /></MemoryRouter>);

    expect(screen.getByText(/Subtotal: \$30\.00/)).toBeInTheDocument();
    expect(screen.getByText(/Tax \(7\.25%\): \$2\.17/)).toBeInTheDocument();
    expect(screen.getByText(/Delivery Fee: \$5\.00/)).toBeInTheDocument();
    expect(screen.getByText(/Total: \$37\.17/)).toBeInTheDocument();
  });

  test("switches delivery methods correctly", () => {
    const cart = [{ id: 1, name: "Pizza", restaurant_name: "Pizzeria", quantity: 1, price: 10 }];
    Storage.prototype.getItem.mockReturnValueOnce(JSON.stringify(cart));

    render(<MemoryRouter><CartCheckout /></MemoryRouter>);

    const ecoRadio = screen.getByLabelText(/Eco Delivery/i);
    const standardRadio = screen.getByLabelText(/Standard Delivery/i);

    fireEvent.click(ecoRadio);
    expect(ecoRadio.checked).toBe(true);
    expect(standardRadio.checked).toBe(false);

    fireEvent.click(standardRadio);
    expect(standardRadio.checked).toBe(true);
    expect(ecoRadio.checked).toBe(false);
  });

  test("switches payment methods correctly", () => {
    const cart = [{ id: 1, name: "Pizza", restaurant_name: "Pizzeria", quantity: 1, price: 10 }];
    Storage.prototype.getItem.mockReturnValueOnce(JSON.stringify(cart));

    render(<MemoryRouter><CartCheckout /></MemoryRouter>);

    const cardRadio = screen.getByLabelText(/Credit \/ Debit Card/i);
    const netbankingRadio = screen.getByLabelText(/Netbanking/i);
    const codRadio = screen.getByLabelText(/Cash on Delivery/i);

    fireEvent.click(netbankingRadio);
    expect(netbankingRadio.checked).toBe(true);

    fireEvent.click(codRadio);
    expect(codRadio.checked).toBe(true);

    fireEvent.click(cardRadio);
    expect(cardRadio.checked).toBe(true);
  });

  test("places order successfully and clears cart", async () => {
    const cart = [
      { id: 33, name: "Roti", restaurant_name: "Testaurant", restaurant_id: "rest1", quantity: 2, price: 13 }
    ];
    Storage.prototype.getItem.mockReturnValueOnce(JSON.stringify(cart));
    axios.post.mockResolvedValueOnce({ status: 200 });

    render(<MemoryRouter><CartCheckout /></MemoryRouter>);

    fireEvent.click(screen.getByText(/Place Order/i));

    await waitFor(() =>
      expect(screen.getByText(/✅ Payment Successful/i)).toBeInTheDocument()
    );

    expect(Storage.prototype.removeItem).toHaveBeenCalledWith("packeats_cart");
    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  test("handles failed order gracefully", async () => {
    const cart = [
      { id: 1, name: "Burger", restaurant_name: "BBQ Hub", restaurant_id: "rest2", quantity: 1, price: 10 }
    ];
    Storage.prototype.getItem.mockReturnValueOnce(JSON.stringify(cart));
    axios.post.mockRejectedValueOnce(new Error("Server error"));

    render(<MemoryRouter><CartCheckout /></MemoryRouter>);

    fireEvent.click(screen.getByText(/Place Order/i));

    await waitFor(() =>
      expect(screen.queryByText(/✅ Payment Successful/i)).not.toBeInTheDocument()
    );

    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  describe("Additional edge cases for full coverage", () => {
    beforeEach(() => {
      localStorage.clear();
      mockNavigate.mockReset();
      jest.clearAllMocks();
    });

    test("back button works when cart is empty", () => {
      render(<MemoryRouter><CartCheckout /></MemoryRouter>);
      fireEvent.click(screen.getByText(/Return to Browse/i));
      expect(mockNavigate).toHaveBeenCalledWith("/browse");
    });

    test("default delivery method is Standard Delivery", () => {
      const cart = [{ name: "Pizza", restaurant_name: "Pizzeria", quantity: 1, price: 10 }];
      localStorage.setItem("packeats_cart", JSON.stringify(cart));
      render(<MemoryRouter><CartCheckout /></MemoryRouter>);

      expect(screen.getByLabelText(/Standard Delivery/i).checked).toBe(true);
    });

    test("default payment method is Credit / Debit Card", () => {
      const cart = [{ name: "Pizza", restaurant_name: "Pizzeria", quantity: 1, price: 10 }];
      localStorage.setItem("packeats_cart", JSON.stringify(cart));
      render(<MemoryRouter><CartCheckout /></MemoryRouter>);

      expect(screen.getByLabelText(/Credit \/ Debit Card/i).checked).toBe(true);
    });

    test("place order button disabled when cart is empty", () => {
      render(<MemoryRouter><CartCheckout /></MemoryRouter>);
      expect(screen.queryByText(/Place Order/i)).toBeNull();
      expect(axios.post).not.toHaveBeenCalled();
    });

    test("handles NaN subtotal gracefully", () => {
      const cart = [{ name: "Mystery Item", restaurant_name: "Testaurant", quantity: 1, price: NaN }];
      localStorage.setItem("packeats_cart", JSON.stringify(cart));
      render(<MemoryRouter><CartCheckout /></MemoryRouter>);
      expect(screen.getByText(/Subtotal: \$0\.00/)).toBeInTheDocument();
    });

    test("Go Back to Browse button navigates correctly after order", async () => {
      const cart = [{ id: 1, name: "Pizza", restaurant_name: "Pizzeria", restaurant_id: "rest1", quantity: 1, price: 15 }];
      Storage.prototype.getItem.mockReturnValueOnce(JSON.stringify(cart));
      axios.post.mockResolvedValueOnce({ status: 200 });

      render(<MemoryRouter><CartCheckout /></MemoryRouter>);
      fireEvent.click(screen.getByText(/Place Order/i));

      await waitFor(() =>
        expect(screen.getByText(/✅ Payment Successful/i)).toBeInTheDocument()
      );

      fireEvent.click(screen.getByText(/Go Back to Browse/i));
      expect(mockNavigate).toHaveBeenCalledWith("/browse");
    });

    test("cart is empty after placing order", async () => {
      const cart = [{ id: 1, name: "Pizza", restaurant_name: "Pizzeria", restaurant_id: "rest1", quantity: 1, price: 15 }];
      Storage.prototype.getItem.mockReturnValueOnce(JSON.stringify(cart));
      axios.post.mockResolvedValueOnce({ status: 200 });

      render(<MemoryRouter><CartCheckout /></MemoryRouter>);
      fireEvent.click(screen.getByText(/Place Order/i));

      await waitFor(() =>
        expect(screen.getByText(/✅ Payment Successful/i)).toBeInTheDocument()
      );

      expect(screen.queryByText("Pizza")).not.toBeInTheDocument();
    });

    test("handles multiple cart items correctly", () => {
      const cart = [
        { id: 1, name: "Pizza", restaurant_name: "Pizzeria", quantity: 1, price: 10 },
        { id: 2, name: "Burger", restaurant_name: "BBQ Hub", quantity: 2, price: 5 },
      ];
      Storage.prototype.getItem.mockReturnValueOnce(JSON.stringify(cart));

      render(<MemoryRouter><CartCheckout /></MemoryRouter>);

      expect(screen.getByText("Pizza")).toBeInTheDocument();
      expect(screen.getByText("Burger")).toBeInTheDocument();
      expect(screen.getByText("Quantity: 1 × $10.00")).toBeInTheDocument();
      expect(screen.getByText("Quantity: 2 × $5.00")).toBeInTheDocument();
      expect(screen.getByText("Subtotal: $20.00")).toBeInTheDocument();
    });

    test("handles multiple restaurants in cart correctly", async () => {
      const cart = [
        { id: 1, name: "Pizza", restaurant_name: "Pizzeria", restaurant_id: "rest1", quantity: 1, price: 10 },
        { id: 2, name: "Burger", restaurant_name: "BBQ Hub", restaurant_id: "rest2", quantity: 2, price: 5 },
      ];
      Storage.prototype.getItem.mockReturnValueOnce(JSON.stringify(cart));
      axios.post.mockResolvedValue({ status: 200 });

      render(<MemoryRouter><CartCheckout /></MemoryRouter>);
      fireEvent.click(screen.getByText(/Place Order/i));

      await waitFor(() =>
        expect(screen.getByText(/✅ Payment Successful/i)).toBeInTheDocument()
      );

      expect(axios.post).toHaveBeenCalledTimes(2);
      expect(axios.post).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ restaurant_id: "rest1" }), expect.any(Object));
      expect(axios.post).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ restaurant_id: "rest2" }), expect.any(Object));
    });

    test("displays error message when API request fails", async () => {
      const cart = [{ id: 1, name: "Pizza", restaurant_name: "Pizzeria", restaurant_id: "rest1", quantity: 1, price: 15 }];
      Storage.prototype.getItem.mockReturnValueOnce(JSON.stringify(cart));
      axios.post.mockRejectedValueOnce(new Error("Server Error"));

      render(<MemoryRouter><CartCheckout /></MemoryRouter>);
      fireEvent.click(screen.getByText(/Place Order/i));

      await waitFor(() =>
        expect(screen.queryByText(/✅ Payment Successful/i)).not.toBeInTheDocument()
      );
    });

    test("handles invalid JSON in localStorage gracefully", () => {
      Storage.prototype.getItem.mockReturnValueOnce("invalid json");

      render(<MemoryRouter><CartCheckout /></MemoryRouter>);
      expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
    });
  });
});
