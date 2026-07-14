import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import WhatsAppButton from "../../components/WhatsAppButton/WhatsAppButton";
import "./CategoryPage.css";

const API = "https://seven-star-tile-vanity.onrender.com";
const SITE_URL = "https://www.7startilevanity.com";

function StarRating({ rating, count }) {
  if (!rating) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
        margin: "6px 0",
      }}
    >
      <span
        style={{ color: "#d4af37", fontSize: "13px", letterSpacing: "1px" }}
      >
        {"★".repeat(Math.round(rating))}
        {"☆".repeat(5 - Math.round(rating))}
      </span>
      <span style={{ fontSize: "12px", color: "#888" }}>
        {rating} ({count})
      </span>
    </div>
  );
}

function CategoryPage() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState({});
  const [ratings, setRatings] = useState({});
  const { addToCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${API}/api/products?category=${encodeURIComponent(categoryName)}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
        // Fetch ratings for each product
        data.forEach((product) => {
          fetch(`${API}/api/reviews/product/${product._id}`)
            .then((r) => r.json())
            .then((rev) => {
              if (rev.count > 0) {
                setRatings((prev) => ({
                  ...prev,
                  [product._id]: { avg: rev.averageRating, count: rev.count },
                }));
              }
            })
            .catch(() => {});
        });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [categoryName]);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    addToCart(product);
    setAdded((prev) => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setAdded((prev) => ({ ...prev, [product._id]: false }));
    }, 2000);
  };

  const handleBuyNow = (e, product) => {
    e.preventDefault();
    navigate("/order", {
      state: {
        selectedProduct: {
          name: product.name,
          category: product.category,
          size: product.size || "",
          color: product.color || "",
          finish: product.finish || "",
          price: product.price,
          image:
            product.images && product.images.length > 0
              ? product.images[0]
              : null,
        },
      },
    });
  };

  const canonicalUrl = `${SITE_URL}/category/${encodeURIComponent(categoryName)}`;

  return (
    <div className="category-page">
      <Helmet>
        <title>{categoryName} | Seven Star Tile Vanity</title>
        <meta
          name="description"
          content={`Explore our ${categoryName} collection — premium quality, factory-direct vanities. Custom sizes, designs and colors available worldwide.`}
        />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      <Navbar />

      <div className="category-hero">
        <div className="category-hero-content">
          <Link to="/" className="category-breadcrumb">
            Home
          </Link>
          <span className="category-breadcrumb-sep">›</span>
          <span className="category-breadcrumb-active">{categoryName}</span>
          <h1>{categoryName}</h1>
          <p>High Quality — Straight from the Factor</p>
        </div>
      </div>

      <div className="category-container">
        {loading ? (
          <div className="category-loading">Loading...</div>
        ) : products.length === 0 ? (
          <div className="category-empty">
            <p>No products found in this category.</p>
          </div>
        ) : (
          <div className="category-grid">
            {products.map((product) => (
              <div key={product._id} className="category-card">
                <Link to={`/product/${product._id}`}>
                  <div className="category-card-img">
                    {product.images && product.images.length > 0 ? (
                      <img src={product.images[0]} alt={product.name} />
                    ) : (
                      <span className="category-card-emoji">🎨</span>
                    )}
                    <div className="category-card-overlay">
                      <span>View Details</span>
                    </div>
                  </div>
                </Link>

                <div className="category-card-body">
                  <div className="category-card-badges">
                    {product.finish && (
                      <span className="category-badge">{product.finish}</span>
                    )}
                    {product.size && (
                      <span className="category-badge">📐 {product.size}</span>
                    )}
                  </div>
                  <h3 className="category-card-name">{product.name}</h3>

                  {/* Star Rating */}
                  {ratings[product._id] && (
                    <StarRating
                      rating={ratings[product._id].avg}
                      count={ratings[product._id].count}
                    />
                  )}

                  <p className="category-card-desc">{product.description}</p>

                  <div className="category-card-footer">
                    {product.isCustom ? (
                      <span className="category-card-price custom">
                        Call for Price
                      </span>
                    ) : (
                      <span className="category-card-price">
                        Rs. {product.price?.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="category-card-btns">
                    {product.isCustom ? (
                      <a
                        href={`https://wa.me/923237429771?text=${encodeURIComponent(`Hello, I am interested in ${product.name}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="category-whatsapp-btn"
                      >
                        💬 WhatsApp Us
                      </a>
                    ) : (
                      <>
                        <button
                          className={`category-cart-btn ${added[product._id] ? "added" : ""}`}
                          onClick={(e) => handleAddToCart(e, product)}
                        >
                          {added[product._id] ? "✓ Added!" : "Add to Cart"}
                        </button>
                        <button
                          className="category-buy-btn"
                          onClick={(e) => handleBuyNow(e, product)}
                        >
                          Buy Now
                        </button>
                      </>
                    )}
                    <Link
                      to={`/product/${product._id}`}
                      className="category-view-btn"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ textAlign: "center", padding: "20px 0 40px" }}>
        <button onClick={() => navigate(-1)} className="category-back-home">
          ← Back to Home
        </button>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default CategoryPage;
