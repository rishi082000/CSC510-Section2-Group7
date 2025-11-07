import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import {Link, MemoryRouter, useNavigate} from "react-router-dom";
import Navbar from "../Navbar";

const navigateMock = jest.fn();

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

beforeEach(() => {
    localStorage.clear();
    navigateMock.mockClear();
});

test("renders Login and Register links when no user is logged in", () => {
    render(
        <MemoryRouter>
            <Navbar />
        </MemoryRouter>);
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
});

test("renders username when user is provided and hides login/register", () => {
    localStorage.setItem('userIdentifier', 'rishi');

    render(
    <MemoryRouter>
        <Navbar />
    </MemoryRouter>);
    expect(screen.getByText(/rishi/i)).toBeInTheDocument();
    expect(screen.queryByText(/login/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/register/i)).not.toBeInTheDocument();
});

test("calls navigate and clears localStorage on logout", () => {
    localStorage.setItem('userIdentifier', 'rishi');

    render(
    <MemoryRouter>
        <Navbar />
    </MemoryRouter>);

    expect(screen.getByText(/rishi/i)).toBeInTheDocument();

    const logoutButton = screen.getByText(/logout/i);
    fireEvent.click(logoutButton);

    expect(localStorage.getItem('userIdentifier')).toBeNull();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
});

test("opens dropdown and shows User and Restaurant links with correct hrefs", () => {
    render(
        <MemoryRouter>
            <Navbar />
        </MemoryRouter>
    );

    // open dropdown
    const trigger = screen.getByText(/login \/ register/i);
    fireEvent.click(trigger);

    // verify items are visible
    const userLink = screen.getByText(/user login \/ register/i);
    const restaurantLink = screen.getByText(/restaurant login \/ register/i);
    expect(userLink).toBeInTheDocument();
    expect(restaurantLink).toBeInTheDocument();

    // verify hrefs
    const userHref = userLink.closest("a").getAttribute("href");
    const restaurantHref = restaurantLink.closest("a").getAttribute("href");
    expect(userHref).toBe("/login");
    expect(restaurantHref).toBe("/restaurantLogin");
});

test("clicking a dropdown item closes the dropdown", () => {
    render(
        <MemoryRouter>
            <Navbar />
        </MemoryRouter>
    );

    // open dropdown
    const trigger = screen.getByText(/login \/ register/i);
    fireEvent.click(trigger);

    const userLink = screen.getByText(/user login \/ register/i);
    fireEvent.click(userLink);

    // dropdown should close
    expect(screen.queryByText(/user login \/ register/i)).not.toBeInTheDocument();
});

test("clicking outside closes the dropdown", () => {
    render(
        <MemoryRouter>
            <Navbar />
        </MemoryRouter>
    );

    // open dropdown
    const trigger = screen.getByText(/login \/ register/i);
    fireEvent.click(trigger);
    expect(screen.getByText(/user login \/ register/i)).toBeInTheDocument();

    // simulate outside click
    fireEvent.mouseDown(document);
    expect(screen.queryByText(/user login \/ register/i)).not.toBeInTheDocument();
});
