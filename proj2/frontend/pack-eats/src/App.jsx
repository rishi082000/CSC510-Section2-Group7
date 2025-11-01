import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Browse from "./pages/customer/Browse";
import CartCheckout from "./pages/customer/CartCheckout";
import Quiz from "./pages/customer/Quiz";

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
    </Routes>
  );
};

export default App;
