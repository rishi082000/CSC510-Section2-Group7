/**
 * @file DriverLoginPage.test.jsx
 * @description Unit tests for DriverLoginPage component.
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DriverLoginPage from "../DriverLoginPage";

// Mock the child component (DriverLoginForm)
jest.mock("../../../components/driver/DriverLoginForm", () => () => (
  <div data-testid="mock-driver-login-form">Mock DriverLoginForm</div>
));

describe("DriverLoginPage Component", () => {
  test("renders the main title correctly", () => {
    render(<DriverLoginPage />, { wrapper: MemoryRouter });

    // Title text check
    expect(
      screen.getByText(/Pack/i)
    ).toBeInTheDocument();

    // Ensure it includes "Driver Login"
    expect(
      screen.getByText(/Driver Login/i)
    ).toBeInTheDocument();
  });

  test("renders the PackEats brand correctly with accent span", () => {
    render(<DriverLoginPage />, { wrapper: MemoryRouter });

    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toHaveClass("wolfcafe-title");

    // Check the accent span exists
    const accentSpan = title.querySelector(".accent");
    expect(accentSpan).toBeInTheDocument();
    expect(accentSpan.textContent).toBe("Eats");
  });

  test("renders the DriverLoginForm component", () => {
    render(<DriverLoginPage />, { wrapper: MemoryRouter });

    // Confirm mocked form renders
    expect(
      screen.getByTestId("mock-driver-login-form")
    ).toBeInTheDocument();
  });

  test("renders main container elements", () => {
    render(<DriverLoginPage />, { wrapper: MemoryRouter });

    const pageDiv = screen.getByRole("heading", { level: 1 }).closest(".wolfcafe-page");
    expect(pageDiv).toBeInTheDocument();

    const container = screen.getByRole("heading", { level: 1 }).closest(".wolfcafe-container");
    expect(container).toBeInTheDocument();
  });
});
