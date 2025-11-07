import { Link } from "react-router-dom";

function Cart({ cartItems, totalPrice, handleUpdateCart }) {
  if (cartItems.length === 0) {
    return (
      <div className="quiz-cart empty-cart">
        <h3>Cart</h3>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="quiz-cart">
      <h3>Cart</h3>
      {cartItems.map((item) => (
        <div key={item.id} className="cart-item">
          <p>
            {item.name} - ${item.price.toFixed(2)}
          </p>
          <div className="cart-item-controls">
            <button onClick={() => handleUpdateCart(item, "DECREMENT")}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => handleUpdateCart(item, "ADD")}>+</button>
          </div>
        </div>
      ))}
      <p>
        <strong>Total: ${totalPrice.toFixed(2)}</strong>
      </p>

      {/* ✅ Checkout Link */}
      <Link to="/checkout" className="take-quiz-btn" style={{ textAlign: "center", display: "block" }}>
        Go to Checkout →
      </Link>
    </div>
  );
}

export default Cart;
