import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import Navbar from "../../components/Navbar/Navbar";
import BackButton from "../../components/BackButton/BackButton";
import Footer from "../../components/Footer/Footer";
import WhatsAppButton from "../../components/WhatsAppButton/WhatsAppButton";
import "./Terms.css";

const TABS = [
  { id: "terms", label: "Terms of Service" },
  { id: "privacy", label: "Privacy Policy" },
  { id: "return", label: "Return Policy" },
];

function Terms() {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "terms";
  const [activeTab, setActiveTab] = useState(defaultTab);

  // scroll animation
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
      { threshold: 0.08 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [activeTab]);

  return (
    <div className="policies-page">
      <Helmet>
        <title>
          Terms, Privacy &amp; Return Policy | Seven Star Tile Vanity
        </title>
        <meta
          name="description"
          content="Read Seven Star Tile Vanity's terms of service, privacy policy, and 7-day return policy before placing your order for custom tiles and vanities."
        />
        <link rel="canonical" href="https://www.7startilevanity.com/terms" />
      </Helmet>

      <Navbar />

      {/* ── HERO ── */}
      <section className="p-hero">
        <div className="p-hero-top-line" aria-hidden="true" />
        <div className="p-hero-pattern" aria-hidden="true" />
        <div className="p-hero-inner">
          <span className="p-eyebrow fade-in">Legal &amp; Policies</span>
          <h1 className="fade-in delay-1">
            Our <em>Policies</em>
          </h1>
          <div className="p-ornament fade-in delay-2" aria-hidden="true">
            <span className="po-line r" />
            <span className="po-star">✦</span>
            <span className="po-line" />
          </div>
          <p className="p-hero-sub fade-in delay-2">
            Please read our terms, privacy &amp; return policies carefully
            before placing an order.
          </p>
        </div>
      </section>

      {/* ── TABS ── */}
      <div className="p-body">
        <div className="p-tabs fade-in">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`p-tab${activeTab === t.id ? " active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── TERMS OF SERVICE ── */}
        {activeTab === "terms" && (
          <div className="p-box fade-in">
            <div className="p-box-header">
              <h2>Terms of Service</h2>
              <span className="p-updated">Last updated: January 2024</span>
            </div>

            <div className="p-section fade-in">
              <div className="p-section-num">01</div>
              <div className="p-section-body">
                <h3>Order Confirmation</h3>
                <p>
                  After submitting your order, a Seven Star Tile Vanity
                  representative will contact you via phone or WhatsApp. Final
                  price, advance payment, and delivery details will be confirmed
                  during the call. Your order is only confirmed once the advance
                  payment is received.
                </p>
              </div>
            </div>

            <div className="p-section fade-in delay-1">
              <div className="p-section-num">02</div>
              <div className="p-section-body">
                <h3>Custom Orders</h3>
                <p>
                  Pricing for custom size or design orders will be discussed
                  over the phone. A <strong>50% advance payment</strong> is
                  required for all custom orders. Custom orders cannot be
                  cancelled once production has started.
                </p>
              </div>
            </div>

            <div className="p-section fade-in delay-2">
              <div className="p-section-num">03</div>
              <div className="p-section-body">
                <h3>Delivery Policy</h3>
                <p>
                  Seven Star Tile Vanity delivers across all of Pakistan. You
                  may choose one of the following options:
                </p>
                <ul>
                  <li>
                    <strong>Factory Pickup —</strong> Collect your order
                    directly from our factory at no additional cost.
                  </li>
                  <li>
                    <strong>Home Delivery —</strong> We deliver to your address.
                    Delivery charges vary by city and distance and will be
                    confirmed during your order call.
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-section p-highlight fade-in delay-1">
              <div className="p-section-num warn">⚠</div>
              <div className="p-section-body">
                <h3>Breaking &amp; Damage Policy — Important</h3>
                <p>
                  Seven Star Tile Vanity takes full responsibility for the
                  quality of its products. The following policy applies to any
                  damage:
                </p>
                <ul>
                  <li>
                    <strong>Manufacturing Defect —</strong> If the product has a
                    manufacturing defect or damage caused by us, we will fully
                    replace or refund the product.
                  </li>
                  <li>
                    <strong>Transit Damage —</strong> We are not responsible for
                    breakage that occurs during transit. If a claim is made for
                    transit damage, additional charges will apply and will be
                    discussed via call.
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-section fade-in">
              <div className="p-section-num">05</div>
              <div className="p-section-body">
                <h3>Payment Terms</h3>
                <p>
                  Advance payment is required after order confirmation. The
                  remaining balance must be paid before or at the time of
                  delivery. Payment methods will be discussed during your
                  confirmation call.
                </p>
              </div>
            </div>

            <div className="p-section fade-in delay-1">
              <div className="p-section-num">06</div>
              <div className="p-section-body">
                <h3>Product Availability</h3>
                <p>
                  Products and prices listed on the website are subject to
                  change. Final pricing will always be confirmed via call.
                  Availability and delivery timelines for custom orders will
                  also be communicated during the call.
                </p>
              </div>
            </div>

            <div className="p-section fade-in delay-2">
              <div className="p-section-num">07</div>
              <div className="p-section-body">
                <h3>Intellectual Property</h3>
                <p>
                  All content on this website, including product photography,
                  designs, logos, and written material, is the property of Seven
                  Star Tile Vanity and may not be copied or reproduced without
                  prior written permission.
                </p>
              </div>
            </div>

            <div className="p-section fade-in">
              <div className="p-section-num">08</div>
              <div className="p-section-body">
                <h3>Governing Law</h3>
                <p>
                  These terms are governed by the laws of Pakistan. Any disputes
                  arising from an order or transaction will first be addressed
                  through direct communication with our team before any other
                  action is taken.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── PRIVACY POLICY ── */}
        {activeTab === "privacy" && (
          <div className="p-box fade-in">
            <div className="p-box-header">
              <h2>Privacy Policy</h2>
              <span className="p-updated">Last updated: January 2024</span>
            </div>

            <div className="p-section fade-in">
              <div className="p-section-num">01</div>
              <div className="p-section-body">
                <h3>Information We Collect</h3>
                <p>
                  When you place an order or contact us, we may collect the
                  following information:
                </p>
                <ul>
                  <li>Your name and contact number</li>
                  <li>Delivery address</li>
                  <li>Order details</li>
                  <li>WhatsApp message history</li>
                </ul>
              </div>
            </div>

            <div className="p-section fade-in delay-1">
              <div className="p-section-num">02</div>
              <div className="p-section-body">
                <h3>How We Use Your Information</h3>
                <p>
                  Your information is used strictly for the following purposes:
                </p>
                <ul>
                  <li>Processing your order</li>
                  <li>Coordinating delivery</li>
                  <li>Providing customer support</li>
                  <li>Sending order updates</li>
                </ul>
              </div>
            </div>

            <div className="p-section fade-in delay-2">
              <div className="p-section-num">03</div>
              <div className="p-section-body">
                <h3>Information Sharing</h3>
                <p>
                  We do not share your personal information with any third
                  parties. Your data is used exclusively for Seven Star Tile
                  Vanity's internal operations.
                </p>
              </div>
            </div>

            <div className="p-section fade-in">
              <div className="p-section-num">04</div>
              <div className="p-section-body">
                <h3>Data Security</h3>
                <p>
                  Your information is kept secure at all times. We never share
                  your phone number or address with anyone outside our team.
                </p>
              </div>
            </div>

            <div className="p-section fade-in delay-1">
              <div className="p-section-num">05</div>
              <div className="p-section-body">
                <h3>Data Retention</h3>
                <p>
                  We retain your order information only for as long as necessary
                  to fulfil your order and provide after-sales support. You may
                  request that we delete your information at any time by
                  contacting us on WhatsApp.
                </p>
              </div>
            </div>

            <div className="p-section fade-in delay-2">
              <div className="p-section-num">06</div>
              <div className="p-section-body">
                <h3>Contact Us</h3>
                <p>
                  For any privacy-related queries, please contact us on
                  WhatsApp: <strong>0323 7429771</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── RETURN POLICY ── */}
        {activeTab === "return" && (
          <div className="p-box fade-in">
            <div className="p-box-header">
              <h2>Return Policy</h2>
              <span className="p-updated">Last updated: January 2024</span>
            </div>

            <div className="p-section p-highlight green fade-in">
              <div className="p-section-num green">✓</div>
              <div className="p-section-body">
                <h3>7-Day Return Policy</h3>
                <p>
                  Seven Star Tile Vanity offers a{" "}
                  <strong>7-day return policy</strong> on eligible products. If
                  you are not satisfied with your purchase, you may return it
                  within 7 days of delivery.
                </p>
              </div>
            </div>

            <div className="p-section fade-in delay-1">
              <div className="p-section-num">01</div>
              <div className="p-section-body">
                <h3>Eligible for Return</h3>
                <ul>
                  <li>Product has a manufacturing defect</li>
                  <li>Product does not match the description</li>
                  <li>Wrong product was delivered</li>
                  <li>Damage caused by the company</li>
                </ul>
              </div>
            </div>

            <div className="p-section fade-in delay-2">
              <div className="p-section-num">02</div>
              <div className="p-section-body">
                <h3>Not Eligible for Return</h3>
                <ul>
                  <li>Return request made after 7 days</li>
                  <li>Damage caused by the customer</li>
                  <li>Custom orders (custom size or design)</li>
                  <li>Product has already been installed</li>
                  <li>Transit breakage (separate charges apply)</li>
                </ul>
              </div>
            </div>

            <div className="p-section fade-in">
              <div className="p-section-num">03</div>
              <div className="p-section-body">
                <h3>Return Process</h3>
                <div className="steps">
                  <div className="step">
                    <span className="step-num">1</span>
                    <div>
                      <strong>Contact Us</strong>
                      <p>Message us on WhatsApp within 7 days of delivery.</p>
                    </div>
                  </div>
                  <div className="step">
                    <span className="step-num">2</span>
                    <div>
                      <strong>Send Photos</strong>
                      <p>Share clear photos of the product issue.</p>
                    </div>
                  </div>
                  <div className="step">
                    <span className="step-num">3</span>
                    <div>
                      <strong>Return Approved</strong>
                      <p>
                        Once approved, send the product back to our factory.
                      </p>
                    </div>
                  </div>
                  <div className="step">
                    <span className="step-num">4</span>
                    <div>
                      <strong>Refund / Replacement</strong>
                      <p>Processed within 3–5 business days.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-section fade-in delay-1">
              <div className="p-section-num">04</div>
              <div className="p-section-body">
                <h3>Refund Method</h3>
                <p>
                  Approved refunds are returned via the same payment method
                  used. Processing time is <strong>3–5 working days</strong>.
                </p>
              </div>
            </div>

            <div className="p-section fade-in delay-2">
              <div className="p-section-num">05</div>
              <div className="p-section-body">
                <h3>Contact for Returns</h3>
                <p>
                  WhatsApp: <strong>0323 7429771</strong>
                </p>
                <p>Business Hours: Monday – Saturday, 9am – 7pm</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <BackButton />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default Terms;
