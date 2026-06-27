import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import WhatsAppButton from "../../components/WhatsAppButton/WhatsAppButton";
import "./Cart.css";

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, totalItems, totalPrice } =
    useCart();

  if (cartItems.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="cart-empty">
          <span className="empty-icon">🛒</span>
          <h2>Your Cart is Empty</h2>
          <p>No products added yet</p>
          <div className="cart-empty-btns">
            <Link to="/products" className="shop-btn">
              View Products
            </Link>
          </div>
        </div>
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#0F0F0F", minHeight: "100vh" }}>
      <Navbar />
      <div className="cart-page">
        <div className="cart-top">
          <div className="cart-header">
            <h1>Your Cart</h1>
            <span>{totalItems} items</span>
          </div>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-img">
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={`https://seven-star-tile-vanity.onrender.com${item.images[0]}`}
                      alt={item.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  ) : (
                    <span>🎨</span>
                  )}
                </div>
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p>Size: {item.size}</p>
                  <span className="cart-item-price">
                    Rs. {item.price.toLocaleString()}
                  </span>
                </div>
                <div className="cart-item-actions">
                  <div className="qty-control">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <span className="item-total">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Total Items:</span>
              <span>{totalItems}</span>
            </div>
            <div className="summary-row total">
              <span>Total Price:</span>
              <span>Rs. {totalPrice.toLocaleString()}</span>
            </div>
            <p className="summary-note">
              * Delivery charges will be confirmed on call
            </p>
            <Link to="/order" className="checkout-btn">
              Place Order →
            </Link>
            <Link to="/products" className="continue-btn">
              Continue Shopping
            </Link>
            <Link to="/" className="home-return-btn">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default Cart;
