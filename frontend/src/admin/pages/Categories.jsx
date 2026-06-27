import { useState, useEffect } from "react";
import axios from "axios";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const res = await axios.get(
      "https://seven-star-tile-vanity.onrender.com/api/categories",
    );
    setCategories(res.data);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setUploading(true);
    const data = new FormData();
    data.append("image", file);
    const res = await axios.post(
      "https://seven-star-tile-vanity.onrender.com/api/upload",
      data,
    );
    setImage(res.data.imageUrl);
    setFormData((prev) => ({ ...prev, image: res.data.imageUrl }));
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editCategory) {
      await axios.put(
        `https://seven-star-tile-vanity.onrender.com/api/categories/${editCategory._id}`,
        formData,
      );
    } else {
      await axios.post(
        "https://seven-star-tile-vanity.onrender.com/api/categories",
        formData,
      );
    }
    resetForm();
    loadCategories();
  };

  const handleEdit = (category) => {
    setEditCategory(category);
    setImage(category.image || "");
    setFormData({
      name: category.name,
      description: category.description || "",
      image: category.image || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await axios.delete(
        `https://seven-star-tile-vanity.onrender.com/api/categories/${id}`,
      );
      loadCategories();
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditCategory(null);
    setImage("");
    setFormData({ name: "", description: "", image: "" });
  };

  return (
    <div
      className="categories-page"
      style={{
        padding: "32px 36px",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        background: "#0A0F1E",
        minHeight: "100vh",
        color: "#E0E6F0",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .cat-card {
          background: linear-gradient(145deg, #0D1B2E, #0A1628);
          border: 1px solid rgba(0,229,255,0.12);
          border-radius: 16px;
          overflow: hidden;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .cat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.45);
          border-color: rgba(0,229,255,0.3);
        }

        .add-btn {
          display: flex; align-items: center; gap: 8px;
          background: rgba(0,229,255,0.1);
          color: #00E5FF;
          border: 1px solid rgba(0,229,255,0.3);
          padding: 10px 20px;
          border-radius: 10px;
          font-size: 14px; font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: 'Inter', sans-serif;
        }
        .add-btn:hover {
          background: rgba(0,229,255,0.18);
          box-shadow: 0 0 16px rgba(0,229,255,0.15);
        }

        .form-input {
          display: block; width: 100%;
          padding: 12px 16px;
          background: rgba(0,229,255,0.04);
          border: 1px solid rgba(0,229,255,0.15);
          border-radius: 10px;
          color: #E0E6F0;
          font-size: 14px;
          margin-bottom: 14px;
          outline: none;
          transition: all 0.25s ease;
          font-family: 'Inter', sans-serif;
          box-sizing: border-box;
        }
        .form-input::placeholder { color: #3A5A7A; }
        .form-input:focus {
          border-color: rgba(0,229,255,0.4);
          background: rgba(0,229,255,0.07);
          box-shadow: 0 0 12px rgba(0,229,255,0.1);
        }

        .save-btn {
          background: rgba(0,229,255,0.12);
          color: #00E5FF;
          border: 1px solid rgba(0,229,255,0.3);
          padding: 11px 24px;
          border-radius: 10px;
          font-size: 14px; font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: 'Inter', sans-serif;
        }
        .save-btn:hover {
          background: rgba(0,229,255,0.2);
          box-shadow: 0 0 14px rgba(0,229,255,0.15);
        }

        .cancel-btn {
          background: rgba(255,255,255,0.05);
          color: #8AAFC8;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 11px 24px;
          border-radius: 10px;
          font-size: 14px; font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: 'Inter', sans-serif;
        }
        .cancel-btn:hover {
          background: rgba(255,255,255,0.09);
          color: #E0E6F0;
        }

        .edit-btn {
          flex: 1;
          background: rgba(255,193,7,0.1);
          color: #FFC107;
          border: 1px solid rgba(255,193,7,0.25);
          padding: 8px;
          border-radius: 8px;
          font-size: 12px; font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Inter', sans-serif;
        }
        .edit-btn:hover {
          background: rgba(255,193,7,0.18);
        }

        .del-btn {
          flex: 1;
          background: rgba(255,82,82,0.1);
          color: #FF5252;
          border: 1px solid rgba(255,82,82,0.25);
          padding: 8px;
          border-radius: 8px;
          font-size: 12px; font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Inter', sans-serif;
        }
        .del-btn:hover {
          background: rgba(255,82,82,0.18);
        }

        .upload-label {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(0,229,255,0.06);
          border: 1px dashed rgba(0,229,255,0.25);
          color: #00E5FF;
          padding: 10px 18px;
          border-radius: 10px;
          font-size: 13px; font-weight: 500;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .upload-label:hover {
          background: rgba(0,229,255,0.12);
          border-color: rgba(0,229,255,0.4);
        }

        .glow-line {
          height: 2px; width: 36px;
          background: linear-gradient(90deg, #00E5FF, transparent);
          border-radius: 2px;
          margin-top: 6px;
        }

        .system-dot {
          width: 7px; height: 7px;
          background: #00E5FF;
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 6px #00E5FF;
          animation: pulse 2s infinite;
          margin-right: 8px;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .categories-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 28px;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
          gap: 18px;
        }

        .cat-image-wrap { height: 160px; }

        @media (max-width: 768px) {
          .categories-page { padding: 18px !important; }

          .categories-header {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 16px;
          }
          .add-btn { justify-content: center; width: 100%; }

          .save-btn, .cancel-btn { flex: 1; }

          .categories-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }

          .cat-image-wrap { height: 120px !important; }
        }

        @media (max-width: 420px) {
          .categories-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* Header */}
      <div className="categories-header">
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "26px",
              color: "#fff",
              fontWeight: 800,
            }}
          >
            Categories
          </h1>
          <div className="glow-line" />
          <p style={{ margin: "8px 0 0", color: "#3A5A7A", fontSize: "14px" }}>
            Manage your product categories here.
          </p>
        </div>
        <button className="add-btn" onClick={() => setShowForm(true)}>
          + Add Category
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div
          style={{
            background: "linear-gradient(145deg, #0D1B2E, #0A1628)",
            border: "1px solid rgba(0,229,255,0.18)",
            borderRadius: "16px",
            padding: "28px",
            marginBottom: "28px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          <h2
            style={{
              margin: "0 0 20px",
              fontSize: "17px",
              color: "#fff",
              fontWeight: 700,
            }}
          >
            {editCategory ? "✏ Edit Category" : "➕ Add New Category"}
          </h2>

          <form onSubmit={handleSubmit}>
            <input
              className="form-input"
              placeholder="Category Name (e.g. Fancy Vanity)"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <textarea
              className="form-input"
              placeholder="Description (optional)"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              style={{ height: "90px", resize: "vertical" }}
            />

            {/* Image Upload */}
            <div style={{ marginBottom: "20px" }}>
              <p
                style={{
                  margin: "0 0 10px",
                  fontSize: "13px",
                  color: "#8AAFC8",
                  fontWeight: 600,
                }}
              >
                Cover Image
              </p>
              <label className="upload-label">
                📎 Choose Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
              </label>
              {uploading && (
                <p
                  style={{
                    color: "#00E5FF",
                    fontSize: "13px",
                    marginTop: "8px",
                  }}
                >
                  <span className="system-dot" /> Uploading...
                </p>
              )}
              {image && (
                <img
                  src={`https://seven-star-tile-vanity.onrender.com${image}`}
                  alt="preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "contain",
                    borderRadius: "10px",
                    marginTop: "12px",
                    border: "1px solid rgba(0,229,255,0.2)",
                    background: "rgba(0,229,255,0.04)",
                    display: "block",
                  }}
                />
              )}
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button type="submit" className="save-btn">
                {editCategory ? "Update" : "Save"}
              </button>
              <button type="button" className="cancel-btn" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px",
            background: "linear-gradient(145deg, #0D1B2E, #0A1628)",
            border: "1px solid rgba(0,229,255,0.1)",
            borderRadius: "16px",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "14px" }}>🎨</div>
          <p style={{ color: "#3A5A7A", margin: 0, fontSize: "15px" }}>
            No categories yet — Add your first category!
          </p>
        </div>
      ) : (
        <div className="categories-grid">
          {categories.map((category) => (
            <div key={category._id} className="cat-card">
              {/* Image */}
              <div
                className="cat-image-wrap"
                style={{
                  background: "rgba(0,229,255,0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderBottom: "1px solid rgba(0,229,255,0.08)",
                  overflow: "hidden",
                }}
              >
                {category.image ? (
                  <img
                    src={`https://seven-star-tile-vanity.onrender.com${category.image}`}
                    alt={category.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span style={{ fontSize: "44px" }}>🎨</span>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: "14px" }}>
                <h3
                  style={{
                    margin: "0 0 5px",
                    fontSize: "15px",
                    color: "#fff",
                    fontWeight: 700,
                  }}
                >
                  {category.name}
                </h3>
                <p
                  style={{
                    margin: "0 0 14px",
                    fontSize: "12px",
                    color: "#3A5A7A",
                    lineHeight: "1.5",
                  }}
                >
                  {category.description || "No description"}
                </p>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(category)}
                  >
                    ✏ Edit
                  </button>
                  <button
                    className="del-btn"
                    onClick={() => handleDelete(category._id)}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Categories;
