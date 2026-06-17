import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Hero.css";
import vanity1 from "../../assets/vanity1.jpg";
import vanity2 from "../../assets/vanity2.jpg";
import vanity3 from "../../assets/vanity3.jpg";
import vanity4 from "../../assets/vanity4.jpg";
import vanity5 from "../../assets/vanity5.jpg";

const vanityImages = [
  {
    url: vanity1,
    label: 'Simple Vanity — 32"',
    desc: "Classic marble finish with LED mirror",
  },
  {
    url: vanity2,
    label: 'Fancy Vanity — 32"',
    desc: "Modern floating design with shelf",
  },
  {
    url: vanity3,
    label: 'Double Bowl Vanity — 48"',
    desc: "Luxury double sink for large bathrooms",
  },
  {
    url: vanity4,
    label: 'Premium Vanity — 36"',
    desc: "Premium white marble with gold finish",
  },
  {
    url: vanity5,
    label: 'Luxury Vanity — 32"',
    desc: "Elegant design for luxury homes",
  },
];

function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % vanityImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => {
    setCurrent(
      (prev) => (prev - 1 + vanityImages.length) % vanityImages.length,
    );
  };

  const next = () => {
    setCurrent((prev) => (prev + 1) % vanityImages.length);
  };

  return (
    <>
      <div className="marquee-bar">
        <div className="marquee-track">
          <span>⭐ Delivery Across All Over Pakistan</span>
          <span>|</span>
          <span>🏭 Factory Prices Guaranteed</span>
          <span>|</span>
          <span>✨ Premium Quality Vanity</span>
          <span>|</span>
          <span>📞 Custom Orders Available</span>
          <span>|</span>
          <span>↩️ 7 Day Return Policy</span>
          <span>|</span>
        </div>
        <div className="marquee-track" aria-hidden="true">
          <span>⭐ Delivery Across All Over Pakistan</span>
          <span>|</span>
          <span>🏭 Factory Prices Guaranteed</span>
          <span>|</span>
          <span>✨ Premium Quality Vanity</span>
          <span>|</span>
          <span>📞 Custom Orders Available</span>
          <span>|</span>
          <span>↩️ 7 Day Return Policy</span>
          <span>|</span>
        </div>
      </div>

      <section className="hero">
        <div className="hero-left">
          <h1 className="hero-title">
            Premium Tiles &<br />
            <span className="hero-highlight">Vanity Solutions</span>
          </h1>
          <p className="hero-desc">
            Designed for elegance. Built for durability. Each vanity is crafted
            with precision, blending timeless beauty and modern innovation. From
            luxury homes to elegant spaces, we bring perfection to every corner.
            Discover a reflection of your style with 7Star Vanity Tiles — where
            design meets excellence.
          </p>
          <div className="hero-btns">
            <Link to="/products" className="hero-btn-primary">
              Explore Collection
            </Link>
            <Link to="/order" className="hero-btn-secondary">
              Custom Order
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-num">500+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="hero-stat">
              <span className="stat-num">50+</span>
              <span className="stat-label">Designs</span>
            </div>
            <div className="hero-stat">
              <span className="stat-num">100%</span>
              <span className="stat-label">Quality Guaranteed</span>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-img-box">
            {vanityImages.map((img, i) => (
              <div
                key={i}
                className={`hero-slide ${i === current ? "active" : ""}`}
              >
                <img src={img.url} alt={img.label} className="hero-img" />
                <div className="hero-img-overlay">
                  <div className="hero-img-label">{img.label}</div>
                  <div className="hero-img-desc">{img.desc}</div>
                </div>
              </div>
            ))}

            <button className="slider-btn prev-btn" onClick={prev}>
              &#8249;
            </button>
            <button className="slider-btn next-btn" onClick={next}>
              &#8250;
            </button>
          </div>

          <div className="hero-dots">
            {vanityImages.map((_, i) => (
              <span
                key={i}
                className={`dot ${i === current ? "active" : ""}`}
                onClick={() => setCurrent(i)}
              ></span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;
