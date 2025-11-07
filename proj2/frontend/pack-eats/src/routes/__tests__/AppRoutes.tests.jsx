// src/routes/__tests__/AppRoutes.test.jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppRoutes from "../AppRoutes";

// Mock all page components
jest.mock("../../pages/customer/Browse", () => () => (
    <div data-testid="browse-page">Browse Page</div>
));
jest.mock("../../pages/customer/CartCheckout", () => () => (
    <div data-testid="checkout-page">Checkout Page</div>
));
jest.mock("../../pages/customer/Quiz", () => () => (
    <div data-testid="quiz-page">Quiz Page</div>
));
jest.mock("../../pages/customer/Register", () => () => (
    <div data-testid="register-page">Register Page</div>
));
jest.mock("../../pages/customer/Login", () => () => (
    <div data-testid="login-page">Login Page</div>
));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate
}));

jest.mock("../../pages/restaurant/Login", () => () => (
    <div data-testid="restaurant-login-page">Restaurant Login Page</div>
));
jest.mock("../../pages/restaurant/Dashboard", () => () => (
    <div data-testid="restaurant-dashboard-page">Restaurant Dashboard Page</div>
));
jest.mock("../../pages/restaurant/Menu", () => () => (
    <div data-testid="restaurant-menu-page">Restaurant Menu Page</div>
));
jest.mock("../../pages/restaurant/Orders", () => () => (
    <div data-testid="restaurant-orders-page">Restaurant Orders Page</div>
));

const renderWithRouter = (ui, { route = "/" } = {}) => {
    window.history.pushState({}, "Test page", route);
    return render(
        <MemoryRouter initialEntries={[route]}>
            {ui}
        </MemoryRouter>
    );
};

describe("AppRoutes Component", () => {
    beforeEach(() => {
        mockNavigate.mockClear();
    });

    test("renders Browse page on root path", () => {
        renderWithRouter(<AppRoutes />);
        expect(screen.getByTestId("browse-page")).toBeInTheDocument();
    });

    test("renders Browse page on /browse path", () => {
        renderWithRouter(<AppRoutes />, { route: "/browse" });
        expect(screen.getByTestId("browse-page")).toBeInTheDocument();
    });

    test("renders CartCheckout page on /checkout path", () => {
        renderWithRouter(<AppRoutes />, { route: "/checkout" });
        expect(screen.getByTestId("checkout-page")).toBeInTheDocument();
    });

    test("renders Quiz page on /quiz path", () => {
        renderWithRouter(<AppRoutes />, { route: "/quiz" });
        expect(screen.getByTestId("quiz-page")).toBeInTheDocument();
    });

    test("renders Register page on /register path", () => {
        renderWithRouter(<AppRoutes />, { route: "/register" });
        expect(screen.getByTestId("register-page")).toBeInTheDocument();
    });

    test("renders Login page on /login path", () => {
        const mockOnLogin = jest.fn();
        renderWithRouter(<AppRoutes onLogin={mockOnLogin} />, { route: "/login" });
        expect(screen.getByTestId("login-page")).toBeInTheDocument();
    });
    test("renders RestaurantLogin page on /restaurantLogin path", () => {
        renderWithRouter(<AppRoutes />, { route: "/restaurantLogin" });
        expect(screen.getByTestId("restaurant-login-page")).toBeInTheDocument();
    });

    test("renders RestaurantDashboard page on /dashboard path", () => {
        renderWithRouter(<AppRoutes />, { route: "/dashboard" });
        expect(screen.getByTestId("restaurant-dashboard-page")).toBeInTheDocument();
    });

    test("renders RestaurantMenu page on /menu path", () => {
        renderWithRouter(<AppRoutes />, { route: "/menu" });
        expect(screen.getByTestId("restaurant-menu-page")).toBeInTheDocument();
    });

    test("renders RestaurantOrders page on /orders path", () => {
        renderWithRouter(<AppRoutes />, { route: "/orders" });
        expect(screen.getByTestId("restaurant-orders-page")).toBeInTheDocument();
    });

    test("unknown route redirects to /login (fallback)", () => {
        renderWithRouter(<AppRoutes />, { route: "/some/unknown/path" });
        expect(screen.getByTestId("login-page")).toBeInTheDocument();
    });
});
