import React, { useState } from "react";
import axios from "axios";

const DriverRegistrationForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    licenseNumber: "",
    vehicleType: "",
    ecoEnabled: false,
  });

  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/drivers/register", formData);
      setResponse(res.data); // backend sends driver object
      setError(null);
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Driver Registration</h2>
      <form onSubmit={handleSubmit}>
        <input name="fullName" placeholder="Full Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="phone" placeholder="Phone" onChange={handleChange} />
        <input name="password" placeholder="Password" type="password" onChange={handleChange} />
        <input name="licenseNumber" placeholder="License Number" onChange={handleChange} />
        <input name="vehicleType" placeholder="Vehicle Type" onChange={handleChange} />
        <label>
          <input
            type="checkbox"
            name="ecoEnabled"
            checked={formData.ecoEnabled}
            onChange={handleChange}
          />
          Eco Mode
        </label>
        <button type="submit">Register</button>
      </form>

      {/* ✅ FIX: Display response safely */}
      {response && (
        <div style={{ marginTop: "20px" }}>
          <h3>Registration Successful!</h3>
          <p>ID: {response.id}</p>
          <p>Name: {response.fullName}</p>
          <p>Email: {response.email}</p>
          <p>Phone: {response.phone}</p>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default DriverRegistrationForm;
