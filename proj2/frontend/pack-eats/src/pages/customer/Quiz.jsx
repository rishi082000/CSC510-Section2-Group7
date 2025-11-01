import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cart from "./Cart";
import "../../styles/global.css";

function Quiz() {
  const navigate = useNavigate();

  const [tempAnswers, setTempAnswers] = useState({
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    q6: ""
  });

  const [submittedTags, setSubmittedTags] = useState([]);
  const [recommendedItems, setRecommendedItems] = useState([]);

  // ✅ Persistent Cart
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("packeats_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("packeats_cart", JSON.stringify(cartItems));
    } catch (err) {
      console.error("Failed to save cart:", err);
    }
  }, [cartItems]);

  const quizQuestions = [
    { id: "q2", question: "Your mood today?", options: ["Chill", "Adventurous", "Cozy"] },
    { id: "q3", question: "Spice preference?", options: ["Mild", "Kick", "Fiery"] },
    { id: "q4", question: "Meal craving?", options: ["Snack Attack", "Big-Bite"] },
    { id: "q5", question: "Favorite flavor?", options: ["Sweet", "Savory", "Spicy", "Cheesy"] },
    { id: "q6", question: "Choose your flavor delivery method", options: ["Baked & Light", "Roasted & Flavorful", "Grilled & Bold", "Fried & Crispy"] }
  ];

  const handleChange = (questionId, value) => {
    setTempAnswers({ ...tempAnswers, [questionId]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const unanswered = Object.values(tempAnswers).some(val => val === "");
    if (unanswered) {
      alert("Please answer all the questions before submitting!");
      return;
    }

    // Build tags from remaining answers (exclude q1)
    let tags = [];
    Object.entries(tempAnswers).forEach(([qid, val]) => {
      if (qid === "q6") {
        const mapping = {
          "Baked & Light": ["Baked", "LowCal"],
          "Roasted & Flavorful": ["Roasted", "LowCal"],
          "Grilled & Bold": ["Grilled", "HighCal"],
          "Fried & Crispy": ["Fried", "HighCal"]
        };
        tags = tags.concat(mapping[val]);
      } else {
        tags.push(val);
      }
    });

    setSubmittedTags(tags);
  };

  useEffect(() => {
    if (submittedTags.length === 0) return;

    const fetchMenuAndFilter = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/restaurants/menu", {
          params: { restaurantName: "" } // fetch all restaurants
        });
        const allMenuItems = response.data;

        // Score items by matching submittedTags
        const scored = allMenuItems.map(item => {
          const tags = item.recommendation_tags || [];
          const matchCount = tags.filter(tag => submittedTags.includes(tag)).length;
          return { item, matchCount };
        });

        scored.sort((a, b) => b.matchCount - a.matchCount);

        const top5 = scored.slice(0, 5).map(s => s.item);

        setRecommendedItems(top5);
      } catch (err) {
        console.error("Error fetching menu items:", err);
        setRecommendedItems([]);
      }
    };

    fetchMenuAndFilter();
  }, [submittedTags]);

  const getItemQuantity = (itemId) =>
    cartItems.find(ci => ci.id === itemId)?.quantity || 0;

  const handleUpdateCart = (item, action) => {
    setCartItems(prevCart => {
      const existingIndex = prevCart.findIndex(ci => ci.id === item.id);
      if (action === "ADD" || action === "INCREMENT") {
        if (existingIndex >= 0)
          return prevCart.map((ci, idx) =>
            idx === existingIndex ? { ...ci, quantity: ci.quantity + 1 } : ci
          );
        else return [...prevCart, { ...item, quantity: 1 }];
      } else if (action === "DECREMENT" && existingIndex >= 0) {
        return prevCart
          .map((ci, idx) =>
            idx === existingIndex ? { ...ci, quantity: ci.quantity - 1 } : ci
          )
          .filter(ci => ci.quantity > 0);
      }
      return prevCart;
    });
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="quiz-container">
      <div className="quiz-header" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button onClick={() => navigate("/browse")} className="back-btn">
            ← Return to Browse
          </button>
          <h2>PACKEats</h2>
        </div>
        <div className="quiz-cart-summary">
          Items: {totalItems} | Total: ${totalPrice.toFixed(2)}
        </div>
      </div>

      <div className="main-content-wrapper">
        <div className="quiz-form-area">
          <p className="quiz-intro">
            Confused on what dish to order? Answer a few fun questions and we'll
            recommend dishes you'll love.
          </p>

          <form onSubmit={handleSubmit} className="quiz-form">
            {quizQuestions.map(q => (
              <div key={q.id} className="quiz-question">
                <p className="quiz-question-text">
                  <strong>{q.question}</strong>
                </p>
                <div className="quiz-options">
                  {q.options.map(opt => (
                    <label
                      key={opt}
                      className={`quiz-option-label ${tempAnswers[q.id] === opt ? "selected-option" : ""}`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={opt}
                        checked={tempAnswers[q.id] === opt}
                        onChange={() => handleChange(q.id, opt)}
                        className="quiz-option-input"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button type="submit" className="quiz-submit-btn">
              Submit
            </button>
          </form>

          {recommendedItems.length > 0 && (
            <div className="quiz-recommendations menu-list">
              <h3 className="quiz-recommendations-title">
                Top Recommended Dishes:
              </h3>

              {recommendedItems.map(item => {
                const currentQuantity = getItemQuantity(item.id);
                const cartItem = cartItems.find(ci => ci.id === item.id) || item;

                return (
                  <div key={item.id} className="menu-list-item">
                    <img
                      src={`/assets/${item.name}.jpg`}
                      alt={item.name}
                      className="menu-list-image"
                    />
                    <div className="menu-list-info">
                      <p className="menu-list-name">{item.name}</p>
                      <p className="menu-list-description">{item.description}</p>

                      {/* ✅ Display food_type from backend */}
                      <p className={`menu-list-food-type ${item.food_type.replace(/\s+/g, "-")}`}>{item.food_type}</p>

                      <p className="quiz-dish-price">${item.price.toFixed(2)}</p>

                      <div className="quiz-cart-buttons">
                        {currentQuantity === 0 && <span>Add to Cart:</span>}
                        {currentQuantity === 0 ? (
                          <button
                            onClick={() => handleUpdateCart(item, "ADD")}
                            className="add-plus-btn"
                          >
                            +
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleUpdateCart(cartItem, "DECREMENT")}
                            >
                              -
                            </button>
                            <span>{currentQuantity}</span>
                            <button
                              onClick={() => handleUpdateCart(cartItem, "ADD")}
                            >
                              +
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {totalItems > 0 && (
                <button
                  onClick={() => navigate("/checkout")}
                  className="take-quiz-btn"
                  style={{ marginTop: "15px" }}
                >
                  Go to Checkout →
                </button>
              )}
            </div>
          )}
        </div>

        <div className="side-panel">
          <Cart
            cartItems={cartItems}
            totalPrice={totalPrice}
            handleUpdateCart={handleUpdateCart}
          />
        </div>
      </div>
    </div>
  );
}

export default Quiz;
