import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import WhatsAppButton from "../../components/WhatsAppButton/WhatsAppButton";
import { useCart } from "../../context/CartContext";
import "./ProductDetail.css";

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
    fetch(`https://seven-star-tile-vanity.onrender.com/api/products/${id}`)
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

  // ✅ Buy Now — product data ke saath OrderForm pe navigate karo
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
              ? `https://seven-star-tile-vanity.onrender.com${product.images[0]}`
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
            `${product.name} – ${product.category} vanity. Premium quality, factory-direct, custom sizes available at Seven Star Tile Vanity.`
          }
        />
      </Helmet>
      <Navbar />

      {/* Breadcrumb */}
      <div className="detail-breadcrumb">
        <Link to="/">Home</Link>
        <span>›</span>
        <Link to={`/category/${encodeURIComponent(product.category)}`}>
          {product.category}
        </Link>
        <span>›</span>
        <span>{product.name}</span>
      </div>

      {/* Main Content */}
      <div className="detail-container">
        {/* Left — Images */}
        <div className="detail-images">
          {/* Thumbnails */}
          <div className="detail-thumbnails">
            {product.images &&
              product.images.map((img, i) => (
                <div
                  key={i}
                  className={`detail-thumb ${i === currentImage ? "active" : ""}`}
                  onClick={() => setCurrentImage(i)}
                >
                  <img
                    src={`https://seven-star-tile-vanity.onrender.com${img}`}
                    alt=""
                  />
                </div>
              ))}
          </div>

          {/* Main Image */}
          <div className="detail-main-img">
            {product.images && product.images.length > 0 ? (
              <>
                <img
                  src={`https://seven-star-tile-vanity.onrender.com${product.images[currentImage]}`}
                  alt={product.name}
                />
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

        {/* Right — Info */}
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

          {/* Details Table */}
          <div className="detail-table">
            {product.size && (
              <div className="detail-table-row">
                <span className="detail-table-label">Size</span>
                <span className="detail-table-value">{product.size}</span>
              </div>
            )}
            {product.finish && (
              <div className="detail-table-row">
                <span className="detail-table-label">Finish</span>
                <span className="detail-table-value">{product.finish}</span>
              </div>
            )}
            {product.category && (
              <div className="detail-table-row">
                <span className="detail-table-label">Category</span>
                <span className="detail-table-value">{product.category}</span>
              </div>
            )}
            <div className="detail-table-row">
              <span className="detail-table-label">Availability</span>
              <span
                className="detail-table-value"
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
                href="https://wa.me/923XXXXXXXXX"
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

                {/* ✅ Buy Now — ab Link nahi, button hai */}
                <button onClick={handleBuyNow} className="detail-buy-btn">
                  Buy Now
                </button>

                <a
                  href="https://wa.me/923XXXXXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="detail-whatsapp-btn"
                >
                  💬 Buy on WhatsApp
                </a>
              </>
            )}

            <button onClick={() => navigate(-1)} className="detail-back-btn">
              ← Go Back
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts category={product.category} currentId={product._id} />

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

// Related Products Component
function RelatedProducts({ category, currentId }) {
  const [related, setRelated] = useState([]);

  useEffect(() => {
    fetch(
      `https://seven-star-tile-vanity.onrender.com/api/products?category=${encodeURIComponent(category)}`,
    )
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
              {product.images && product.images[0] ? (
                <img
                  src={`https://seven-star-tile-vanity.onrender.com${product.images[0]}`}
                  alt={product.name}
                />
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
