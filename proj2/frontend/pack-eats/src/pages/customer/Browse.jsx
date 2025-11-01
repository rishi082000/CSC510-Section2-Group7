import React, { useState, useEffect } from "react";
import axios from "axios";
import Cart from "./Cart";
import "../../styles/global.css";

const Browse = ({ onTakeQuiz }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menuSearchTerm, setMenuSearchTerm] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("packeats_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Fetch all restaurants once on mount
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/restaurants");
        setRestaurants(response.data);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
      }
    };
    fetchRestaurants();
  }, []);

  // Fetch menu items when restaurant selected
  useEffect(() => {
    const fetchMenu = async () => {
      if (!selectedRestaurant) return;
      try {
        const response = await axios.get("http://localhost:8080/api/restaurants/menu", {
          params: { restaurantName: selectedRestaurant.name },
        });
        setMenuItems(response.data);
      } catch (err) {
        console.error("Error fetching menu:", err);
      }
    };
    fetchMenu();
  }, [selectedRestaurant]);

  // Save cart in localStorage
  useEffect(() => {
    try {
      localStorage.setItem("packeats_cart", JSON.stringify(cartItems));
    } catch (err) {
      console.error("Failed to save cart:", err);
    }
  }, [cartItems]);

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMenu = menuItems.filter((item) =>
    item.name.toLowerCase().includes(menuSearchTerm.toLowerCase())
  );

  const handleUpdateCart = (item, action) => {
    setCartItems((prevCart) => {
      const existingIndex = prevCart.findIndex((ci) => ci.id === item.id);

      if (action === "ADD" || action === "INCREMENT") {
        if (existingIndex >= 0) {
          return prevCart.map((ci, idx) =>
            idx === existingIndex ? { ...ci, quantity: ci.quantity + 1 } : ci
          );
        } else {
          return [...prevCart, { ...item, quantity: 1 }];
        }
      } else if (action === "DECREMENT" && existingIndex >= 0) {
        return prevCart
          .map((ci, idx) =>
            idx === existingIndex ? { ...ci, quantity: ci.quantity - 1 } : ci
          )
          .filter((ci) => ci.quantity > 0);
      }
      return prevCart;
    });
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const getItemQuantity = (itemId) =>
    cartItems.find((ci) => ci.id === itemId)?.quantity || 0;

  return (
    <div className="browse-container">
      {/* Header */}
      <header className="quiz-header">
        <h2>PACKEats</h2>

        <div className="header-center-content">
          {selectedRestaurant ? (
            <div className="restaurant-header-search">
              <h3 className="restaurant-title-in-header">
                {selectedRestaurant.name}
              </h3>
              <input
                type="text"
                placeholder={`Search ${selectedRestaurant.name} menu...`}
                value={menuSearchTerm}
                onChange={(e) => setMenuSearchTerm(e.target.value)}
                className="menu-search-input"
              />
            </div>
          ) : (
            <input
              type="text"
              placeholder="Search restaurants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="menu-search-input"
            />
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button className="take-quiz-btn" onClick={onTakeQuiz}>
            Take Quiz
          </button>
          <div className="quiz-cart-summary">
            Items: {totalItems} | Total: ${totalPrice.toFixed(2)}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content-wrapper">
        <div className="quiz-form-area">
          {selectedRestaurant === null ? (
            <div className="restaurant-list">
              {filteredRestaurants.map((r) => (
                <div
                  key={r.id}
                  className="restaurant-list-item"
                  onClick={() => {
                    setSelectedRestaurant(r);
                    setMenuSearchTerm("");
                  }}
                >
                  <img
                    src={`/assets/${r.name}.jpg`}
                    alt={r.name}
                    className="restaurant-list-image"
                  />
                  <div className="restaurant-list-info">
                    <h3 className="restaurant-list-name">{r.name}</h3>
                    <p className="restaurant-list-address">{r.address}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="menu-list">
              <div className="menu-controls">
                <button
                  className="back-btn"
                  onClick={() => {
                    setSelectedRestaurant(null);
                    setMenuSearchTerm("");
                    setMenuItems([]);
                  }}
                >
                  ← Back to Restaurants
                </button>
              </div>

              {filteredMenu.map((item) => {
                const currentQuantity = getItemQuantity(item.id);
                const cartItem = cartItems.find((ci) => ci.id === item.id) || item;

                return (
                  <div key={item.id} className="menu-list-item">
                    <img src={`/assets/${item.name}.jpg`} alt={item.name} className="menu-list-image" />
                    <div className="menu-list-info">
                      <h4 className="menu-list-name">{item.name}</h4>
                      <p className="menu-list-description">{item.description}</p>

                      {/* Food Type */}
                      {item.food_type && (
                        <span className={`menu-list-food-type ${item.food_type.replace(" ", "-")}`}>
                          {item.food_type}
                        </span>
                      )}

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
                              onClick={() =>
                                handleUpdateCart(cartItem, "DECREMENT")
                              }
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
};

export default Browse;
