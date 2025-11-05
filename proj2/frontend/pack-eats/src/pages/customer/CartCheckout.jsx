import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

const CartCheckout = () => {
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState(() => {
        try {
            const saved = localStorage.getItem("packeats_cart");
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [deliveryMethod, setDeliveryMethod] = useState("standard");
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [orderPlaced, setOrderPlaced] = useState(false);

    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );
    const tax = subtotal * 0.0725;
    const deliveryFee = deliveryMethod === "eco" ? 2 : 5;
    const total = subtotal + tax + deliveryFee;

    const handlePlaceOrder = () => {
        setOrderPlaced(true);
        localStorage.removeItem("packeats_cart");
        setCartItems([]);
    };

    return (
        <div
            style={{
                width: "95%",
                maxWidth: "1200px",
                margin: "0 auto",
                padding: "20px",
            }}
        >
            {/* Header */}
            <div
                className="quiz-header"
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                }}
            >
                <button className="back-btn" onClick={() => navigate("/browse")}>
                    ← Return to Browse
                </button>
            </div>

            {orderPlaced ? (
                <div style={{ marginTop: "20px" }}>
                    <h2>✅ Payment Successful</h2>
                    <p>Your food will be delivered soon.</p>
                    <p>
                        Your cart is now <strong>empty</strong>. You can continue browsing.
                    </p>
                    <button
                        className="take-quiz-btn"
                        onClick={() => navigate("/browse")}
                        style={{ marginTop: "15px" }}
                    >
                        ← Go Back to Browse
                    </button>
                </div>
            ) : (
                <>
                    {/* Cart Items */}
                    <div style={{ marginTop: "20px" }}>
                        <h2>Your Cart</h2>
                        {cartItems.length === 0 ? (
                            <p>Your cart is empty.</p>
                        ) : (
                            cartItems.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="menu-list-item"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "15px",
                                        marginBottom: "12px",
                                    }}
                                >
                                    <img
                                        src={`/assets/${item.name}.jpg`}
                                        alt={item.name}
                                        style={{
                                            width: "120px",
                                            height: "120px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                        }}
                                    />
                                    <div className="menu-list-info">
                                        <p className="menu-list-name">{item.name}</p>
                                        <p className="quiz-restaurant-name">
                                            {item.restaurant_name}
                                        </p>

                                        {/* Food Type */}
                                        {item.food_type && (
                                            <span
                                                className={`menu-list-food-type ${item.food_type.replace(
                                                    " ",
                                                    "-"
                                                )}`}
                                            >
                        {item.food_type}
                      </span>
                                        )}

                                        <p>
                                            Quantity: {item.quantity} × ${item.price.toFixed(2)}
                                        </p>
                                        <p>Total: ${(item.quantity * item.price).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Delivery Method */}
                    <div
                        className="checkout-section delivery-options"
                        style={{ marginTop: "20px" }}
                    >
                        <h3>Delivery Method</h3>
                        <label className="delivery-option eco">
                            <input
                                type="radio"
                                value="eco"
                                checked={deliveryMethod === "eco"}
                                onChange={() => setDeliveryMethod("eco")}
                            />
                            <span>Eco Delivery ($2)</span>
                        </label>
                        <label className="delivery-option standard">
                            <input
                                type="radio"
                                value="standard"
                                checked={deliveryMethod === "standard"}
                                onChange={() => setDeliveryMethod("standard")}
                            />
                            <span>Standard Delivery ($5)</span>
                        </label>
                    </div>

                    {/* Payment Method */}
                    <div
                        className="checkout-section payment-options"
                        style={{ marginTop: "20px" }}
                    >
                        <h3>Payment Method</h3>
                        <label className="payment-option card">
                            <input
                                type="radio"
                                value="card"
                                checked={paymentMethod === "card"}
                                onChange={() => setPaymentMethod("card")}
                            />
                            <span>Credit / Debit Card</span>
                        </label>
                        <label className="payment-option netbanking">
                            <input
                                type="radio"
                                value="netbanking"
                                checked={paymentMethod === "netbanking"}
                                onChange={() => setPaymentMethod("netbanking")}
                            />
                            <span>Netbanking</span>
                        </label>
                        <label className="payment-option cod">
                            <input
                                type="radio"
                                value="cod"
                                checked={paymentMethod === "cod"}
                                onChange={() => setPaymentMethod("cod")}
                            />
                            <span>Cash on Delivery</span>
                        </label>
                    </div>

                    {/* Order Summary */}
                    <div
                        className="checkout-section summary"
                        style={{ marginTop: "20px" }}
                    >
                        <h3>Order Summary</h3>
                        <p>Subtotal: ${subtotal.toFixed(2)}</p>
                        <p>Tax (7.25%): ${tax.toFixed(2)}</p>
                        <p>Delivery Fee: ${deliveryFee.toFixed(2)}</p>
                        <h3>Total: ${total.toFixed(2)}</h3>
                    </div>

                    {/* Place Order Button */}
                    {cartItems.length > 0 && (
                        <button
                            className="take-quiz-btn"
                            onClick={handlePlaceOrder}
                            style={{ marginTop: "15px" }}
                        >
                            Place Order
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default CartCheckout;

