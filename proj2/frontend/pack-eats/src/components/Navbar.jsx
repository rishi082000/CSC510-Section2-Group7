import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
    const [username, setUsername] = useState(localStorage.getItem("username"));
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    // Listen for storage changes (when user logs in/out elsewhere)
    useEffect(() => {
        const handleStorageChange = () => {
            setUsername(localStorage.getItem("userIdentifier"));
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // Sync username on mount
    useEffect(() => {
        setUsername(localStorage.getItem("userIdentifier"));
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("userIdentifier");
        setUsername(null);
        navigate("/");
    };

    const toggleDropdown = () => {
        setShowDropdown((prev) => !prev);
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <h2>PACKEats</h2>
            </div>

            <div className="navbar-right">
                {username ? (
                    <div className="user-info">
                        <span>Hello, {username}</span>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                ) : (
                    <div className="dropdown-container" ref={dropdownRef}>
                        <div className="auth-link" onClick={toggleDropdown}>
                            <FaUserCircle className="auth-icon" />
                            <span>Login / Register ▾</span>
                        </div>

                        {showDropdown && (
                            <div className="dropdown-menu">
                                <Link
                                    to="/login"
                                    className="dropdown-item"
                                    onClick={() => setShowDropdown(false)}
                                >
                                    User Login / Register
                                </Link>
                                <Link
                                    to="/restaurantLogin"
                                    className="dropdown-item"
                                    onClick={() => setShowDropdown(false)}
                                >
                                    Restaurant Login / Register
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
