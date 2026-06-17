import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="footer-star">★</span>
            <div>
              <span className="footer-logo-main">SEVEN STAR</span>
              <span className="footer-logo-sub">TILE VANITY</span>
            </div>
          </div>
          <p className="footer-about">
            Pakistan’s premium tile and vanity factory. Get the best quality at
            the best prices directly from the factory. Custom sizes and designs
            available.
          </p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/products">Products</a>
            </li>
            <li>
              <a href="/order">Order Now</a>
            </li>
            <li>
              <a href="/terms">Terms & Policy</a>
            </li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Contact Us</h4>
          <ul>
            <li>📍 Gujranwala, Pakistan</li>
            <li>📞 0323 7429771</li>
            <li>💬 WhatsApp: 0323 7429771</li>
            <li>🕐 Sat-Mon: 9am - 7pm</li>
          </ul>
        </div>

        <div className="footer-policy">
          <h4>Our Policies</h4>
          <ul>
            <li>
              <a href="/terms">Return Policy (7 Days)</a>
            </li>
            <li>
              <a href="/terms">Delivery Policy</a>
            </li>
            <li>
              <a href="/terms">Terms of Service</a>
            </li>
            <li>
              <a href="/terms">Breaking Policy</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024 Seven Star Tile Vanity. All rights reserved.</p>
        <p>Whole Pakistan Delivery Available</p>
      </div>
    </footer>
  );
}

export default Footer;
