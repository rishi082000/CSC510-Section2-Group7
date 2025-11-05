import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import Browse from "../pages/customer/Browse";
import CartCheckout from "../pages/customer/CartCheckout";
import Quiz from "../pages/customer/Quiz";
import Register from "../pages/customer/Register";
import Login from "../pages/customer/Login";
import RestaurantLogin from "../pages/restaurant/Login";
import RestaurantDashboard from "../pages/restaurant/Dashboard";
import RestaurantMenu from "../pages/restaurant/Menu";
import RestaurantOrders from "../pages/restaurant/Orders";
import React from "react";

const AppRoutes = ({ onLogin }) => {
    const navigate = useNavigate();

    const handleTakeQuiz = () => {
        navigate("/quiz");
    };

    return (
        <Routes>
            <Route path="/" element={<Browse onTakeQuiz={handleTakeQuiz} />} />
            <Route path="/browse" element={<Browse onTakeQuiz={handleTakeQuiz} />} />
            <Route path="/checkout" element={<CartCheckout />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/login" element={<Login onLogin={onLogin} />} />
            <Route path="/register" element={<Register />} />

            {/* Restaurant-specific routes */}
            <Route path="/restaurantLogin" element={<RestaurantLogin />} />
            <Route path="/dashboard" element={<RestaurantDashboard />} />
            <Route path="/menu" element={<RestaurantMenu />} />
            <Route path="/orders" element={<RestaurantOrders />} />

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
};

export default AppRoutes;