/**
 * @file DriverLoginForm.test.jsx
 * @description Unit tests for DriverLoginForm component.
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DriverLoginForm from "../driver/DriverLoginForm";

// Mock navigate function from react-router-dom
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("DriverLoginForm Component", () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
    jest.clearAllMocks();
  });

  test("renders the login form", () => {
    render(
      <MemoryRouter>
        <DriverLoginForm />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Register as Driver/i })).toBeInTheDocument();
  });

  test("handles successful login", async () => {
    // Mock fetch for successful login
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: "abcd1234", name: "Driver" }),
      })
    );

    render(
      <MemoryRouter>
        <DriverLoginForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "driver@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      // Check localStorage and navigation
      expect(localStorage.getItem("driverData")).toBeTruthy();
      expect(mockNavigate).toHaveBeenCalledWith("/driver/dashboard");
    });
  });

  test("handles failed login", async () => {
    // Mock fetch for failed login
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: "Invalid credentials" }),
      })
    );

    render(
      <MemoryRouter>
        <DriverLoginForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      // localStorage should be empty and navigation should not occur
      expect(localStorage.getItem("driverData")).toBeNull();
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });

  test("clicking register button navigates to register page", () => {
    render(
      <MemoryRouter>
        <DriverLoginForm />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Register as Driver/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/driver/register");
  });
});
