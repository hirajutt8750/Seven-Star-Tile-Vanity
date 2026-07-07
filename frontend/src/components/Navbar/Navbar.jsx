import React, { useState } from "react";
import logo from "../../assets/seven_star_logo.svg";
import logoLight from "../../assets/7star_light_gold_logo.svg";
{
  /* ← NAYI LINE */
}
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";
{
  /* ← NAYI LINE */
}
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  {
    /* ← NAYI LINE */
  }

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="navbar-logo">
        <img
          src={
            theme === "dark" ? logo : logoLight
          } /* ← CHANGE: pehle sirf "logo" tha */
          alt="Seven Star Tile Vanity"
          className="navbar-logo-img"
        />
        <div className="logo-text">
          <span className="logo-main">SEVEN STAR</span>
          <span className="logo-sub">TILE VANITY</span>
        </div>
      </Link>

      {/* Nav Links */}
      <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <li>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/products" onClick={() => setMenuOpen(false)}>
            Products
          </Link>
        </li>
        <li className="dropdown-parent">
          <span className="dropdown-trigger">
            Policies <span className="arrow">▾</span>
          </span>
          <ul className="dropdown-menu">
            <li>
              <Link to="/terms?tab=terms" onClick={() => setMenuOpen(false)}>
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/terms?tab=privacy" onClick={() => setMenuOpen(false)}>
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms?tab=return" onClick={() => setMenuOpen(false)}>
                Return Policy
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="/about" onClick={() => setMenuOpen(false)}>
            About Company
          </Link>
        </li>
        <li>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>
            Contact Us
          </Link>
        </li>
      </ul>

      {/* Right Side */}
      <div className="navbar-right">
        {/* Theme Toggle Button */} {/* ← NAYA BLOCK */}
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
        {/* Cart */}
        <Link to="/cart" className="cart-icon">
          🛒
          {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
        </Link>
        {/* Hamburger / Cross */}
        <div
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
