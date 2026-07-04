import { useState, useEffect } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/products";
import axios from "axios";
import { getCategories } from "../api/categories";

// Theme colors
const COLORS = {
  background: "#0A0F1E",
  card: "#0D1B2E",
  cyan: "#00E5FF",
  red: "#FF5252",
  text: "#E6F1FF",
  muted: "#8AA0BF",
  border: "#1E3A5F",
  inputBg: "#10233A",
};

function Products() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    size: "",
    finish: "",
    stock: "",
    isCustom: false,
    images: [],
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    const uploadedUrls = [];
    for (let file of files) {
      const data = new FormData();
      data.append("image", file);
      const res = await axios.post(
        "https://seven-star-tile-vanity.onrender.com/api/upload",
        data,
      );
      uploadedUrls.push(res.data.imageUrl);
    }
    setImages([...images, ...uploadedUrls]);
    setFormData((prev) => ({ ...prev, images: [...images, ...uploadedUrls] }));
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editProduct) {
      await updateProduct(editProduct._id, formData);
    } else {
      await createProduct(formData);
    }
    resetForm();
    loadProducts();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditProduct(null);
    setImages([]);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      size: "",
      finish: "",
      stock: "",
      isCustom: false,
      images: [],
    });
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setImages(product.images || []);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      size: product.size || "",
      finish: product.finish || "",
      stock: product.stock,
      isCustom: product.isCustom || false,
      images: product.images || [],
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      loadProducts();
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  // Shared input style
  const inputStyle = {
    padding: "12px 14px",
    borderRadius: "8px",
    border: `1px solid ${COLORS.border}`,
    background: COLORS.inputBg,
    color: COLORS.text,
    fontSize: "14px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };

  return (
    <div
      className="products-page"
      style={{
        padding: "24px",
        background: COLORS.background,
        minHeight: "100vh",
        color: COLORS.text,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <style>{`
        .desktop-table { display: table; }
        .mobile-cards { display: none; }

        .product-card {
          background: ${COLORS.card};
          border: 1px solid ${COLORS.border};
          border-radius: 14px;
          padding: 14px;
          margin-bottom: 12px;
          display: flex;
          gap: 14px;
        }
        .product-card-thumb {
          width: 64px;
          height: 64px;
          border-radius: 8px;
          background: #fff;
          object-fit: contain;
          flex-shrink: 0;
        }
        .product-card-actions {
          display: flex;
          gap: 8px;
          margin-top: 10px;
        }
        .product-card-actions button { flex: 1; }

        @media (max-width: 768px) {
          .products-page { padding: 16px !important; }

          .products-header {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 14px !important;
          }
          .products-header button { width: 100%; }

          .form-grid {
            grid-template-columns: 1fr !important;
          }

          .form-action-buttons {
            flex-direction: column !important;
          }
          .form-action-buttons button { width: 100%; }

          .desktop-table { display: none !important; }
          .mobile-cards { display: block !important; }
        }
      `}</style>

      {/* Header */}
      <div
        className="products-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "26px", fontWeight: "700" }}>
          Products
        </h1>
        <button
          onClick={() => setShowForm(true)}
          style={{
            background: COLORS.cyan,
            color: "#04141C",
            padding: "12px 22px",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "700",
            fontSize: "14px",
            boxShadow: `0 0 14px ${COLORS.cyan}55`,
            transition: "transform 0.15s ease",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          + Add Product
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div
          style={{
            background: COLORS.card,
            padding: "24px",
            borderRadius: "14px",
            margin: "20px 0",
            border: `1px solid ${COLORS.border}`,
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          }}
        >
          <h2
            style={{
              margin: "0 0 18px 0",
              fontSize: "20px",
              borderLeft: `4px solid ${COLORS.cyan}`,
              paddingLeft: "10px",
            }}
          >
            {editProduct ? "Edit Product" : "Add New Product"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div
              className="form-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "14px",
              }}
            >
              <input
                placeholder="Product Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                style={inputStyle}
              />

              <input
                placeholder="Price (leave 0 for custom)"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                style={inputStyle}
              />

              {/* Category Dropdown */}
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                style={inputStyle}
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
                <option value="Custom Order">Custom Order</option>
              </select>

              <input
                placeholder='Size (32", 36", 48"...)'
                value={formData.size}
                onChange={(e) =>
                  setFormData({ ...formData, size: e.target.value })
                }
                style={inputStyle}
              />

              <input
                placeholder="Finish (Glossy, Matte...)"
                value={formData.finish}
                onChange={(e) =>
                  setFormData({ ...formData, finish: e.target.value })
                }
                style={inputStyle}
              />

              <input
                placeholder="Stock quantity"
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                style={inputStyle}
              />
            </div>

            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              style={{
                ...inputStyle,
                display: "block",
                marginTop: "14px",
                height: "90px",
                resize: "vertical",
              }}
            />

            {/* Custom Order Checkbox */}
            <div
              style={{
                margin: "16px 0",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: COLORS.inputBg,
                padding: "12px 14px",
                borderRadius: "8px",
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <input
                type="checkbox"
                id="isCustom"
                checked={formData.isCustom}
                onChange={(e) =>
                  setFormData({ ...formData, isCustom: e.target.checked })
                }
                style={{
                  width: "18px",
                  height: "18px",
                  cursor: "pointer",
                  accentColor: COLORS.cyan,
                  flexShrink: 0,
                }}
              />
              <label
                htmlFor="isCustom"
                style={{
                  fontSize: "14px",
                  cursor: "pointer",
                  fontWeight: "500",
                  color: COLORS.text,
                }}
              >
                This is a Custom Order product (price will show as "Call for
                Price")
              </label>
            </div>

            {/* Image Upload */}
            <div style={{ margin: "16px 0" }}>
              <label
                style={{
                  fontWeight: "600",
                  display: "block",
                  marginBottom: "8px",
                  color: COLORS.cyan,
                  fontSize: "13px",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                Upload Images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                style={{
                  display: "block",
                  margin: "8px 0",
                  color: COLORS.muted,
                  maxWidth: "100%",
                }}
              />
              {uploading && (
                <p style={{ color: COLORS.cyan, fontSize: "13px" }}>
                  Uploading...
                </p>
              )}

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                  marginTop: "12px",
                }}
              >
                {images.map((img, index) => (
                  <div key={index} style={{ position: "relative" }}>
                    <img
                      src={img}
                      alt=""
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "contain",
                        borderRadius: "8px",
                        border: `1px solid ${COLORS.border}`,
                        background: "#fff",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        background: COLORS.red,
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "22px",
                        height: "22px",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: "bold",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="form-action-buttons"
              style={{ display: "flex", gap: "12px", marginTop: "16px" }}
            >
              <button
                type="submit"
                style={{
                  background: COLORS.cyan,
                  color: "#04141C",
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "700",
                  boxShadow: `0 0 12px ${COLORS.cyan}55`,
                }}
              >
                {editProduct ? "Update" : "Save"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                style={{
                  background: "transparent",
                  color: COLORS.muted,
                  padding: "12px 24px",
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===== DESKTOP: Products Table ===== */}
      <div
        style={{
          background: COLORS.card,
          borderRadius: "14px",
          overflow: "hidden",
          border: `1px solid ${COLORS.border}`,
          marginTop: "20px",
        }}
      >
        <table
          className="desktop-table"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr
              style={{
                background: COLORS.inputBg,
                color: COLORS.cyan,
                textTransform: "uppercase",
                fontSize: "12px",
                letterSpacing: "0.5px",
              }}
            >
              <th style={{ padding: "14px", textAlign: "left" }}>Image</th>
              <th style={{ padding: "14px", textAlign: "left" }}>Name</th>
              <th style={{ padding: "14px", textAlign: "left" }}>Category</th>
              <th style={{ padding: "14px", textAlign: "left" }}>Price</th>
              <th style={{ padding: "14px", textAlign: "left" }}>Stock</th>
              <th style={{ padding: "14px", textAlign: "left" }}>Custom</th>
              <th style={{ padding: "14px", textAlign: "left" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product._id}
                style={{
                  borderBottom: `1px solid ${COLORS.border}`,
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#102742")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <td style={{ padding: "12px" }}>
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt=""
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "contain",
                        borderRadius: "8px",
                        background: "#fff",
                      }}
                    />
                  ) : (
                    <span style={{ color: COLORS.muted }}>—</span>
                  )}
                </td>
                <td style={{ padding: "12px", fontWeight: "600" }}>
                  {product.name}
                </td>
                <td style={{ padding: "12px", color: COLORS.muted }}>
                  {product.category}
                </td>
                <td
                  style={{
                    padding: "12px",
                    color: COLORS.cyan,
                    fontWeight: "600",
                  }}
                >
                  {product.isCustom ? "Call for Price" : `Rs ${product.price}`}
                </td>
                <td style={{ padding: "12px" }}>{product.stock}</td>
                <td style={{ padding: "12px" }}>
                  {product.isCustom ? (
                    <span
                      style={{
                        background: `${COLORS.cyan}22`,
                        color: COLORS.cyan,
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "700",
                      }}
                    >
                      ✅ Yes
                    </span>
                  ) : (
                    <span style={{ color: COLORS.muted }}>—</span>
                  )}
                </td>
                <td style={{ padding: "12px" }}>
                  <button
                    onClick={() => handleEdit(product)}
                    style={{
                      background: "transparent",
                      color: COLORS.cyan,
                      padding: "6px 14px",
                      border: `1px solid ${COLORS.cyan}`,
                      borderRadius: "6px",
                      cursor: "pointer",
                      marginRight: "8px",
                      fontWeight: "600",
                      fontSize: "13px",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    style={{
                      background: COLORS.red,
                      color: "white",
                      padding: "6px 14px",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "13px",
                      boxShadow: `0 0 10px ${COLORS.red}44`,
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== MOBILE: Product Cards ===== */}
      <div className="mobile-cards" style={{ marginTop: "20px" }}>
        {products.map((product) => (
          <div key={product._id} className="product-card">
            {product.images && product.images[0] ? (
              <img
                className="product-card-thumb"
                src={product.images[0]}
                alt=""
              />
            ) : (
              <div
                className="product-card-thumb"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: COLORS.muted,
                  fontSize: "12px",
                  background: COLORS.inputBg,
                }}
              >
                No img
              </div>
            )}

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "8px",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontWeight: 700,
                    fontSize: "15px",
                    color: COLORS.text,
                  }}
                >
                  {product.name}
                </p>
                {product.isCustom && (
                  <span
                    style={{
                      background: `${COLORS.cyan}22`,
                      color: COLORS.cyan,
                      padding: "3px 9px",
                      borderRadius: "20px",
                      fontSize: "11px",
                      fontWeight: "700",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    ✅ Custom
                  </span>
                )}
              </div>

              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "13px",
                  color: COLORS.muted,
                }}
              >
                {product.category}
              </p>

              <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: COLORS.cyan,
                  }}
                >
                  {product.isCustom ? "Call for Price" : `Rs ${product.price}`}
                </span>
                <span style={{ fontSize: "13px", color: COLORS.muted }}>
                  Stock: {product.stock}
                </span>
              </div>

              <div className="product-card-actions">
                <button
                  onClick={() => handleEdit(product)}
                  style={{
                    background: "transparent",
                    color: COLORS.cyan,
                    padding: "8px 14px",
                    border: `1px solid ${COLORS.cyan}`,
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "13px",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  style={{
                    background: COLORS.red,
                    color: "white",
                    padding: "8px 14px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "13px",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <p
          style={{
            textAlign: "center",
            color: COLORS.muted,
            marginTop: "40px",
          }}
        >
          No products found — Click Add Product!
        </p>
      )}
    </div>
  );
}

export default Products;
