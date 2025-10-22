// src/pages/customer/Quiz.jsx
import React, { useState } from "react";
import { menuItems } from "../../data/menuItems.jsx";
import "../../Styles/global.css";

function Quiz() {
  const [tempAnswers, setTempAnswers] = useState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    q6: ""
  });

  const [submittedTags, setSubmittedTags] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const quizQuestions = [
    { id: "q1", question: "What type of food do you prefer?", options: ["Vegetarian", "Vegan", "Non-Vegetarian"] },
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

    // Custom Validation Check
    const unanswered = Object.values(tempAnswers).some(val => val === "");
    if (unanswered) {
      alert("Please answer all the questions before submitting!");
      return;
    }

    let answersList = [];
    Object.entries(tempAnswers).forEach(([qid, val]) => {
      if (qid === "q6") {
        const mapping = {
          "Baked & Light": ["Baked", "LowCal"],
          "Roasted & Flavorful": ["Roasted", "LowCal"],
          "Grilled & Bold": ["Grilled", "HighCal"],
          "Fried & Crispy": ["Fried", "HighCal"]
        };
        answersList = answersList.concat(mapping[val]);
      } else {
        answersList.push(val);
      }
    });
    setSubmittedTags(answersList);
  };

  const getRecommendedItems = () => {
    if (submittedTags.length === 0) return [];
    const basePreference = submittedTags[0];
    let filtered = menuItems.filter(item => item.recommendation_tags.includes(basePreference));
    filtered.sort((a, b) => {
      const aMatches = a.recommendation_tags.filter(tag => submittedTags.includes(tag)).length;
      const bMatches = b.recommendation_tags.filter(tag => submittedTags.includes(tag)).length;
      return bMatches - aMatches;
    });
    return filtered.slice(0, 5);
  };

  const recommendedItems = getRecommendedItems();

  const getItemQuantity = (itemId) => cartItems.find(ci => ci.id === itemId)?.quantity || 0;

  const handleUpdateCart = (item, action) => {
    setCartItems(prevCart => {
      const existingIndex = prevCart.findIndex(ci => ci.id === item.id);
      if (action === 'ADD' || action === 'INCREMENT') {
        if (existingIndex >= 0) 
          return prevCart.map((ci, idx) => idx === existingIndex ? { ...ci, quantity: ci.quantity + 1 } : ci);
        else 
          return [...prevCart, { ...item, quantity: 1 }];
      } else if (action === 'DECREMENT' && existingIndex >= 0) {
        return prevCart.map((ci, idx) => idx === existingIndex ? { ...ci, quantity: ci.quantity - 1 } : ci)
                       .filter(ci => ci.quantity > 0);
      }
      return prevCart;
    });
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="quiz-container">
      {/* Header remains outside the content wrapper */}
      <div className="quiz-header">
        <h2>PACKEats</h2>
        <div className="quiz-cart-summary">Items: {totalItems} | Total: ${totalPrice.toFixed(2)}</div>
      </div>

      {/* --- Main Content Wrapper for the two columns --- */}
      <div className="main-content-wrapper">
          
        {/* === 1st Element (Left Column): Quiz & Recommendations === */}
        <div className="quiz-form-area">
          <p className="quiz-intro">
            Confused on what dish to order? Answer a few fun questions and we'll recommend dishes you'll love.
          </p>

          <form onSubmit={handleSubmit} className="quiz-form">
            {quizQuestions.map((q) => (
              <div key={q.id} className="quiz-question">
                <p className="quiz-question-text"><strong>{q.question}</strong></p>
                <div className="quiz-options">
                  {q.options.map((opt) => (
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
            <button type="submit" className="quiz-submit-btn">Submit</button>
          </form>

          {submittedTags.length > 0 && (
            <div className="quiz-recommendations">
              <h3 className="quiz-recommendations-title">Top Recommended Dishes:</h3>
              {recommendedItems.map(item => {
                const currentQuantity = getItemQuantity(item.id);
                const cartItem = cartItems.find(ci => ci.id === item.id) || item;
                
                return (
                  <div key={item.id} className="quiz-menu-item">
                    <p className="quiz-restaurant-name"><strong>Restaurant:</strong> {item.restaurant_name}</p>
                    <p className="quiz-dish-name"><strong>Dish:</strong> {item.name}</p>
                    <p className="quiz-dish-description">{item.description}</p>
                    <p className="quiz-dish-price"><strong>Price:</strong> ${item.price.toFixed(2)}</p>

                    <div className="quiz-cart-buttons">
                      {currentQuantity === 0 && <span>Add to Cart:</span>}

                      {currentQuantity === 0 ? (
                        <button onClick={() => handleUpdateCart(item, 'ADD')} className="add-plus-btn">+</button>
                      ) : (
                        <>
                          <button onClick={() => handleUpdateCart(cartItem, 'DECREMENT')}>-</button>
                          <span>{currentQuantity}</span>
                          <button onClick={() => handleUpdateCart(cartItem, 'ADD')}>+</button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* === 2nd Element (Right Column): Cart (Sticky Panel) === */}
        <div className="side-panel">
          {cartItems.length > 0 && (
            <div className="quiz-cart">
              <h3>Cart</h3>
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <p>{item.name} - ${item.price.toFixed(2)}</p>
                  <div className="cart-item-controls">
                    <button onClick={() => handleUpdateCart(item, 'DECREMENT')}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleUpdateCart(item, 'ADD')}>+</button>
                  </div>
                </div>
              ))}
              <p>Total: ${totalPrice.toFixed(2)}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Quiz;
