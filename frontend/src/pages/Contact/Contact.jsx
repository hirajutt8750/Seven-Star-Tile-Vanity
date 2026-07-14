import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "../../components/Navbar/Navbar";
import BackButton from "../../components/BackButton/BackButton";
import Footer from "../../components/Footer/Footer";
import WhatsAppButton from "../../components/WhatsAppButton/WhatsAppButton";
import ownerPhoto from "../../assets/owner.jpg";
import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "https://seven-star-tile-vanity.onrender.com/api/contact",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        setFormData({ name: "", phone: "", email: "", message: "" });
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Server se connect nahi ho saka. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Contact Us | Seven Star Tile Vanity</title>
        <meta
          name="description"
          content="Get in touch with Seven Star Tile Vanity for orders, pricing, and custom designs. WhatsApp, call or email us — based in Gujranwala, Pakistan, serving worldwide."
        />
      </Helmet>
      <Navbar />

      {/* HERO SECTION */}
      <div className="contact-hero">
        <div className="contact-hero-overlay">
          <h4 className="contact-tag">GET IN TOUCH</h4>
          <h1>
            Let's Talk About Your <span>Order</span>
          </h1>
          <p>
            Have a question, need pricing, or want a custom design? We're here
            to help you every step of the way.
          </p>
        </div>
      </div>

      {/* MAIN SECTION */}
      <div className="contact-section">
        <div className="contact-wrapper">
          {/* MEET THE OWNER SECTION */}
          <div className="owner-card">
            <div className="owner-photo-wrap">
              <div className="owner-photo-inner">
                <img
                  src={ownerPhoto}
                  alt="Saad Bin Saeed - Owner, Seven Star Tile Vanity"
                  className="owner-photo"
                />
              </div>
            </div>
            <div className="owner-info">
              <span className="owner-quote-mark">"</span>
              <span className="owner-label">The Owner</span>
              <h2 className="owner-name">Saad Bin Saeed</h2>
              <div className="owner-divider"></div>
              <p className="owner-role">Owner &amp; Manager</p>
              <p className="owner-quote">
                We respond within one hour on WhatsApp. Every custom order is
                personally overseen from design to delivery.
              </p>
              <div className="owner-status">
                <span className="status-dot"></span>
                Available Now
              </div>
            </div>
          </div>

          <div className="contact-container">
            {/* LEFT SIDE */}
            <div className="contact-info">
              <h2>Contact Information</h2>
              <p className="contact-desc">
                Feel free to reach out for orders, pricing inquiries, or custom
                design discussions. We respond quickly on WhatsApp.
              </p>

              <div className="info-cards">
                <div className="info-card">
                  <span>📍</span>
                  <div>
                    <h4>Address</h4>
                    <p>Gujranwala, Pakistan</p>
                  </div>
                </div>
                <div className="info-card">
                  <span>📞</span>
                  <div>
                    <h4>Phone</h4>
                    <p>0323 7429771</p>
                  </div>
                </div>
                <div className="info-card">
                  <span>💬</span>
                  <div>
                    <h4>WhatsApp</h4>
                    <p>0323 7429771</p>
                  </div>
                </div>
                <div className="info-card">
                  <span>📧</span>
                  <div>
                    <h4>Email</h4>
                    <p>saadbinsaeed674@gmail.com</p>
                  </div>
                </div>
                <div className="info-card">
                  <span>🕐</span>
                  <div>
                    <h4>Business Hours</h4>
                    <p>Sat – Thu: 9am – 7pm</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="contact-form-box">
              {submitted ? (
                <div className="success-msg">
                  <div className="success-icon">✓</div>
                  <h3>Message Sent Successfully!</h3>
                  <p>
                    We have received your message and will contact you shortly
                    on Email or WhatsApp.
                  </p>
                  <button onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <div>
                  <h2>Send a Message</h2>
                  <form onSubmit={handleSubmit} className="contact-form">
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="text"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email (Optional)"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <textarea
                      name="message"
                      placeholder="Write your message..."
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      required
                    ></textarea>

                    {error && <p className="form-error">{error}</p>}

                    <button type="submit" disabled={loading}>
                      {loading ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <BackButton />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default Contact;
