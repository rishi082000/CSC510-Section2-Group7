/**
 * @file DriverLoginForm.test.jsx
 * @description Unit tests for DriverLoginForm component.
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DriverLoginForm from "../driver/DriverLoginForm.jsx";

// Mock useNavigate from react-router-dom
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock fetch
global.fetch = jest.fn();

describe("DriverLoginForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  // 1️⃣ Renders basic form elements
  test("renders email and password input fields and login button", () => {
    render(<DriverLoginForm />, { wrapper: MemoryRouter });

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  // 2️⃣ User input updates state correctly
  test("updates input values when user types", () => {
    render(<DriverLoginForm />, { wrapper: MemoryRouter });

    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");

    fireEvent.change(emailInput, { target: { value: "driver@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("driver@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  // 3️⃣ Successful login flow
  test("handles successful login and navigates to dashboard", async () => {
    const mockResponse = {
      id: 1,
      email: "driver@example.com",
      name: "John",
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(<DriverLoginForm />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "driver@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() =>
      expect(screen.getByText(/login successful/i)).toBeInTheDocument()
    );

    // Check that localStorage is updated
    expect(localStorage.getItem("driverData")).toContain("driver@example.com");

    // Check navigation to dashboard
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith("/driver/dashboard")
    );
  });

  // 4️⃣ Invalid credentials / failed login
  test("shows error message on invalid credentials", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Invalid email or password" }),
    });

    render(<DriverLoginForm />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() =>
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument()
    );

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  // 5️⃣ Server unreachable / network error
  test("displays error message when server is unreachable", async () => {
    fetch.mockRejectedValueOnce(new Error("Network Error"));

    render(<DriverLoginForm />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "driver@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/unable to connect to server/i)
      ).toBeInTheDocument()
    );
  });

  // 6️⃣ Invalid server response (missing fields)
  test("shows error message when server returns invalid data", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}), // missing id and email
    });

    render(<DriverLoginForm />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "driver@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/invalid response from server/i)
      ).toBeInTheDocument()
    );
  });

  // 7️⃣ Clicking register navigates to register page
  test("navigates to register page when register button clicked", () => {
    render(<DriverLoginForm />, { wrapper: MemoryRouter });

    const registerButton = screen.getByRole("button", {
      name: /register as driver/i,
    });

    fireEvent.click(registerButton);
    expect(mockNavigate).toHaveBeenCalledWith("/driver/register");
  });

  // 8️⃣ Disables inputs and button while loading
  test("disables inputs and button while loading", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        email: "driver@example.com",
      }),
    });

    render(<DriverLoginForm />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "driver@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    const button = screen.getByRole("button", { name: /login/i });
    fireEvent.click(button);

    expect(button).toBeDisabled();
  });
});
