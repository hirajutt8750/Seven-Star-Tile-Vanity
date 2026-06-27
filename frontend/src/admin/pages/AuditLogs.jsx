import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "https://seven-star-tile-vanity.onrender.com/api";
const getToken = () => sessionStorage.getItem("adminToken");
const authHeaders = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

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

const CATEGORY_COLORS = {
  order: { bg: "rgba(0,229,255,0.1)", color: "#00E5FF" },
  product: { bg: "rgba(100,181,246,0.1)", color: "#64B5F6" },
  category: { bg: "rgba(255,213,79,0.1)", color: "#FFD54F" },
  auth: { bg: "rgba(255,82,82,0.1)", color: "#FF5252" },
  other: { bg: "rgba(138,160,191,0.1)", color: "#8AA0BF" },
};

const ACTION_ICONS = {
  ORDER_CREATED: "🆕",
  ORDER_UPDATED: "✏️",
  ORDER_DELETED: "🗑️",
  PRODUCT_CREATED: "📦",
  PRODUCT_UPDATED: "✏️",
  PRODUCT_DELETED: "🗑️",
  CATEGORY_CREATED: "📂",
  CATEGORY_UPDATED: "✏️",
  CATEGORY_DELETED: "🗑️",
  LOGIN_SUCCESS: "✅",
  LOGIN_FAILED: "❌",
};

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadLogs();
  }, [filter]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const url =
        filter === "all"
          ? `${BASE_URL}/audit-logs?limit=200`
          : `${BASE_URL}/audit-logs?category=${filter}&limit=200`;
      const res = await axios.get(url, authHeaders());
      setLogs(res.data);
    } catch (err) {
      console.error("Failed to load logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (window.confirm("Are you sure you want to delete all logs?")) {
      await axios.delete(`${BASE_URL}/audit-logs/clear`, authHeaders());
      loadLogs();
    }
  };

  const filters = ["all", "order", "product", "category", "auth", "other"];

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
      <style>{`
        .log-row {
          transition: background 0.2s ease;
        }
        .log-row:hover {
          background: #102742 !important;
        }
        .filter-tab {
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .filter-tab:hover {
          background: rgba(0,229,255,0.08) !important;
        }
        .clear-btn {
          transition: all 0.2s ease;
        }
        .clear-btn:hover {
          background: #CC0000 !important;
          transform: translateY(-1px);
        }
      `}</style>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "26px",
              color: COLORS.cyan,
              fontWeight: 700,
            }}
          >
            Audit Logs
          </h1>
          <p
            style={{ margin: "6px 0 0", color: COLORS.muted, fontSize: "14px" }}
          >
            Complete record of all admin activity
          </p>
        </div>
        <button
          className="clear-btn"
          onClick={handleClear}
          style={{
            background: COLORS.red,
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "13px",
            boxShadow: `0 0 12px ${COLORS.red}44`,
          }}
        >
          Clear All Logs
        </button>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          background: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          borderRadius: "10px",
          padding: "4px",
          width: "fit-content",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        {filters.map((f) => (
          <div
            key={f}
            className="filter-tab"
            onClick={() => setFilter(f)}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              textTransform: "capitalize",
              color: filter === f ? "#04141C" : COLORS.muted,
              background: filter === f ? COLORS.cyan : "transparent",
            }}
          >
            {f}
          </div>
        ))}
      </div>

      {/* Logs Table */}
      <div
        style={{
          background: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
        }}
      >
        {loading ? (
          <p style={{ color: COLORS.cyan, padding: "32px", margin: 0 }}>
            Loading...
          </p>
        ) : logs.length === 0 ? (
          <p style={{ color: COLORS.muted, padding: "32px", margin: 0 }}>
            No logs found.
          </p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: COLORS.inputBg }}>
                {["Action", "Description", "Category", "By", "Date & Time"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "14px 20px",
                        textAlign: "left",
                        color: COLORS.cyan,
                        fontSize: "12px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const catStyle =
                  CATEGORY_COLORS[log.category] || CATEGORY_COLORS.other;
                return (
                  <tr
                    key={log._id}
                    className="log-row"
                    style={{ borderTop: `1px solid ${COLORS.border}` }}
                  >
                    <td
                      style={{
                        padding: "14px 20px",
                        fontWeight: 600,
                        color: COLORS.text,
                        fontSize: "13px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {ACTION_ICONS[log.action] || "📋"} {log.action}
                    </td>
                    <td
                      style={{
                        padding: "14px 20px",
                        color: COLORS.muted,
                        fontSize: "13px",
                        maxWidth: "300px",
                      }}
                    >
                      {log.description}
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <span
                        style={{
                          background: catStyle.bg,
                          color: catStyle.color,
                          padding: "4px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: 700,
                          textTransform: "capitalize",
                          border: `1px solid ${catStyle.color}33`,
                        }}
                      >
                        {log.category}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "14px 20px",
                        color: COLORS.muted,
                        fontSize: "13px",
                      }}
                    >
                      {log.performedBy}
                    </td>
                    <td
                      style={{
                        padding: "14px 20px",
                        color: COLORS.muted,
                        fontSize: "13px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {new Date(log.createdAt).toLocaleString("en-PK")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AuditLogs;
