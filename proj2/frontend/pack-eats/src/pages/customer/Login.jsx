import React, { useState } from "react";
import axios from "axios";

export default function Login() {
    const [identifier, setIdentifier] = useState(""); // can be email or phone
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            // Send request to your backend
            const response = await axios.post("http://localhost:8080/api/customers/login", {
                identifier,
                password,
            });

            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userIdentifier", identifier);

            setMessage(response.data || "Login successful!");

            window.location.href = "/";
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data || "Login failed");
            } else {
                setMessage("Server not reachable");
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2 className="auth-header">
                    Login to Your Account
                </h2>

                <form onSubmit={handleLogin} className="auth-form">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Email or Phone
                        </label>
                        <input
                            type="text"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder="Enter your email or phone"
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                        Login
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account? <a href="/proj2/frontend/pack-eats/src/pages/customer/Register">Register</a>
                </div>

                {message && (
                    <p
                        className={`mt-4 text-center font-medium ${
                            message.includes("successful") ? "text-green-600" : "text-red-500"
                        }`}
                    >
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}