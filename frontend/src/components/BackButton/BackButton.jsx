import React from "react";
import { Link } from "react-router-dom";
import "./BackButton.css";

function BackButton() {
  return (
    <div className="back-to-home">
      <Link to="/" className="back-home-btn">
        ← Back to Home
      </Link>
    </div>
  );
}

export default BackButton;
