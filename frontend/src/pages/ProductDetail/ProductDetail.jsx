import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import WhatsAppButton from "../../components/WhatsAppButton/WhatsAppButton";
import { useCart } from "../../context/CartContext";
import "./ProductDetail.css";

const API = "https://seven-star-tile-vanity.onrender.com";

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div
      style={{
        display: "flex",
        gap: "4px",
        cursor: onChange ? "pointer" : "default",
      }}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            fontSize: "22px",
            color: star <= (hovered || value) ? "#d4af37" : "#444",
            transition: "color 0.15s",
          }}
          onMouseEnter={() => onChange && setHovered(star)}
          onMouseLeave={() => onChange && setHovered(0)}
          onClick={() => onChange && onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function ReviewsSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [form, setForm] = useState({
    name: "",
    email: "",
    rating: 0,
    comment: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/api/reviews/product/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data.reviews || []);
        setAvgRating(data.averageRating || 0);
      })
      .catch(() => {});
  }, [productId]);

  const handleSubmit = async () => {
    setError("");
    if (!form.name || !form.email || !form.rating || !form.comment) {
      setError("Please fill all fields and select a rating.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, product: productId }),
      });
      if (res.ok) {
        setSubmitted(true);
        setForm({ name: "", email: "", rating: 0, comment: "" });
      } else {
        setError("Something went wrong. Try again.");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="reviews-section">
      <h2 className="reviews-title">Customer Reviews</h2>

      {/* Summary */}
      {reviews.length > 0 && (
        <div className="reviews-summary">
          <span className="reviews-avg">{avgRating}</span>
          <div>
            <StarRating value={Math.round(avgRating)} />
            <span className="reviews-count">
              {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <p className="reviews-empty">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="reviews-list">
          {reviews.map((r) => (
            <div key={r._id} className="review-card">
              <div className="review-header">
                <div className="review-avatar">
                  {r.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="review-name">{r.name}</div>
                  <StarRating value={r.rating} />
                </div>
                <div className="review-date">
                  {new Date(r.createdAt).toLocaleDateString("en-PK", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
              <p className="review-comment">{r.comment}</p>
            </div>
          ))}
        </div>
      )}

      {/* Form */}
      <div className="review-form">
        <h3 className="review-form-title">Write a Review</h3>

        {submitted ? (
          <div className="review-success">
            ✓ Review submitted! It will appear after approval.
          </div>
        ) : (
          <>
            {error && <div className="review-error">⚠ {error}</div>}

            <div className="review-form-grid">
              <div className="review-field">
                <label>Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ahmed Khan"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="review-field">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="review-field">
              <label>Rating</label>
              <StarRating
                value={form.rating}
                onChange={(v) => setForm({ ...form, rating: v })}
              />
            </div>

            <div className="review-field">
              <label>Your Review</label>
              <textarea
                placeholder="Share your experience with this product..."
                rows={4}
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
              />
            </div>

            <button
              className="review-submit-btn"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${API}/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    navigate("/order", {
      state: {
        selectedProduct: {
          name: product.name,
          category: product.category,
          size: product.size || "",
          color: product.color || "",
          finish: product.finish || "",
          price: product.price,
          isCustom: product.isCustom,
          image:
            product.images && product.images.length > 0
              ? product.images[0]
              : null,
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="detail-page">
        <Navbar />
        <div className="detail-loading">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="detail-page">
        <Navbar />
        <div className="detail-loading">Product not found!</div>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <Helmet>
        <title>{product.name} | Seven Star Tile Vanity</title>
        <meta
          name="description"
          content={
            product.description ||
            `${product.name} – ${product.category} vanity. Premium quality available.`
          }
        />
      </Helmet>

      <Navbar />

      <div className="detail-breadcrumb">
        <Link to="/">Home</Link>
        <span>›</span>
        <Link to={`/category/${encodeURIComponent(product.category)}`}>
          {product.category}
        </Link>
        <span>›</span>
        <span>{product.name}</span>
      </div>

      <div className="detail-container">
        {/* Images */}
        <div className="detail-images">
          <div className="detail-thumbnails">
            {product.images?.map((img, i) => (
              <div
                key={i}
                className={`detail-thumb ${i === currentImage ? "active" : ""}`}
                onClick={() => setCurrentImage(i)}
              >
                <img src={img} alt="" />
              </div>
            ))}
          </div>

          <div className="detail-main-img">
            {product.images?.length > 0 ? (
              <>
                <img src={product.images[currentImage]} alt={product.name} />

                {product.images.length > 1 && (
                  <>
                    <button
                      className="detail-arrow left"
                      onClick={() =>
                        setCurrentImage(
                          (prev) =>
                            (prev - 1 + product.images.length) %
                            product.images.length,
                        )
                      }
                    >
                      ‹
                    </button>
                    <button
                      className="detail-arrow right"
                      onClick={() =>
                        setCurrentImage(
                          (prev) => (prev + 1) % product.images.length,
                        )
                      }
                    >
                      ›
                    </button>
                  </>
                )}
              </>
            ) : (
              <span style={{ fontSize: "80px" }}>🎨</span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="detail-info">
          <div className="detail-badges">
            {product.finish && (
              <span className="detail-badge">{product.finish}</span>
            )}
            {product.category && (
              <span className="detail-badge">{product.category}</span>
            )}
          </div>

          <h1 className="detail-name">{product.name}</h1>

          <div className="detail-price">
            {product.isCustom ? (
              <span className="detail-price-custom">Call for Price</span>
            ) : (
              <span>Rs. {product.price?.toLocaleString()}</span>
            )}
          </div>

          <p className="detail-desc">{product.description}</p>

          <div className="detail-table">
            {product.size && (
              <div className="detail-table-row">
                <span>Size</span>
                <span>{product.size}</span>
              </div>
            )}
            {product.finish && (
              <div className="detail-table-row">
                <span>Finish</span>
                <span>{product.finish}</span>
              </div>
            )}
            <div className="detail-table-row">
              <span>Availability</span>
              <span
                style={{ color: product.stock > 0 ? "#1D9E75" : "#d9534f" }}
              >
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="detail-buttons">
            {product.isCustom ? (
              <a
                href={`https://wa.me/923237429771?text=${encodeURIComponent(
                  `Hello, I want to place a custom order for ${product.name}`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="detail-whatsapp-btn"
              >
                💬 WhatsApp for Custom Order
              </a>
            ) : (
              <>
                <button
                  onClick={handleAddToCart}
                  className={`detail-cart-btn ${added ? "added" : ""}`}
                >
                  {added ? "✓ Added to Cart!" : "Add to Cart"}
                </button>

                <button onClick={handleBuyNow} className="detail-buy-btn">
                  Buy Now
                </button>

                <a
                  href={`https://wa.me/923237429771?text=${encodeURIComponent(
                    `Hello, I am interested in ${product.name}`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="detail-whatsapp-btn"
                >
                  💬 WhatsApp Us
                </a>
              </>
            )}

            <button onClick={() => navigate(-1)} className="detail-back-btn">
              ← Go Back
            </button>
          </div>
        </div>
      </div>

      <RelatedProducts category={product.category} currentId={product._id} />

      <ReviewsSection productId={product._id} />

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

function RelatedProducts({ category, currentId }) {
  const [related, setRelated] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/products?category=${encodeURIComponent(category)}`)
      .then((res) => res.json())
      .then((data) => {
        setRelated(data.filter((p) => p._id !== currentId).slice(0, 4));
      });
  }, [category, currentId]);

  if (related.length === 0) return null;

  return (
    <div className="related-section">
      <h2 className="related-title">Related Products</h2>
      <div className="related-grid">
        {related.map((product) => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="related-card"
          >
            <div className="related-img">
              {product.images?.[0] ? (
                <img src={product.images[0]} alt={product.name} />
              ) : (
                <span>🎨</span>
              )}
            </div>
            <div className="related-body">
              <h4>{product.name}</h4>
              <span>
                {product.isCustom
                  ? "Call for Price"
                  : `Rs. ${product.price?.toLocaleString()}`}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ProductDetail;
