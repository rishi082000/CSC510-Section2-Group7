/**
 * @file DriverRegistrationPage.test.jsx
 * @description Unit tests for DriverRegistrationPage component.
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DriverRegistrationPage from "../DriverRegistrationPage";

// 🧩 Mock the child component (DriverRegistrationForm)
jest.mock("../../../components/driver/DriverRegistrationForm", () => () => (
  <div data-testid="mock-driver-registration-form">Mock DriverRegistrationForm</div>
));

describe("DriverRegistrationPage Component", () => {
  test("renders without crashing", () => {
    render(<DriverRegistrationPage />, { wrapper: MemoryRouter });

    // The mock component should render
    expect(screen.getByTestId("mock-driver-registration-form")).toBeInTheDocument();
  });

  test("contains the DriverRegistrationForm component", () => {
    render(<DriverRegistrationPage />, { wrapper: MemoryRouter });

    // Check the mocked form content
    expect(screen.getByText("Mock DriverRegistrationForm")).toBeInTheDocument();
  });

  test("renders inside a top-level div", () => {
    const { container } = render(<DriverRegistrationPage />, { wrapper: MemoryRouter });

    // Ensure top-level element is a <div>
    const topDiv = container.querySelector("div");
    expect(topDiv).toBeInTheDocument();
  });
});
