/**
 * @file DriverRegistrationForm.test.jsx
 * @description Unit tests for DriverRegistrationForm component.
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import DriverRegistrationForm from "../driver/DriverRegistrationForm";

// ✅ Mock axios
jest.mock("axios");

describe("DriverRegistrationForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1️⃣ Renders all input fields and button
  test("renders registration form inputs and button", () => {
    render(<DriverRegistrationForm />);

    expect(screen.getByPlaceholderText(/full name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/phone/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/license number/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/vehicle type/i)).toBeInTheDocument();
    expect(screen.getByText(/eco mode/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
  });

  // 2️⃣ Handles input changes correctly
  test("updates form data on user input", () => {
    render(<DriverRegistrationForm />);

    const fullNameInput = screen.getByPlaceholderText("Full Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const phoneInput = screen.getByPlaceholderText("Phone");
    const passwordInput = screen.getByPlaceholderText("Password");
    const licenseInput = screen.getByPlaceholderText("License Number");
    const vehicleInput = screen.getByPlaceholderText("Vehicle Type");

    fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(phoneInput, { target: { value: "1234567890" } });
    fireEvent.change(passwordInput, { target: { value: "pass123" } });
    fireEvent.change(licenseInput, { target: { value: "LIC123" } });
    fireEvent.change(vehicleInput, { target: { value: "Car" } });

    expect(fullNameInput.value).toBe("John Doe");
    expect(emailInput.value).toBe("john@example.com");
    expect(phoneInput.value).toBe("1234567890");
    expect(passwordInput.value).toBe("pass123");
    expect(licenseInput.value).toBe("LIC123");
    expect(vehicleInput.value).toBe("Car");
  });

  // 3️⃣ Toggles eco mode checkbox
  test("toggles ecoEnabled checkbox", () => {
    render(<DriverRegistrationForm />);

    const ecoCheckbox = screen.getByRole("checkbox", { name: /eco mode/i });
    expect(ecoCheckbox.checked).toBe(false);

    fireEvent.click(ecoCheckbox);
    expect(ecoCheckbox.checked).toBe(true);

    fireEvent.click(ecoCheckbox);
    expect(ecoCheckbox.checked).toBe(false);
  });

  // 4️⃣ Successful registration shows success message and driver data
  test("shows success message and driver data on successful registration", async () => {
    const mockResponse = {
      data: {
        id: 1,
        fullName: "John Doe",
        email: "john@example.com",
        phone: "1234567890",
      },
    };

    axios.post.mockResolvedValueOnce(mockResponse);

    render(<DriverRegistrationForm />);

    fireEvent.change(screen.getByPlaceholderText("Full Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Phone"), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "pass123" },
    });
    fireEvent.change(screen.getByPlaceholderText("License Number"), {
      target: { value: "LIC123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Vehicle Type"), {
      target: { value: "Car" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
      expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
      expect(screen.getByText(/1234567890/i)).toBeInTheDocument();
    });
  });

  // 5️⃣ Handles registration error gracefully
  test("shows error message when registration fails", async () => {
    axios.post.mockRejectedValueOnce(new Error("Network Error"));

    render(<DriverRegistrationForm />);

    fireEvent.change(screen.getByPlaceholderText("Full Name"), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Phone"), {
      target: { value: "9998887777" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/registration failed\. please try again\./i)
      ).toBeInTheDocument()
    );
  });

  // 6️⃣ Replaces error with success on retry
  test("clears previous error and displays success after retry", async () => {
    // First call fails
    axios.post.mockRejectedValueOnce(new Error("Server Down"));
    // Second call succeeds
    axios.post.mockResolvedValueOnce({
      data: { id: 2, fullName: "Alice", email: "alice@example.com", phone: "5556667777" },
    });

    render(<DriverRegistrationForm />);

    fireEvent.change(screen.getByPlaceholderText("Full Name"), {
      target: { value: "Alice" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "alice@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Phone"), {
      target: { value: "5556667777" },
    });

    const registerButton = screen.getByRole("button", { name: /register/i });

    // First submit — failure
    fireEvent.click(registerButton);
    await waitFor(() =>
      expect(screen.getByText(/registration failed/i)).toBeInTheDocument()
    );

    // Second submit — success
    fireEvent.click(registerButton);
    await waitFor(() =>
      expect(screen.getByText(/registration successful/i)).toBeInTheDocument()
    );
  });
});
