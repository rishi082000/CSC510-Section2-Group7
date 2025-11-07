import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/DriverLoginForm.css";

export default function DriverLoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch("http://localhost:8080/api/drivers/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Login failed
        setMessageType("error");
        setMessage(data.message || "Invalid email or password");
        return;
      }

      // Login successful - validate the response data
      if (data && data.id && data.email) {
        // Store driver data in localStorage
        localStorage.setItem("driverData", JSON.stringify(data));
        
        setMessageType("success");
        setMessage("Login successful! Redirecting...");
        
        // Navigate to dashboard after a short delay
        setTimeout(() => {
          navigate("/driver/dashboard");
        }, 1000);
      } else {
        setMessageType("error");
        setMessage("Invalid response from server");
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessageType("error");
      setMessage("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleRegisterClick() {
    navigate("/driver/register");
  }

  return (
    <div className="driver-login-container">
      <form onSubmit={handleSubmit} className="driver-login-form">
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading} className="login-btn">
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && (
          <p className={`form-message ${messageType}`}>
            {message}
          </p>
        )}

        <div className="register-section">
          <p>Don't have an account?</p>
          <button 
            type="button" 
            onClick={handleRegisterClick} 
            className="register-link-btn"
            disabled={loading}
          >
            Register as Driver
          </button>
        </div>
      </form>
    </div>
  );
}