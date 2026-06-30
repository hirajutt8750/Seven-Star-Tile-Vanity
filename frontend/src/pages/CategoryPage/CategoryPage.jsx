import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import WhatsAppButton from "../../components/WhatsAppButton/WhatsAppButton";
import "./CategoryPage.css";

function CategoryPage() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(
      `https://seven-star-tile-vanity.onrender.com/api/products?category=${encodeURIComponent(categoryName)}`,
    )
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [categoryName]);

  return (
    <div className="category-page">
      <Helmet>
        <title>{categoryName} | Seven Star Tile Vanity</title>
        <meta
          name="description"
          content={`Explore our ${categoryName} collection — premium quality, factory-direct vanities. Custom sizes, designs and colors available worldwide.`}
        />
      </Helmet>
      <Navbar />

      {/* Hero */}
      <div className="category-hero">
        <div className="category-hero-content">
          <Link to="/" className="category-breadcrumb">
            Home
          </Link>
          <span className="category-breadcrumb-sep">›</span>
          <span className="category-breadcrumb-active">{categoryName}</span>
          <h1>{categoryName}</h1>
          <p>Premium quality — direct factory price</p>
        </div>
      </div>

      {/* Products */}
      <div className="category-container">
        {loading ? (
          <div className="category-loading">Loading...</div>
        ) : products.length === 0 ? (
          <div className="category-empty">
            <p>No products found in this category.</p>
            <Link to="/" className="category-back-btn">
              ← Back to Home
            </Link>
          </div>
        ) : (
          <div className="category-grid">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="category-card"
              >
                {/* Image */}
                <div className="category-card-img">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={`https://seven-star-tile-vanity.onrender.com${product.images[0]}`}
                      alt={product.name}
                    />
                  ) : (
                    <span className="category-card-emoji">🎨</span>
                  )}
                  <div className="category-card-overlay">
                    <span>View Details</span>
                  </div>
                </div>

                {/* Info */}
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
                    <span className="category-card-btn">View →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      {/* Back Button */}
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
