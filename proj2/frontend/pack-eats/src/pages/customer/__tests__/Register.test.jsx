import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import Register from '../Register';
import {MemoryRouter} from "react-router-dom";

jest.mock('axios');

describe('Register component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders the registration form', () => {
        render(<MemoryRouter><Register /></MemoryRouter>);

        expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Phone Number')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
    });

    test('handles successful registration', async () => {
        // Mock the successful response from backend
        axios.post.mockResolvedValueOnce({
            data: "Registration successful!"
        });

        render(<MemoryRouter><Register /></MemoryRouter>);

        // Fill out the form
        fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByPlaceholderText('Email Address'), { target: { value: 'john.doe@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Phone Number'), { target: { value: '1234567890' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password123' } });

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /Register/i }));

        // Wait for the success message
        await waitFor(() => {
            expect(screen.getByText("Registration successful!")).toBeInTheDocument();
        });

        // Verify the API call
        expect(axios.post).toHaveBeenCalledWith(
            "http://localhost:8080/api/customers/register",
            {
                name: "John Doe",
                email: "john.doe@example.com",
                phone: "1234567890",
                password: "password123",
                confirmPassword: "password123"
            }
        );
    });

    test('handles registration with existing email', async () => {
        axios.post.mockRejectedValueOnce({
            response: {
                data: "Email already exists"
            }
        });

        render(<MemoryRouter><Register /></MemoryRouter>);

        fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: 'Jane Doe' } });
        fireEvent.change(screen.getByPlaceholderText('Email Address'), { target: { value: 'existing@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Phone Number'), { target: { value: '9876543210' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /Register/i }));

        await waitFor(() => {
            expect(screen.getByText('Registration failed. Please try again.')).toBeInTheDocument();
        });
    });

    test('handles registration with existing phone number', async () => {
        axios.post.mockRejectedValueOnce({
            response: {
                data: "Phone number already exists"
            }
        });

        render(<MemoryRouter><Register /></MemoryRouter>);

        fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: 'New User' } });
        fireEvent.change(screen.getByPlaceholderText('Email Address'), { target: { value: 'new@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Phone Number'), { target: { value: 'existing-phone' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /Register/i }));

        await waitFor(() => {
            expect(screen.getByText('Registration failed. Please try again.')).toBeInTheDocument();
        });
    });

    test('handles failed registration', async () => {
        // Mock the error response from backend
        axios.post.mockRejectedValueOnce({
            response: {
                data: "Email already exists"
            }
        });

        render(<MemoryRouter><Register /></MemoryRouter>);

        // Fill out the form
        fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: 'Jane Doe' } });
        fireEvent.change(screen.getByPlaceholderText('Email Address'), { target: { value: 'jane.doe@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Phone Number'), { target: { value: '0987654321' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password123' } });

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /Register/i }));

        // Wait for the error message
        await waitFor(() => {
            expect(screen.getByText('Registration failed. Please try again.')).toBeInTheDocument();
        });
    });

    test('shows an error if passwords do not match', async () => {
        render(<MemoryRouter><Register /></MemoryRouter>);

        // Fill out the form with mismatched passwords
        fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByPlaceholderText('Email Address'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Phone Number'), { target: { value: '1234567890' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password456' } });

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /Register/i }));

        // Check for the error message
        await waitFor(() => {
            expect(screen.getByText('Passwords do not match!')).toBeInTheDocument();
        });

        // Verify that axios.post was not called
        expect(axios.post).not.toHaveBeenCalled();
    });
});
