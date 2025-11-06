// src/pages/customer/Quiz.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import Quiz from "../Quiz";
import axios from "axios";

jest.mock("axios");
jest.mock("../Cart", () => () => <div data-testid="cart-mock" />);

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Quiz Component", () => {
  const mockMenu = [
    {
      id: 101,
      name: "Pepperoni Pizza",
      description: "Tasty",
      price: 12.5,
      food_type: "Italian",
      recommendation_tags: ["Chill", "Kick"]
    },
    {
      id: 102,
      name: "Veggie Pizza",
      description: "Healthy",
      price: 10,
      food_type: "Vegetarian",
      recommendation_tags: ["Cozy", "Mild"]
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("renders Quiz intro and questions", () => {
    render(<Quiz />);
    expect(screen.getByText(/Confused on what dish to order/i)).toBeInTheDocument();
    expect(screen.getByText("Your mood today?")).toBeInTheDocument();
    expect(screen.getByText("Spice preference?")).toBeInTheDocument();
  });

  test("prevents submit when questions unanswered", () => {
    render(<Quiz />);
    window.alert = jest.fn();
    fireEvent.click(screen.getByText("Submit"));
    expect(window.alert).toHaveBeenCalledWith("Please answer all the questions before submitting!");
  });

  test("submits quiz and shows recommendations", async () => {
    axios.get.mockResolvedValue({ data: mockMenu });

    render(<Quiz />);

    // Answer all questions
    fireEvent.click(screen.getByDisplayValue("Chill"));       // q2
    fireEvent.click(screen.getByDisplayValue("Kick"));        // q3
    fireEvent.click(screen.getByDisplayValue("Snack Attack"));// q4
    fireEvent.click(screen.getByDisplayValue("Savory"));      // q5
    fireEvent.click(screen.getByDisplayValue("Baked & Light"));// q6

    fireEvent.click(screen.getByText("Submit"));

    // Wait for recommendations to appear
    const recommendedItem = await screen.findByText("Pepperoni Pizza");
    expect(recommendedItem).toBeInTheDocument();

    // Ensure recommended items have cart buttons
    const menuItemContainer = recommendedItem.closest(".menu-list-item");
    expect(within(menuItemContainer).getByText("Add to Cart:")).toBeInTheDocument();
  });

  test("adds and decrements items in cart within recommendations", async () => {
    axios.get.mockResolvedValue({ data: mockMenu });

    render(<Quiz />);

    // Answer all questions
    fireEvent.click(screen.getByDisplayValue("Chill"));       
    fireEvent.click(screen.getByDisplayValue("Kick"));        
    fireEvent.click(screen.getByDisplayValue("Snack Attack"));
    fireEvent.click(screen.getByDisplayValue("Savory"));      
    fireEvent.click(screen.getByDisplayValue("Baked & Light"));

    fireEvent.click(screen.getByText("Submit"));

    const recommendedItem = await screen.findByText("Pepperoni Pizza");
    const menuItemContainer = recommendedItem.closest(".menu-list-item");

    const addButton = within(menuItemContainer).getByText("+");
    fireEvent.click(addButton);
    await waitFor(() =>
      expect(within(menuItemContainer).getByText("1")).toBeInTheDocument()
    );

    const incrementButton = within(menuItemContainer).getByText("+");
    fireEvent.click(incrementButton);
    await waitFor(() =>
      expect(within(menuItemContainer).getByText("2")).toBeInTheDocument()
    );

    const decrementButton = within(menuItemContainer).getByText("-");
    fireEvent.click(decrementButton);
    await waitFor(() =>
      expect(within(menuItemContainer).getByText("1")).toBeInTheDocument()
    );

    fireEvent.click(decrementButton);
    await waitFor(() =>
      expect(within(menuItemContainer).queryByText("1")).not.toBeInTheDocument()
    );
    expect(within(menuItemContainer).getByText("Add to Cart:")).toBeInTheDocument();
  });

  test("Go to Browse button calls navigate", () => {
    render(<Quiz />);
    const browseBtn = screen.getByText("← Return to Browse");
    fireEvent.click(browseBtn);
    expect(mockNavigate).toHaveBeenCalledWith("/browse");
  });

  test("renders Cart empty branch", () => {
    render(<Quiz />);
    expect(screen.getByTestId("cart-mock")).toBeInTheDocument();
  });

  test("handles localStorage parse failure gracefully", () => {
    jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => "{invalid json}");
    render(<Quiz />);
    expect(screen.getByText("← Return to Browse")).toBeInTheDocument();
  });

  test("handles axios fetch failure gracefully", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    axios.get.mockRejectedValue(new Error("Failed"));

    render(<Quiz />);

    // Answer all questions to trigger fetch
    fireEvent.click(screen.getByDisplayValue("Chill"));       
    fireEvent.click(screen.getByDisplayValue("Kick"));        
    fireEvent.click(screen.getByDisplayValue("Snack Attack"));
    fireEvent.click(screen.getByDisplayValue("Savory"));      
    fireEvent.click(screen.getByDisplayValue("Baked & Light"));

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.queryByText("Pepperoni Pizza")).not.toBeInTheDocument();
    });
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Error fetching menu items:"),
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});
