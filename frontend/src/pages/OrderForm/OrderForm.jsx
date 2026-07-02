import React, { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import WhatsAppButton from "../../components/WhatsAppButton/WhatsAppButton";
import { PhoneInput, COUNTRIES } from "../../components/PhoneInput/PhoneInput";
import "./OrderForm.css";

function normalizeSize(size) {
  if (!size) return "";
  const s = String(size).replace(/['"]/g, "").trim();
  if (s === "32") return '32"';
  if (s === "36") return '36"';
  if (s === "48") return '48"';
  if (s === '32"') return '32"';
  if (s === '36"') return '36"';
  if (s === '48"') return '48"';
  return "Custom";
}

function normalizeFinish(finish) {
  if (!finish) return "";
  const f = finish.trim().toLowerCase();
  if (f === "glossy") return "Glossy";
  if (f === "matte") return "Matte";
  if (f === "rough") return "Rough";
  return finish;
}

function normalizeProductType(category) {
  if (!category) return "";
  const c = category.toLowerCase();
  if (c.includes("vanity") || c.includes("double bowl")) return "Vanity";
  if (c.includes("floor")) return "Floor Tile";
  if (c.includes("wall")) return "Wall Tile";
  if (c.includes("custom")) return "Custom Tile";
  return "";
}

function normalizeCategory(category) {
  if (!category) return "";
  const c = category.toLowerCase();
  if (c.includes("double bowl")) return "Double Bowl";
  if (c.includes("fancy")) return "Fancy";
  if (c.includes("simple")) return "Simple";
  if (c.includes("custom")) return "Custom";
  return "";
}

const DEFAULT_COUNTRY = COUNTRIES.find((c) => c.code === "PK");

function OrderForm() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const selectedProduct = location.state?.selectedProduct || null;

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    altPhone: "",
    city: "",
    address: "",
    productType: normalizeProductType(selectedProduct?.category),
    category: normalizeCategory(selectedProduct?.category),
    size: normalizeSize(selectedProduct?.size),
    customWidth: "",
    customHeight: "",
    color: selectedProduct?.color || "",
    finish: normalizeFinish(selectedProduct?.finish),
    design: selectedProduct?.name || "",
    quantity: "",
    specialNotes: "",
    deliveryMethod: "home",
    deliveryAddress: "",
    deliveryDate: "",
    urgency: "normal",
  });

  // Track selected country for each phone field
  const [phoneCountry, setPhoneCountry] = useState(DEFAULT_COUNTRY);
  const [altPhoneCountry, setAltPhoneCountry] = useState(DEFAULT_COUNTRY);

  const [errors, setErrors] = useState({});
  const [customImages, setCustomImages] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle PhoneInput changes (they carry _country)
    if (name === "phone") {
      if (e.target._country) setPhoneCountry(e.target._country);
      setFormData((prev) => ({ ...prev, phone: value }));
      if (errors.phone) setErrors((prev) => ({ ...prev, phone: false }));
      return;
    }
    if (name === "altPhone") {
      if (e.target._country) setAltPhoneCountry(e.target._country);
      setFormData((prev) => ({ ...prev, altPhone: value }));
      if (errors.altPhone) setErrors((prev) => ({ ...prev, altPhone: false }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const remaining = 5 - customImages.length;
    const toAdd = files.slice(0, remaining);
    const newImages = toAdd.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setCustomImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setCustomImages((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = true;

    // Phone validation — per country
    if (!formData.phone.trim()) {
      newErrors.phone = "required";
    } else if (
      formData.phone.length < phoneCountry.minLen ||
      formData.phone.length > phoneCountry.maxLen
    ) {
      newErrors.phone = "length";
    }

    // Alt Phone validation — per country
    if (!formData.altPhone.trim()) {
      newErrors.altPhone = "required";
    } else if (
      formData.altPhone.length < altPhoneCountry.minLen ||
      formData.altPhone.length > altPhoneCountry.maxLen
    ) {
      newErrors.altPhone = "length";
    }

    if (!formData.city.trim()) newErrors.city = true;
    if (!formData.address.trim()) newErrors.address = true;
    if (formData.deliveryMethod === "home" && !formData.deliveryAddress.trim())
      newErrors.deliveryAddress = true;
    if (!formData.deliveryDate.trim()) newErrors.deliveryDate = true;
    if (!formData.urgency.trim()) newErrors.urgency = true;
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErrorField = document.querySelector(
        ".input-error, .phone-input-error",
      );
      if (firstErrorField)
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const fullPhone = phoneCountry.dialCode + formData.phone;
    const fullAltPhone = formData.altPhone
      ? altPhoneCountry.dialCode + formData.altPhone
      : "";

    const orderData = {
      ...formData,
      phone: fullPhone,
      altPhone: fullAltPhone,
      cartItems: cartItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice: totalPrice || 0,
    };

    try {
      const res = await fetch(
        "https://seven-star-tile-vanity.onrender.com/api/orders",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        },
      );

      if (!res.ok) throw new Error("Order submit failed");

      await res.json();
      setSubmitted(true);
      clearCart();
    } catch (err) {
      console.error(err);
      alert("Order submit failed, please try again.");
    }
  };

  if (submitted) {
    return (
      <div style={{ backgroundColor: "#0F0F0F", minHeight: "100vh" }}>
        <Navbar />
        <div className="order-success">
          <div className="success-box">
            <span className="success-icon">✅</span>
            <h2>Order Request Submitted!</h2>
            <p>We will contact you shortly to confirm your order</p>
            <p className="success-note">
              Final price and payment will be confirmed on call
            </p>
            <Link to="/" className="success-home-btn">
              ← Back to Home
            </Link>
          </div>
        </div>
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#0F0F0F", minHeight: "100vh" }}>
      <Helmet>
        <title>Place Your Order | Seven Star Tile Vanity</title>
        <meta
          name="description"
          content="Order custom vanities and tiles from Seven Star Tile Vanity. Choose size, color, finish and delivery details — factory-direct quality."
        />
      </Helmet>
      <Navbar />
      <div className="order-page">
        <div className="order-hero-right">
          <h1>Let's Bring Your Vision to Lifer</h1>
          <p>
            Fill out the form below,and our team will get in touch with you
            shortly.
          </p>
        </div>
        <div className="order-container">
          <form onSubmit={handleSubmit} className="order-form" noValidate>
            <div className="form-section">
              <div className="section-title">
                <span className="section-icon">👤</span>
                <span>1. Customer Information</span>
              </div>
              <div className="form-grid-3">
                <div className="form-group">
                  <label>
                    Full Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={errors.fullName ? "input-error" : ""}
                  />
                  {errors.fullName && (
                    <span className="error-msg">
                      ⚠ Please enter your full name
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label>
                    Phone Number <span className="required">*</span>
                  </label>
                  <PhoneInput
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                  />
                  {errors.phone === "required" && (
                    <span className="error-msg">
                      ⚠ Please enter your phone number
                    </span>
                  )}
                  {errors.phone === "length" && (
                    <span className="error-msg">
                      ⚠ Enter{" "}
                      {phoneCountry.minLen === phoneCountry.maxLen
                        ? phoneCountry.maxLen
                        : `${phoneCountry.minLen}–${phoneCountry.maxLen}`}{" "}
                      digits for {phoneCountry.name}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label>
                    Alternate Phone <span className="required">*</span>
                  </label>
                  <PhoneInput
                    name="altPhone"
                    value={formData.altPhone}
                    onChange={handleChange}
                    error={!!errors.altPhone}
                  />
                  {errors.altPhone === "required" && (
                    <span className="error-msg">
                      ⚠ Please enter alternate phone number
                    </span>
                  )}
                  {errors.altPhone === "length" && (
                    <span className="error-msg">
                      ⚠ Enter{" "}
                      {altPhoneCountry.minLen === altPhoneCountry.maxLen
                        ? altPhoneCountry.maxLen
                        : `${altPhoneCountry.minLen}–${altPhoneCountry.maxLen}`}{" "}
                      digits for {altPhoneCountry.name}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>
                    City <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={handleChange}
                    className={errors.city ? "input-error" : ""}
                  />
                  {errors.city && (
                    <span className="error-msg">⚠ Please enter your city</span>
                  )}
                </div>
                <div className="form-group">
                  <label>
                    Full Address <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Enter full address"
                    value={formData.address}
                    onChange={handleChange}
                    className={errors.address ? "input-error" : ""}
                  />
                  {errors.address && (
                    <span className="error-msg">
                      ⚠ Please enter your address
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-title">
                <span className="section-icon">📦</span>
                <span>2. Product Details</span>
              </div>
              {selectedProduct && (
                <div className="autofill-product-card">
                  <div className="autofill-badge">✓ Product Auto-Selected</div>
                  <div className="autofill-content">
                    {selectedProduct.image && (
                      <div className="autofill-img">
                        <img
                          src={selectedProduct.image}
                          alt={selectedProduct.name}
                        />
                      </div>
                    )}
                    <div className="autofill-info">
                      <h4>{selectedProduct.name}</h4>
                      {selectedProduct.category && (
                        <p>
                          Category: <strong>{selectedProduct.category}</strong>
                        </p>
                      )}
                      {selectedProduct.size && (
                        <p>
                          Size: <strong>{selectedProduct.size}</strong>
                        </p>
                      )}
                      {selectedProduct.finish && (
                        <p>
                          Finish: <strong>{selectedProduct.finish}</strong>
                        </p>
                      )}
                      {selectedProduct.color && (
                        <p>
                          Color: <strong>{selectedProduct.color}</strong>
                        </p>
                      )}
                      {selectedProduct.price && (
                        <p>
                          Price:{" "}
                          <strong>
                            Rs. {selectedProduct.price?.toLocaleString()}
                          </strong>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div className="form-grid-3">
                <div className="form-group">
                  <label>
                    Product Type <span className="optional-tag">Optional</span>
                  </label>
                  <select
                    name="productType"
                    value={formData.productType}
                    onChange={handleChange}
                  >
                    <option value="">Select product type</option>
                    <option value="Vanity">Vanity</option>
                    <option value="Custom Tile">Custom Tile</option>
                    <option value="Floor Tile">Floor Tile</option>
                    <option value="Wall Tile">Wall Tile</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>
                    Category <span className="optional-tag">Optional</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">Select category</option>
                    <option value="Simple">Simple</option>
                    <option value="Fancy">Fancy</option>
                    <option value="Double Bowl">Double Bowl</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>
                    Size <span className="optional-tag">Optional</span>
                  </label>
                  <select
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                  >
                    <option value="">Select size</option>
                    <option value='32"'>32"</option>
                    <option value='36"'>36"</option>
                    <option value='48"'>48"</option>
                    <option value="Custom">Custom Size</option>
                  </select>
                </div>
              </div>
              {formData.size === "Custom" && (
                <div className="form-grid-3">
                  <div className="form-group">
                    <label>Width (inch)</label>
                    <input
                      type="number"
                      name="customWidth"
                      placeholder="Width"
                      value={formData.customWidth}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Height (inch)</label>
                    <input
                      type="number"
                      name="customHeight"
                      placeholder="Height"
                      value={formData.customHeight}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
              <div className="form-grid-3">
                <div className="form-group">
                  <label>
                    Color <span className="optional-tag">Optional</span>
                  </label>
                  <select
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                  >
                    <option value="">Select color</option>
                    <option value="Black Gold">Black Gold</option>
                    <option value="White Marble">White Marble</option>
                    <option value="Black Marble">Black Marble</option>
                    <option value="Custom Color">Custom Color</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>
                    Finish <span className="optional-tag">Optional</span>
                  </label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="finish"
                        value="Glossy"
                        checked={formData.finish === "Glossy"}
                        onChange={handleChange}
                      />{" "}
                      Glossy
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="finish"
                        value="Matte"
                        checked={formData.finish === "Matte"}
                        onChange={handleChange}
                      />{" "}
                      Matte
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="finish"
                        value="Rough"
                        checked={formData.finish === "Rough"}
                        onChange={handleChange}
                      />{" "}
                      Rough
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label>
                    Quantity <span className="optional-tag">Optional</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    placeholder="Enter quantity (Boxes/Pieces)"
                    value={formData.quantity}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>
                  Design / Model <span className="optional-tag">Optional</span>
                </label>
                <input
                  type="text"
                  name="design"
                  placeholder="Enter design or model name"
                  value={formData.design}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-section">
              <div className="section-title">
                <span className="section-icon">🎨</span>
                <span>
                  3. Custom Order{" "}
                  <span className="section-optional">(Optional)</span>
                </span>
              </div>
              <div className="custom-order-grid">
                <div className="form-group">
                  <label>
                    Upload Design / Reference Image{" "}
                    <span className="optional-tag">Optional</span>
                  </label>
                  <div
                    className="image-upload-box"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <span className="upload-box-icon">📎</span>
                    <span className="upload-box-text">Choose File</span>
                    <span className="upload-box-hint">
                      {customImages.length > 0
                        ? `${customImages.length} file(s) selected`
                        : "No file chosen"}
                    </span>
                  </div>
                  <p className="upload-hint">JPG, PNG or PDF. Max size 5MB</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*,.pdf"
                    multiple
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                  />
                  {customImages.length > 0 && (
                    <div className="upload-preview-grid">
                      {customImages.map((img, index) => (
                        <div key={index} className="upload-preview-item">
                          <img src={img.preview} alt={img.name} />
                          <button
                            type="button"
                            className="remove-img-btn"
                            onClick={() => removeImage(index)}
                          >
                            ✕
                          </button>
                          <span className="upload-preview-name">
                            {img.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label>
                    Special Notes / Instructions{" "}
                    <span className="optional-tag">Optional</span>
                  </label>
                  <textarea
                    name="specialNotes"
                    placeholder="Write any special notes or instructions..."
                    value={formData.specialNotes}
                    onChange={handleChange}
                    rows="5"
                    className="custom-textarea"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-title">
                <span className="section-icon">🚚</span>
                <span>4. Delivery Details</span>
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>
                    Delivery Method <span className="required">*</span>
                  </label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="home"
                        checked={formData.deliveryMethod === "home"}
                        onChange={handleChange}
                      />
                      Home Delivery
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="pickup"
                        checked={formData.deliveryMethod === "pickup"}
                        onChange={handleChange}
                      />
                      Factory Pickup
                    </label>
                  </div>
                </div>
                {formData.deliveryMethod === "home" && (
                  <div className="form-group">
                    <label>
                      Delivery Address <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="deliveryAddress"
                      placeholder="Enter delivery address"
                      value={formData.deliveryAddress}
                      onChange={handleChange}
                      className={errors.deliveryAddress ? "input-error" : ""}
                    />
                    {errors.deliveryAddress && (
                      <span className="error-msg">
                        ⚠ Please enter delivery address
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>
                    Required Delivery Date <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    name="deliveryDate"
                    value={formData.deliveryDate}
                    onChange={handleChange}
                    className={errors.deliveryDate ? "input-error" : ""}
                  />
                  {errors.deliveryDate && (
                    <span className="error-msg">
                      ⚠ Please select a delivery date
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label>
                    Urgency <span className="required">*</span>
                  </label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="urgency"
                        value="normal"
                        checked={formData.urgency === "normal"}
                        onChange={handleChange}
                      />{" "}
                      Normal
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="urgency"
                        value="urgent"
                        checked={formData.urgency === "urgent"}
                        onChange={handleChange}
                      />{" "}
                      Urgent ⚡
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {cartItems.length > 0 && (
              <div className="cart-summary-box">
                <h4>Cart Items</h4>
                {cartItems.map((item) => (
                  <div key={item.id} className="summary-item">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="summary-total">
                  <span>Total:</span>
                  <span>Rs. {totalPrice.toLocaleString()}</span>
                </div>
              </div>
            )}

            <div className="important-note">
              <span className="note-icon">⚠️</span>
              <div>
                <strong>Important Note</strong>
                <p>
                  After submitting the order, we will contact you on call. Final
                  price and advance payment will be confirmed on call.
                </p>
              </div>
            </div>

            <button type="submit" className="submit-btn">
              ✈ Submit Order Request
            </button>

            <div className="whatsapp-help">
              <div className="whatsapp-help-icon">💬</div>
              <div className="whatsapp-help-text">
                <p>Need Help? Contact us on WhatsApp</p>
                <a
                  href="https://wa.me/923XXXXXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chat With Us on WhatsApp
                </a>
              </div>
            </div>

            <div className="form-back">
              <Link to="/" className="form-back-btn">
                ← Back to Home
              </Link>
            </div>
          </form>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default OrderForm;
