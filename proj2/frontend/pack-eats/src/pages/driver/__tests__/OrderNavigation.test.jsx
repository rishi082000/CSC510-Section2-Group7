/**
 * @file OrderNavigation.test.jsx
 * @description Unit tests for OrderNavigation component.
 */

import React from "react";
import { render, screen, within } from "@testing-library/react";
import OrderNavigation from "../OrderNavigation";

describe("OrderNavigation Component", () => {
  test("renders without crashing", () => {
    render(<OrderNavigation />);
    expect(screen.getByText(/wolf/i)).toBeInTheDocument();
  });

  test("renders the correct page title", () => {
    render(<OrderNavigation />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(within(heading).getByText(/Wolf/i)).toBeInTheDocument();
    expect(within(heading).getByText(/Cafe/i)).toBeInTheDocument();
    expect(heading.textContent).toContain("Order Navigation");
  });

  test("shows placeholder map text", () => {
    render(<OrderNavigation />);
    expect(screen.getByText(/map will appear here/i)).toBeInTheDocument();
  });

  test("renders order status section", () => {
    render(<OrderNavigation />);
    expect(screen.getByText(/Order Status/i)).toBeInTheDocument();
    expect(screen.getByText(/Pending.../i)).toBeInTheDocument();
  });

  test("renders both action buttons", () => {
    render(<OrderNavigation />);
    const startButton = screen.getByRole("button", { name: /Start Navigation/i });
    const completeButton = screen.getByRole("button", { name: /Mark as Delivered/i });

    expect(startButton).toBeInTheDocument();
    expect(completeButton).toBeInTheDocument();
  });

  test("buttons have correct CSS classes", () => {
    render(<OrderNavigation />);
    const startButton = screen.getByRole("button", { name: /Start Navigation/i });
    const completeButton = screen.getByRole("button", { name: /Mark as Delivered/i });

    expect(startButton).toHaveClass("btn-start");
    expect(completeButton).toHaveClass("btn-complete");
  });
});
