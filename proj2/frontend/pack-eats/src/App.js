import logo from './logo.svg';
import './App.css';
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/customer/Register";
import Browse from "./pages/customer/Browse";
import Quiz from "./pages/customer/Quiz";

const App = () => {
  const [page, setPage] = useState("browse"); // 'browse' or 'quiz'

  return (
    <Router>
      <Routes>
        {/* Register route */}
        <Route path="/register" element={<Register />} />

        {/* Home route */}
        <Route
          path="/"
          element={
            <div>
              {page === "browse" && <Browse onTakeQuiz={() => setPage("quiz")} />}
              {page === "quiz" && <Quiz onReturnToBrowse={() => setPage("browse")} />}
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
