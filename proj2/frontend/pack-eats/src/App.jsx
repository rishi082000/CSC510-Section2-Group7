import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Browse from "./pages/customer/Browse";
import CartCheckout from "./pages/customer/CartCheckout";
import Quiz from "./pages/customer/Quiz";
import Login from "./pages/restaurant/Login";
import Dashboard from "./pages/restaurant/Dashboard";
import Menu from "./pages/restaurant/Menu";
import Orders from "./pages/restaurant/Orders";

const App = () => {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
};

// ✅ Separate component to use `useNavigate`
const AppRoutes = () => {
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
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes> // ✅ missing closing tag previously
    );
};

export default App;
