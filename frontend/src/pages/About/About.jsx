import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import BackButton from "../../components/BackButton/BackButton";
import Footer from "../../components/Footer/Footer";
import WhatsAppButton from "../../components/WhatsAppButton/WhatsAppButton";
import companyCard from "../../assets/company-card.jpg";
import "./About.css";
import backgroundImg from "../../assets/background-image.png";

const VALUES = [
  {
    title: "Our Mission",
    desc: "To provide beautiful, durable, and affordable vanity & tile solutions.",
    svg: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Our Vision",
    desc: "To be a leading brand in the tile & vanity industry across Pakistan.",
    svg: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: "Our Quality",
    desc: "We ensure top-quality materials and excellent craftsmanship.",
    svg: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    title: "Customer Focus",
    desc: "Customer satisfaction is our top priority — always.",
    svg: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    title: "Trust & Reliability",
    desc: "We believe in honesty, quality, and long-term relationships.",
    svg: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "Wide Range",
    desc: "A vast collection of modern vanities and premium tiles.",
    svg: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
];

function About() {
  useEffect(() => {
    const els = document.querySelectorAll(".fade-in");

    // Hero elements — directly show karo (already in viewport)
    els.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        setTimeout(() => el.classList.add("show"), 100);
      }
    });

    // Baaki elements — scroll pe trigger karo
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("show");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.1 },
    );

    els.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top >= window.innerHeight) {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-page">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="hero">
        <img
          src={backgroundImg}
          alt="Luxury bathroom"
          className="hero-bg-img"
        />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-top-line" aria-hidden="true" />

        <div className="hero-inner">
          {/* LEFT — text */}
          <div className="hero-content">
            <span className="italic-tag fade-in">Premium</span>
            <h1 className="fade-in delay-1">
              Vanity &amp; Tile
              <br />
              Solutions
            </h1>
            <div className="h-ornament fade-in delay-2" aria-hidden="true">
              <span className="h-line" />
              <span className="h-star">✦</span>
            </div>
            <p className="hero-desc fade-in delay-2">
              Stylish designs. Premium quality. Elevate the beauty of your space
              with 7 Star Tile Vanity.
            </p>
          </div>

          {/* RIGHT — card */}
          <div className="hero-card-side fade-in delay-3">
            <div className="card-wrap">
              <div className="card-shine" aria-hidden="true" />
              <img
                src={companyCard}
                alt="7 Star Tile Vanity Company Card"
                className="card-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT US ─────────────────────────────────── */}
      <section className="about-sec">
        <h2 className="sec-title fade-in">About Us</h2>

        <div className="ornament fade-in delay-1" aria-hidden="true">
          <span className="orn-l r" />
          <span className="orn-s">✦</span>
          <span className="orn-l" />
        </div>

        <p className="about-text fade-in delay-2">
          7 Star Tile Vanity is a trusted name in premium vanity and tile
          solutions, based in Gujranwala, Pakistan. Founded with a passion for
          quality craftsmanship, we have been proudly serving hundreds of
          satisfied customers across the country since 2019.
        </p>
        <p className="about-text about-text-2 fade-in delay-2">
          We manufacture and deliver high-quality, stylish, and durable vanities
          and tiles — directly from our factory to your door. No middlemen, no
          compromise. Every product is built with premium materials and modern
          designs, fully customizable to match your vision. Whether you need
          floor tiles, wall tiles, or a completely custom vanity — we design it,
          we build it, we deliver it.
        </p>

        {/* Values grid */}
        <div className="vgrid">
          {VALUES.map((v, i) => (
            <div className={`vc fade-in delay-${(i % 3) + 1}`} key={v.title}>
              <div className="vc-icon">{v.svg}</div>
              <div className="vc-title">{v.title}</div>
              <div className="vc-desc">{v.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS STRIP ────────────────────────────── */}
      <section className="about-stats">
        <div className="about-stats-grid">
          <div className="fade-in">
            <span className="about-stat-num">500+</span>
            <span className="about-stat-label">Happy Customers</span>
          </div>
          <div className="fade-in delay-1">
            <span className="about-stat-num">50+</span>
            <span className="about-stat-label">Designs Available</span>
          </div>
          <div className="fade-in delay-2">
            <span className="about-stat-num">5+</span>
            <span className="about-stat-label">Years Experience</span>
          </div>
          <div className="fade-in delay-3">
            <span className="about-stat-num">100%</span>
            <span className="about-stat-label">Quality Guaranteed</span>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────── */}
      <section className="about-cta">
        <h2 className="fade-in">
          Ready to Transform <span>Your Space?</span>
        </h2>
        <p className="fade-in delay-1">
          Browse our premium collection or get a custom design made just for
          you.
        </p>
        <div className="about-cta-btns fade-in delay-2">
          <Link to="/products" className="about-cta-primary">
            View Collection
          </Link>
          <Link to="/order" className="about-cta-secondary">
            Custom Order
          </Link>
        </div>
      </section>

      <BackButton />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default About;
