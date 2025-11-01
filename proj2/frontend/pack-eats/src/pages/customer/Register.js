import React, { useState } from "react";
import axios from "axios";

function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const response = await axios.post("http://localhost:8080/api/customers/register", formData);
            setMessage("Registration successful!");
            setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
                phone: "",
            });
        } catch (error) {
            console.error(error);
            setMessage("Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2 className="auth-header">Create Your Account</h2>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-orange-400"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-orange-400"
                    />

                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-orange-400"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-orange-400"
                    />

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-orange-400"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="auth-form-button"
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account? <a href="/login">Log in</a>
                </div>

                {message && (
                    <p className={"auth-message"}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}

export default Register;