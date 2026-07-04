import { useState, useEffect } from "react";

const COLORS = {
  background: "#0A0F1E",
  card: "#0D1B2E",
  cyan: "#00E5FF",
  red: "#FF5252",
  green: "#4CAF50",
  text: "#E6F1FF",
  muted: "#8AA0BF",
  border: "#1E3A5F",
  inputBg: "#10233A",
};

const API = "https://seven-star-tile-vanity.onrender.com/api/reviews";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const token = sessionStorage.getItem("adminToken");

  const fetchReviews = () => {
    setLoading(true);
    fetch(`${API}/admin/all?status=${filter}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        setReviews(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const updateReview = (id, data) => {
    fetch(`${API}/admin/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }).then(() => fetchReviews());
  };

  const deleteReview = (id) => {
    if (!window.confirm("Are you sure you want to Delete?")) return;
    fetch(`${API}/admin/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => fetchReviews());
  };

  return (
    <div
      style={{
        padding: "24px",
        background: COLORS.background,
        minHeight: "100vh",
        color: COLORS.text,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <h1 style={{ margin: "0 0 24px", fontSize: "26px", fontWeight: "700" }}>
        Reviews
      </h1>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
        {["pending", "approved", "rejected"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              border:
                filter === s
                  ? `1px solid ${COLORS.cyan}`
                  : `1px solid ${COLORS.border}`,
              background: filter === s ? `${COLORS.cyan}22` : "transparent",
              color: filter === s ? COLORS.cyan : COLORS.muted,
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "13px",
              textTransform: "capitalize",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      {loading ? (
        <p style={{ color: COLORS.muted }}>Loading...</p>
      ) : reviews.length === 0 ? (
        <p
          style={{
            color: COLORS.muted,
            textAlign: "center",
            marginTop: "40px",
          }}
        >
          No reviews found.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {reviews.map((rev) => (
            <div
              key={rev._id}
              style={{
                background: COLORS.card,
                border: `1px solid ${COLORS.border}`,
                borderTop: `2px solid ${COLORS.cyan}`,
                borderRadius: "14px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "12px",
                }}
              >
                <div style={{ flex: 1 }}>
                  {/* Name + Email */}
                  <p
                    style={{
                      margin: "0 0 4px",
                      fontWeight: "700",
                      fontSize: "15px",
                    }}
                  >
                    {rev.name}
                  </p>
                  <p
                    style={{
                      margin: "0 0 10px",
                      color: COLORS.muted,
                      fontSize: "12px",
                    }}
                  >
                    {rev.email}
                  </p>

                  {/* Stars */}
                  <p style={{ margin: "0 0 10px", fontSize: "16px" }}>
                    {"⭐".repeat(rev.rating)}
                  </p>

                  {/* Comment */}
                  <p
                    style={{
                      margin: "0 0 8px",
                      color: "#ddd",
                      lineHeight: "1.6",
                      fontSize: "14px",
                    }}
                  >
                    {rev.comment}
                  </p>

                  {/* Product */}
                  {rev.product && (
                    <p
                      style={{
                        margin: 0,
                        color: COLORS.muted,
                        fontSize: "12px",
                      }}
                    >
                      Product: {rev.product?.name || rev.product}
                    </p>
                  )}
                </div>

                {/* Status Badge */}
                <span
                  style={{
                    padding: "4px 14px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontWeight: "700",
                    whiteSpace: "nowrap",
                    background:
                      rev.status === "approved"
                        ? `${COLORS.green}22`
                        : rev.status === "rejected"
                          ? `${COLORS.red}22`
                          : `${COLORS.cyan}22`,
                    color:
                      rev.status === "approved"
                        ? COLORS.green
                        : rev.status === "rejected"
                          ? COLORS.red
                          : COLORS.cyan,
                    border: `1px solid ${rev.status === "approved" ? COLORS.green : rev.status === "rejected" ? COLORS.red : COLORS.cyan}`,
                  }}
                >
                  {rev.status}
                </span>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "16px",
                  flexWrap: "wrap",
                  borderTop: `1px solid ${COLORS.border}`,
                  paddingTop: "14px",
                }}
              >
                {rev.status !== "approved" && (
                  <button
                    onClick={() =>
                      updateReview(rev._id, { status: "approved" })
                    }
                    style={{
                      padding: "7px 16px",
                      background: `${COLORS.green}22`,
                      color: COLORS.green,
                      border: `1px solid ${COLORS.green}`,
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "13px",
                    }}
                  >
                    ✅ Approve
                  </button>
                )}
                {rev.status !== "rejected" && (
                  <button
                    onClick={() =>
                      updateReview(rev._id, { status: "rejected" })
                    }
                    style={{
                      padding: "7px 16px",
                      background: `${COLORS.red}22`,
                      color: COLORS.red,
                      border: `1px solid ${COLORS.red}`,
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "13px",
                    }}
                  >
                    ❌ Reject
                  </button>
                )}
                <button
                  onClick={() =>
                    updateReview(rev._id, { isFeatured: !rev.isFeatured })
                  }
                  style={{
                    padding: "7px 16px",
                    background: rev.isFeatured
                      ? `${COLORS.cyan}22`
                      : "transparent",
                    color: COLORS.cyan,
                    border: `1px solid ${COLORS.cyan}`,
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "13px",
                  }}
                >
                  {rev.isFeatured ? "⭐ Featured" : "☆ Feature"}
                </button>
                <button
                  onClick={() => deleteReview(rev._id)}
                  style={{
                    padding: "7px 16px",
                    background: `${COLORS.red}22`,
                    color: COLORS.red,
                    border: `1px solid ${COLORS.red}`,
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "13px",
                  }}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Reviews;
