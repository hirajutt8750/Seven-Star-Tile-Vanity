import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Testimonials.css";

// Read-only gold star row — used to display a review's rating
function StarRow({ rating }) {
  return (
    <div className="t-stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          className={n <= rating ? "t-star t-star-filled" : "t-star"}
          viewBox="0 0 24 24"
          width="16"
          height="16"
        >
          <path
            d="M12 2.5l2.9 6.6 7.1.7-5.4 4.8 1.6 7-6.2-3.7-6.2 3.7 1.6-7-5.4-4.8 7.1-.7z"
            fill={n <= rating ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
      ))}
    </div>
  );
}

function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);

  useEffect(() => {
    fetch("https://seven-star-tile-vanity.onrender.com/api/reviews/featured")
      .then((r) => r.json())
      .then((d) => {
        setReviews(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Own IntersectionObserver so we never touch Home.jsx's existing one
  useEffect(() => {
    const els = sectionRef.current
      ? sectionRef.current.querySelectorAll(".fade-in")
      : [];
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("show");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [reviews]);

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : null;

  // Don't render an empty/awkward section before any reviews exist
  if (!loading && reviews.length === 0) return null;

  return (
    <section className="h-testimonials" ref={sectionRef}>
      <div className="t-glow" aria-hidden="true" />

      <div className="h-sec-head fade-in">
        <span className="h-eyebrow">Customer Love</span>
        <h2>What Our Customers Say</h2>
        <p>Real reviews from real Seven Star customers across Pakistan</p>

        {avgRating && (
          <div className="t-avg-badge fade-in delay-1">
            <StarRow rating={Math.round(avgRating)} />
            <span className="t-avg-num">{avgRating}</span>
            <span className="t-avg-sep">·</span>
            <span className="t-avg-count">{reviews.length} Reviews</span>
          </div>
        )}
      </div>

      <div className="t-grid">
        {loading ? (
          <p className="h-loading">Loading...</p>
        ) : (
          reviews.map((rev, i) => (
            <div
              className={`t-card fade-in delay-${(i % 3) + 1}`}
              key={rev._id}
            >
              <svg
                className="t-quote"
                viewBox="0 0 32 32"
                width="30"
                height="30"
              >
                <path
                  fill="currentColor"
                  d="M10 8C5.6 8 2 11.6 2 16s3.6 8 8 8c.7 0 1-.5 1-1v-2c0-.5-.3-1-1-1-2.2 0-4-1.8-4-4h4c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm14 0c-4.4 0-8 3.6-8 8s3.6 8 8 8c.7 0 1-.5 1-1v-2c0-.5-.3-1-1-1-2.2 0-4-1.8-4-4h4c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z"
                />
              </svg>

              <StarRow rating={rev.rating} />

              <p className="t-comment">{rev.comment}</p>

              <div className="t-footer">
                <div className="t-avatar">
                  {rev.name ? rev.name.charAt(0).toUpperCase() : "S"}
                </div>
                <div className="t-meta">
                  <span className="t-name">{rev.name}</span>
                  {rev.productName && (
                    <span className="t-product">{rev.productName}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="h-view-all fade-in">
        <Link to="/products" className="h-view-btn">
          Explore Our Products →{" "}
        </Link>
      </div>
    </section>
  );
}

export default Testimonials;
