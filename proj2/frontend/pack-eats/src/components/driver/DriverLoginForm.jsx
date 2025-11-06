import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- import useNavigate
import "../../styles/DriverLoginForm.css";

export default function DriverLoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); // <-- initialize navigate

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Mock API call — later connect this to your Spring endpoint
      await new Promise((res) => setTimeout(res, 800));
      setMessage("Login successful!");

      // <-- Navigate to DriverDashboard after successful login
      navigate("/driver/dashboard");
    } catch (err) {
      setMessage("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
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
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      {message && <p className="form-message">{message}</p>}
    </form>
  );
}
