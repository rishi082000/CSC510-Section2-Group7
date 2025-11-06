import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // for generating unique id if needed

const CartCheckout = () => {
  const navigate = useNavigate();

  // Replace this with actual logged-in user ID in a real app
  const customerId = "20dc2f03-4817-4e15-80eb-ff911a141007";

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

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;

    try {
      for (const item of cartItems) {
        const orderPayload = {
          id: Math.floor(Math.random() * 1000000), // random integer ID
          customer_id: customerId,
          restaurant_id: item.restaurant_id,
          total_amount: item.price * item.quantity,
          items: [
            {
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              menu_item_id: item.id, // inside items array
            },
          ],
          menu_item_id: item.id, // root menu_item_id
          status: "PLACED",
        };

        console.log("📦 Sending order payload:", orderPayload);

        await axios.post(
          "http://localhost:8080/api/orders/place",
          orderPayload,
          { headers: { "Content-Type": "application/json" } }
        );
      }

      setOrderPlaced(true);
      localStorage.removeItem("packeats_cart");
      setCartItems([]);
    } catch (err) {
      if (err.response) {
        console.error("Backend error response:", err.response.data);
      } else {
        console.error("Error:", err.message);
      }
      alert("Failed to place order. Please check console for details.");
    }
  };

  return (
    <div style={{ width: "95%", maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      {/* Header */}
      <div className="quiz-header" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "15px" }}>
        <button className="back-btn" onClick={() => navigate("/browse")}>
          ← Return to Browse
        </button>
        <h2 style={{ margin: "0 auto" }}>PackEats</h2>
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
                    marginBottom: "12px"
                  }}
                >
                  <img
                    src={`/assets/${item.name}.jpg`}
                    alt={item.name}
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "8px"
                    }}
                  />
                  <div className="menu-list-info">
                    <p className="menu-list-name">{item.name}</p>
                    <p className="quiz-restaurant-name">{item.restaurant_name}</p>
                    {item.food_type && (
                      <span
                        className={`menu-list-food-type ${item.food_type.replace(" ", "-")}`}
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
          <div className="checkout-section delivery-options" style={{ marginTop: "20px" }}>
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
          <div className="checkout-section payment-options" style={{ marginTop: "20px" }}>
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
          <div className="checkout-section summary" style={{ marginTop: "20px" }}>
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
