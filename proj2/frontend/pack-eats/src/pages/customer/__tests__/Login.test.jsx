import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../Login";
import {MemoryRouter} from "react-router-dom";
import axios from 'axios';


jest.mock("axios");

describe("Login Component", () => {
    // Reset mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        delete window.location; // mock window.location.href
        window.location = { href: "" };
    });

    test("renders login form fields", () => {
        render(<MemoryRouter><Login /></MemoryRouter>);

        expect(screen.getByText(/login to your account/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/enter your email or phone/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    });

    test("shows success message and stores data on successful login", async () => {
        axios.post.mockResolvedValueOnce({ data: "Login successful!" });

        render(<MemoryRouter><Login /></MemoryRouter>);

        // Fill input fields
        fireEvent.change(screen.getByPlaceholderText(/enter your email or phone/i), {
            target: { value: "test@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
            target: { value: "password123" },
        });

        fireEvent.click(screen.getByRole("button", { name: /login/i }));

        // Wait for async axios call
        await waitFor(() =>
            expect(screen.getByText(/login successful/i)).toBeInTheDocument()
        );

        // Check that localStorage was updated
        expect(localStorage.getItem("isLoggedIn")).toBe("true");
        expect(localStorage.getItem("userIdentifier")).toBe("test@example.com");

        // Check redirect
        expect(window.location.href).toBe("/");
    });

    test("shows error for invalid password", async () => {
        axios.post.mockRejectedValueOnce({
            response: { data: "Invalid password" }
        });

        render(<MemoryRouter><Login /></MemoryRouter>);

        fireEvent.change(screen.getByPlaceholderText(/enter your email or phone/i), {
            target: { value: "test@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
            target: { value: "wrongpassword" },
        });

        fireEvent.click(screen.getByRole("button", { name: /login/i }));

        await waitFor(() => {
            expect(screen.getByText(/invalid password/i)).toBeInTheDocument();
        });

        expect(localStorage.getItem("isLoggedIn")).toBe(null);
        expect(window.location.href).not.toBe("/");
    });

    test("shows error for non-existent user", async () => {
        axios.post.mockRejectedValueOnce({
            response: { data: "User not found" }
        });

        render(<MemoryRouter><Login /></MemoryRouter>);

        fireEvent.change(screen.getByPlaceholderText(/enter your email or phone/i), {
            target: { value: "nonexistent@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
            target: { value: "password123" },
        });

        fireEvent.click(screen.getByRole("button", { name: /login/i }));

        await waitFor(() => {
            expect(screen.getByText(/user not found/i)).toBeInTheDocument();
        });

        expect(localStorage.getItem("isLoggedIn")).toBe(null);
        expect(window.location.href).not.toBe("/");
    });

    test("shows error message when login fails", async () => {
        axios.post.mockRejectedValueOnce({
            response: { data: "Invalid credentials" },
        });

        render(<MemoryRouter><Login /></MemoryRouter>);

        fireEvent.change(screen.getByPlaceholderText(/enter your email or phone/i), {
            target: { value: "wrong@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
            target: { value: "wrongpass" },
        });

        fireEvent.click(screen.getByRole("button", { name: /login/i }));

        await waitFor(() =>
            expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
        );

        // Should not redirect
        expect(window.location.href).not.toBe("/");
    });

    test("shows 'Server not reachable' message when no response", async () => {
        axios.post.mockRejectedValueOnce({});

        render(<MemoryRouter><Login /></MemoryRouter>);

        fireEvent.change(screen.getByPlaceholderText(/enter your email or phone/i), {
            target: { value: "test@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
            target: { value: "password123" },
        });

        fireEvent.click(screen.getByRole("button", { name: /login/i }));

        await waitFor(() =>
            expect(screen.getByText(/server not reachable/i)).toBeInTheDocument()
        );
    });
});
