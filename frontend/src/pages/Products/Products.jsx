import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import Navbar from "../../components/Navbar/Navbar";
import BackButton from "../../components/BackButton/BackButton";
import Footer from "../../components/Footer/Footer";
import WhatsAppButton from "../../components/WhatsAppButton/WhatsAppButton";
import "./Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("All");
  const [added, setAdded] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentImages, setCurrentImages] = useState({});
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filtered =
    filter === "All" ? products : products.filter((p) => p.category === filter);

  const handleAddToCart = (product) => {
    if (product.isCustom) {
      window.open(
        "https://wa.me/923XXXXXXXXX?text=" + encodeURIComponent("Custom Order"),
        "_blank",
      );
      return;
    }
    addToCart(product);
    setAdded((prev) => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setAdded((prev) => ({ ...prev, [product._id]: false }));
    }, 2000);
  };

  // ── Buy Now — passes the exact product + currently shown image ──
  const handleBuyNow = (product, currentIndex) => {
    const hasImages = product.images && product.images.length > 0;
    const imageUrl = hasImages
      ? `http://localhost:5000${product.images[currentIndex]}`
      : null;

    navigate("/order", {
      state: {
        selectedProduct: {
          name: product.name,
          category: product.category,
          size: product.size,
          finish: product.finish,
          color: product.color,
          price: product.price,
          image: imageUrl, // ✅ the image the user was viewing
        },
      },
    });
  };

  const handlePrevImage = (productId, imagesLength) => {
    setCurrentImages((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) - 1 + imagesLength) % imagesLength,
    }));
  };

  const handleNextImage = (productId, imagesLength) => {
    setCurrentImages((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % imagesLength,
    }));
  };

  if (loading) {
    return (
      <div style={{ background: "#0f0f0f", minHeight: "100vh" }}>
        <Navbar />
        <div
          style={{
            textAlign: "center",
            padding: "100px",
            fontSize: "18px",
            color: "#d4af37",
          }}
        >
          Products load ho rahe hain...
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="products-hero">
        <span className="products-tag">Our Collection</span>
        <h1>
          Premium Vanity <span>Collection</span>
        </h1>
        <p>
          Direct factory se — best quality, best price. Custom size available.
        </p>
      </div>

      <div className="products-page">
        <div className="filter-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? "active" : ""}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
          <span className="products-count">{filtered.length} Products</span>
        </div>

        <div className="products-grid">
          {filtered.map((product) => {
            const currentIndex = currentImages[product._id] || 0;
            const hasImages = product.images && product.images.length > 0;

            return (
              <div key={product._id} className="product-card">
                {/* Image Container */}
                <div
                  className="product-img"
                  style={{ backgroundColor: "#1a1a1a" }}
                >
                  {hasImages ? (
                    <img
                      src={`http://localhost:5000${product.images[currentIndex]}`}
                      alt={product.name}
                    />
                  ) : (
                    <span style={{ fontSize: "64px" }}>🎨</span>
                  )}

                  {/* Arrows */}
                  {product.images && product.images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          handlePrevImage(product._id, product.images.length)
                        }
                        style={{
                          position: "absolute",
                          left: "8px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "rgba(0,0,0,0.6)",
                          color: "#d4af37",
                          border: "none",
                          borderRadius: "50%",
                          width: "32px",
                          height: "32px",
                          cursor: "pointer",
                          fontSize: "18px",
                          zIndex: 2,
                        }}
                      >
                        ‹
                      </button>
                      <button
                        onClick={() =>
                          handleNextImage(product._id, product.images.length)
                        }
                        style={{
                          position: "absolute",
                          right: "8px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "rgba(0,0,0,0.6)",
                          color: "#d4af37",
                          border: "none",
                          borderRadius: "50%",
                          width: "32px",
                          height: "32px",
                          cursor: "pointer",
                          fontSize: "18px",
                          zIndex: 2,
                        }}
                      >
                        ›
                      </button>

                      {/* Dots */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: "8px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          display: "flex",
                          gap: "5px",
                          zIndex: 2,
                        }}
                      >
                        {product.images.map((_, i) => (
                          <span
                            key={i}
                            style={{
                              width: "7px",
                              height: "7px",
                              borderRadius: "50%",
                              background:
                                i === currentIndex
                                  ? "#d4af37"
                                  : "rgba(255,255,255,0.4)",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              setCurrentImages((prev) => ({
                                ...prev,
                                [product._id]: i,
                              }))
                            }
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {product.isCustom && (
                    <span className="custom-badge">Custom Order</span>
                  )}
                </div>

                {/* Product Body */}
                <div className="product-body">
                  <div className="product-meta">
                    <span className="product-category">{product.category}</span>
                    <span className="product-finish">{product.finish}</span>
                  </div>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-desc">{product.description}</p>
                  <div className="product-details">
                    <span>📐 Size: {product.size}</span>
                  </div>
                  <div className="product-footer">
                    {product.isCustom ? (
                      <span className="product-price call-price">
                        Call for Price
                      </span>
                    ) : (
                      <span className="product-price">
                        Rs. {product.price?.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="product-btn-row">
                    {product.isCustom ? (
                      <a
                        href="https://wa.me/923XXXXXXXXX"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="product-whatsapp-btn"
                      >
                        💬 WhatsApp Us
                      </a>
                    ) : (
                      <>
                        <button
                          className={`product-cart-btn ${
                            added[product._id] ? "added" : ""
                          }`}
                          onClick={() => handleAddToCart(product)}
                        >
                          {added[product._id] ? "✓ Added!" : "Add to Cart"}
                        </button>

                        {/* ✅ Buy Now now passes the exact product + image */}
                        <button
                          className="product-buy-btn"
                          onClick={() => handleBuyNow(product, currentIndex)}
                        >
                          Buy Now
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <BackButton />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default Products;
