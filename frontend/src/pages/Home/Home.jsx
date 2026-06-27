import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import Footer from "../../components/Footer/Footer";
import WhatsAppButton from "../../components/WhatsAppButton/WhatsAppButton";
import companyCard from "../../assets/company-card.jpg";
import "./Home.css";

const WHY_CARDS = [
  {
    icon: "🏭",
    title: "Direct Factory",
    desc: "No middleman — direct from factory to your home. Best prices guaranteed.",
  },
  {
    icon: "✏️",
    title: "Custom Design",
    desc: "Your own size, color and design. We make exactly what you want.",
  },
  {
    icon: "🚚",
    title: "Nationwide Delivery",
    desc: "From Karachi to Peshawar — we deliver all over Pakistan.",
  },
  {
    icon: "⭐",
    title: "Premium Quality",
    desc: "High quality materials — long lasting and beautiful designs.",
  },
  {
    icon: "📞",
    title: "24/7 Support",
    desc: "Always available on WhatsApp — ask us anything, anytime.",
  },
  {
    icon: "↩️",
    title: "7 Day Return",
    desc: "Not satisfied? Return within 7 days — no questions asked.",
  },
];

const STATS = [
  { num: "500+", label: "Happy Clients" },
  { num: "50+", label: "Unique Designs" },
  { num: "5+", label: "Years Experience" },
  { num: "100%", label: "Quality Guarantee" },
];

const POLICIES = [
  {
    tab: "terms",
    icon: "📋",
    title: "Terms of Service",
    desc: "Order process, delivery, payment and breakage policy details.",
  },
  {
    tab: "return",
    icon: "↩️",
    title: "Return Policy",
    desc: "7 day return policy — full details on how to return a product.",
  },
  {
    tab: "privacy",
    icon: "🔒",
    title: "Privacy Policy",
    desc: "How we collect, use and protect your personal information.",
  },
];

function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // scroll fade-in — works on mobile and desktop
  useEffect(() => {
    const els = document.querySelectorAll(".fade-in");
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
  }, [categories]);

  useEffect(() => {
    fetch("https://seven-star-tile-vanity.onrender.com/api/categories")
      .then((r) => r.json())
      .then((d) => {
        setCategories(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      <Navbar />

      <div className="home-hero-wrap">
        <Hero />
      </div>

      {/* ── PRODUCTS ── */}
      <section className="h-products">
        <div className="h-sec-head fade-in">
          <span className="h-eyebrow">Our Collection</span>
          <h2>Premium Vanity Collection</h2>
          <p>Direct from factory — custom sizes and designs available</p>
        </div>

        <div className="h-prod-grid">
          {loading ? (
            <p className="h-loading">Loading...</p>
          ) : (
            categories.map((cat, i) => (
              <Link
                key={cat._id}
                to={`/category/${encodeURIComponent(cat.name)}`}
                className={`h-prod-card fade-in delay-${(i % 3) + 1}`}
              >
                <div className="h-prod-img">
                  {cat.image ? (
                    <img
                      src={`https://seven-star-tile-vanity.onrender.com${cat.image}`}
                      alt={cat.name}
                    />
                  ) : (
                    <span className="h-prod-placeholder">🎨</span>
                  )}
                </div>
                <div className="h-prod-body">
                  <h3>{cat.name}</h3>
                  <p>{cat.description}</p>
                  <span className="h-prod-link">View Collection →</span>
                </div>
              </Link>
            ))
          )}
        </div>

        <div className="h-view-all fade-in">
          <Link to="/products" className="h-view-btn">
            View All Products →
          </Link>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="h-why">
        <div className="h-sec-head fade-in">
          <span className="h-eyebrow">Why Choose Us</span>
          <h2>Why Seven Star?</h2>
          <p>Pakistan's most trusted tile vanity manufacturer</p>
        </div>

        <div className="h-why-grid">
          {WHY_CARDS.map((c, i) => (
            <div
              className={`h-why-card fade-in delay-${(i % 3) + 1}`}
              key={c.title}
            >
              <div className="h-why-icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── POLICIES ── */}
      <section className="h-policies">
        <div className="h-sec-head fade-in">
          <span className="h-eyebrow">Our Policies</span>
          <h2>Transparent &amp; Fair Policies</h2>
          <p>Click on any policy to read full details</p>
        </div>

        <div className="h-policy-grid">
          {POLICIES.map((p, i) => (
            <Link
              key={p.tab}
              to={`/terms?tab=${p.tab}`}
              className={`h-policy-card fade-in delay-${i + 1}`}
            >
              <div className="h-policy-icon">{p.icon}</div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <span className="h-policy-more">Read More →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="h-about">
        <div className="h-about-inner">
          <div className="h-about-left fade-in">
            <span className="h-eyebrow">About Us</span>
            <h2>
              Pakistan's Trusted
              <br />
              <em>Tile Vanity Factory</em>
            </h2>
            <p>
              Seven Star Tile Vanity is Pakistan's premium tile and vanity
              manufacturer. We deliver directly from factory to your home — no
              middleman, best prices. Custom size and design available in all
              products.
            </p>
            <p>
              Our products use high quality materials that are long lasting and
              beautiful. We have served hundreds of happy customers across
              Pakistan.
            </p>

            <div className="h-about-stats">
              {STATS.map((s) => (
                <div className="h-about-stat" key={s.label}>
                  <span className="h-stat-num">{s.num}</span>
                  <span className="h-stat-lbl">{s.label}</span>
                </div>
              ))}
            </div>

            <Link to="/about" className="h-about-btn">
              Read Our Full Story →
            </Link>
          </div>

          <div className="h-about-right fade-in delay-1">
            <div className="h-card-wrap">
              <div className="h-card-shine" aria-hidden="true" />
              <img
                src={companyCard}
                alt="Seven Star Tile Vanity Company Card"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default Home;
