// src/pages/customer/Browse.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import Browse from "../Browse";
import axios from "axios";

jest.mock("axios");
jest.mock("../Cart", () => () => <div data-testid="cart-mock" />);

describe("Browse Component - coverage tests", () => {
  const mockRestaurants = [
    { id: 1, name: "Pizza Place", address: "123 Street" },
    { id: 2, name: "Burger Joint", address: "456 Avenue" },
  ];

  const mockMenu = [
    { id: 101, name: "Pepperoni Pizza", price: 12.5, description: "Tasty", food_type: "Italian" },
    { id: 102, name: "Veggie Pizza", price: 10.0, description: "Healthy" }, // no food_type
  ];

  beforeEach(() => {
    localStorage.clear();
    axios.get.mockReset();
    jest.restoreAllMocks();
  });

  test("renders without crashing", () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    render(<Browse onTakeQuiz={() => {}} />);
  });

  test("renders header and Take Quiz button", () => {
    render(<Browse onTakeQuiz={() => {}} />);
    expect(screen.getByText("Take Quiz")).toBeInTheDocument();
  });

  test("renders empty restaurant list when API returns empty", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    render(<Browse onTakeQuiz={() => {}} />);
    await waitFor(() => {
      expect(screen.queryByText("Pizza Place")).not.toBeInTheDocument();
    });
  });

  test("renders restaurants from API", async () => {
    axios.get.mockResolvedValueOnce({ data: mockRestaurants });
    render(<Browse onTakeQuiz={() => {}} />);
    await waitFor(() => {
      expect(screen.getByText("Pizza Place")).toBeInTheDocument();
      expect(screen.getByText("Burger Joint")).toBeInTheDocument();
    });
  });

  test("search restaurants input filters correctly", async () => {
    axios.get.mockResolvedValueOnce({ data: mockRestaurants });
    render(<Browse onTakeQuiz={() => {}} />);
    await waitFor(() => screen.getByText("Pizza Place"));
    fireEvent.change(screen.getByPlaceholderText("Search restaurants..."), {
      target: { value: "Burger" },
    });
    expect(screen.queryByText("Pizza Place")).not.toBeInTheDocument();
    expect(screen.getByText("Burger Joint")).toBeInTheDocument();
  });

  test("clicking restaurant shows menu items", async () => {
    axios.get.mockResolvedValueOnce({ data: mockRestaurants });
    axios.get.mockResolvedValueOnce({ data: mockMenu });
    render(<Browse onTakeQuiz={() => {}} />);
    await waitFor(() => screen.getByText("Pizza Place"));
    fireEvent.click(screen.getByText("Pizza Place"));
    await waitFor(() => screen.getByText("Pepperoni Pizza"));
    expect(screen.getByText("Veggie Pizza")).toBeInTheDocument();
  });

  test("menu search input filters menu correctly", async () => {
    axios.get.mockResolvedValueOnce({ data: mockRestaurants });
    axios.get.mockResolvedValueOnce({ data: mockMenu });
    render(<Browse onTakeQuiz={() => {}} />);
    await waitFor(() => screen.getByText("Pizza Place"));
    fireEvent.click(screen.getByText("Pizza Place"));
    await waitFor(() => screen.getByText("Pepperoni Pizza"));
    fireEvent.change(screen.getByPlaceholderText("Search Pizza Place menu..."), {
      target: { value: "Veggie" },
    });
    expect(screen.queryByText("Pepperoni Pizza")).not.toBeInTheDocument();
    expect(screen.getByText("Veggie Pizza")).toBeInTheDocument();
  });

  // ===== New Test: Add and decrement items in cart =====
  test("adds and decrements items in cart to remove them", async () => {
    axios.get.mockResolvedValueOnce({ data: mockRestaurants });
    axios.get.mockResolvedValueOnce({ data: mockMenu });

    render(<Browse onTakeQuiz={() => {}} />);
    
    // Wait for restaurants
    await waitFor(() => screen.getByText("Pizza Place"));
    fireEvent.click(screen.getByText("Pizza Place"));

    // Wait for menu to appear
    const pepperoniItem = await screen.findByText("Pepperoni Pizza");
    const menuItemContainer = pepperoniItem.closest(".menu-list-item");

    const addButton = within(menuItemContainer).getByText("+");
    fireEvent.click(addButton); // add item

    await waitFor(() =>
      expect(within(menuItemContainer).getByText("1")).toBeInTheDocument()
    );

    const incrementButton = within(menuItemContainer).getByText("+");
    fireEvent.click(incrementButton); // increment

    await waitFor(() =>
      expect(within(menuItemContainer).getByText("2")).toBeInTheDocument()
    );

    const decrementButton = within(menuItemContainer).getByText("-");
    fireEvent.click(decrementButton); // decrement to 1

    await waitFor(() =>
      expect(within(menuItemContainer).getByText("1")).toBeInTheDocument()
    );

    fireEvent.click(decrementButton); // decrement to remove

    await waitFor(() =>
      expect(within(menuItemContainer).queryByText("1")).not.toBeInTheDocument()
    );

    // "Add to Cart:" text should appear again
    expect(within(menuItemContainer).getByText("Add to Cart:")).toBeInTheDocument();
  });

  // ===== New Test: Handles menu fetch failure gracefully =====
  test("handles menu fetch failure gracefully", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    axios.get
      .mockResolvedValueOnce({ data: mockRestaurants }) // restaurant fetch OK
      .mockRejectedValueOnce(new Error("Menu fail"));    // menu fetch fails

    render(<Browse onTakeQuiz={() => {}} />);

    // Wait for restaurants to appear
    await waitFor(() => screen.getByText("Pizza Place"));

    // Trigger menu fetch
    fireEvent.click(screen.getByText("Pizza Place"));

    // Ensure component still renders something (no crash)
    await waitFor(() =>
      expect(screen.getByText("← Back to Restaurants")).toBeInTheDocument()
    );

    // Confirm error branch executed
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Error fetching menu:"),
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  test("back button resets menu items and search term", async () => {
    axios.get.mockResolvedValueOnce({ data: mockRestaurants });
    axios.get.mockResolvedValueOnce({ data: mockMenu });
    render(<Browse onTakeQuiz={() => {}} />);
    await waitFor(() => screen.getByText("Pizza Place"));
    fireEvent.click(screen.getByText("Pizza Place"));
    await waitFor(() => screen.getByText("Pepperoni Pizza"));

    const menuInput = screen.getByPlaceholderText("Search Pizza Place menu...");
    fireEvent.change(menuInput, { target: { value: "Pepperoni" } });

    fireEvent.click(screen.getByText("← Back to Restaurants"));
    expect(screen.getByPlaceholderText("Search restaurants...")).toHaveValue("");
    expect(screen.queryByText("Pepperoni Pizza")).not.toBeInTheDocument();
  });

  test("handles localStorage parse failure gracefully", async () => {
    jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => "{invalid json}");
    axios.get.mockResolvedValueOnce({ data: [] });
    render(<Browse onTakeQuiz={() => {}} />);
    await waitFor(() => {
      expect(screen.getByText("Take Quiz")).toBeInTheDocument();
    });
  });

  test("renders Cart empty branch", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    render(<Browse onTakeQuiz={() => {}} />);
    await waitFor(() => {
      expect(screen.getByTestId("cart-mock")).toBeInTheDocument();
    });
  });

  test("axios fetch restaurants failure handled", async () => {
    axios.get.mockRejectedValueOnce(new Error("Failed"));
    render(<Browse onTakeQuiz={() => {}} />);
    await waitFor(() => {
      expect(screen.getByText("Take Quiz")).toBeInTheDocument();
    });
  });

  test("Take Quiz button calls onTakeQuiz", () => {
    const onTakeQuiz = jest.fn();
    render(<Browse onTakeQuiz={onTakeQuiz} />);
    fireEvent.click(screen.getByText("Take Quiz"));
    expect(onTakeQuiz).toHaveBeenCalled();
  });
});
