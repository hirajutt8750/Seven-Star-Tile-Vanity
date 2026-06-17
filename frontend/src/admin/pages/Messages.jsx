import { useState, useEffect } from "react";
import { getMessages, markMessageAsRead, deleteMessage } from "../api/messages";

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
  rowHover: "#102742",
  unreadBg: "#15233A",
};

function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const data = await getMessages();
      setMessages(data);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = async (msg) => {
    setSelected(msg);
    if (!msg.isRead) {
      try {
        await markMessageAsRead(msg._id);
        setMessages((prev) =>
          prev.map((m) => (m._id === msg._id ? { ...m, isRead: true } : m)),
        );
      } catch (err) {
        console.error("Failed to mark as read:", err);
      }
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch (err) {
      console.error("Failed to delete:", err);
    } finally {
      setDeleting(null);
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div
      style={{
        padding: "32px",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        background: COLORS.background,
        minHeight: "100vh",
        color: COLORS.text,
      }}
    >
      <style>{`
        .msg-row { transition: background 0.2s ease; cursor: pointer; }
        .msg-row:hover { background: ${COLORS.rowHover}; }
        .delete-btn { transition: all 0.2s ease; }
        .delete-btn:hover { background: ${COLORS.red} !important; color: #fff !important; }

        .modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.6);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000;
          padding: 16px;
        }
        .modal-box {
          background: ${COLORS.card}; border-radius: 16px;
          padding: 32px; max-width: 520px; width: 90%;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          border: 1px solid ${COLORS.border};
          animation: popIn 0.25s ease;
          max-height: 88vh;
          overflow-y: auto;
        }
        @keyframes popIn {
          from { transform: scale(0.92); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }

        /* ---- Mobile card layout (table -> cards) ---- */
        .desktop-table { display: table; }
        .mobile-cards { display: none; }

        .msg-card {
          padding: 16px;
          border-bottom: 1px solid ${COLORS.border};
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .msg-card:active { background: ${COLORS.rowHover}; }
        .msg-card:last-child { border-bottom: none; }

        @media (max-width: 768px) {
          .page-padding { padding: 18px !important; }
          .page-title { font-size: 22px !important; }

          .desktop-table { display: none !important; }
          .mobile-cards { display: block !important; }

          .modal-box { padding: 22px; width: 100%; max-width: 100%; border-radius: 14px; }
          .modal-actions { flex-direction: column !important; }
        }
      `}</style>

      {/* Header */}
      <div
        className="page-padding"
        style={{ marginBottom: "32px", padding: 0 }}
      >
        <h1
          className="page-title"
          style={{
            margin: 0,
            fontSize: "28px",
            color: COLORS.cyan,
            fontWeight: 700,
          }}
        >
          Messages
          {unreadCount > 0 && (
            <span
              style={{
                marginLeft: "12px",
                fontSize: "14px",
                background: COLORS.red,
                color: "#fff",
                borderRadius: "20px",
                padding: "3px 12px",
                fontWeight: 600,
              }}
            >
              {unreadCount} unread
            </span>
          )}
        </h1>
        <p style={{ margin: "6px 0 0", color: COLORS.muted, fontSize: "15px" }}>
          Contact form se aaye messages yahan dikhenge.
        </p>
      </div>

      {/* Card wrapper */}
      <div
        style={{
          background: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        }}
      >
        {loading ? (
          <p style={{ color: COLORS.muted, padding: "24px", margin: 0 }}>
            Loading...
          </p>
        ) : messages.length === 0 ? (
          <p style={{ color: COLORS.muted, padding: "24px", margin: 0 }}>
            Abhi koi message nahi hai.
          </p>
        ) : (
          <>
            {/* ===== DESKTOP TABLE ===== */}
            <table
              className="desktop-table"
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
              <thead>
                <tr style={{ background: COLORS.inputBg }}>
                  {[
                    "",
                    "Name",
                    "Phone",
                    "Email",
                    "Message",
                    "Date",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "14px 20px",
                        textAlign: "left",
                        color: COLORS.cyan,
                        fontSize: "13px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => (
                  <tr
                    key={msg._id}
                    className="msg-row"
                    style={{
                      borderTop: `1px solid ${COLORS.border}`,
                      background: msg.isRead ? "transparent" : COLORS.unreadBg,
                      fontWeight: msg.isRead ? 400 : 600,
                    }}
                  >
                    <td style={{ padding: "14px 12px 14px 20px" }}>
                      {!msg.isRead && (
                        <span
                          style={{
                            display: "inline-block",
                            width: "8px",
                            height: "8px",
                            background: COLORS.red,
                            borderRadius: "50%",
                            boxShadow: `0 0 6px ${COLORS.red}`,
                          }}
                        />
                      )}
                    </td>
                    <td
                      onClick={() => handleOpen(msg)}
                      style={{
                        padding: "14px 20px",
                        color: COLORS.text,
                        fontWeight: msg.isRead ? 500 : 700,
                      }}
                    >
                      {msg.name}
                    </td>
                    <td
                      onClick={() => handleOpen(msg)}
                      style={{ padding: "14px 20px", color: COLORS.muted }}
                    >
                      {msg.phone}
                    </td>
                    <td
                      onClick={() => handleOpen(msg)}
                      style={{ padding: "14px 20px", color: COLORS.muted }}
                    >
                      {msg.email || "—"}
                    </td>
                    <td
                      onClick={() => handleOpen(msg)}
                      style={{
                        padding: "14px 20px",
                        color: COLORS.muted,
                        maxWidth: "200px",
                      }}
                    >
                      <span
                        style={{
                          display: "block",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          maxWidth: "180px",
                        }}
                      >
                        {msg.message}
                      </span>
                    </td>
                    <td
                      onClick={() => handleOpen(msg)}
                      style={{
                        padding: "14px 20px",
                        color: COLORS.muted,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {new Date(msg.createdAt).toLocaleDateString("en-PK")}
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(msg._id)}
                        disabled={deleting === msg._id}
                        style={{
                          background: "#3A1414",
                          color: COLORS.red,
                          border: "none",
                          borderRadius: "8px",
                          padding: "7px 14px",
                          fontSize: "13px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {deleting === msg._id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ===== MOBILE CARDS ===== */}
            <div className="mobile-cards">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className="msg-card"
                  onClick={() => handleOpen(msg)}
                  style={{
                    background: msg.isRead ? "transparent" : COLORS.unreadBg,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {!msg.isRead && (
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            background: COLORS.red,
                            borderRadius: "50%",
                            boxShadow: `0 0 6px ${COLORS.red}`,
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <span
                        style={{
                          fontSize: "15px",
                          fontWeight: msg.isRead ? 600 : 700,
                          color: COLORS.text,
                        }}
                      >
                        {msg.name}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: "12px",
                        color: COLORS.muted,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {new Date(msg.createdAt).toLocaleDateString("en-PK")}
                    </span>
                  </div>

                  <p
                    style={{
                      margin: "6px 0 0",
                      fontSize: "13px",
                      color: COLORS.muted,
                    }}
                  >
                    {msg.phone} {msg.email ? `· ${msg.email}` : ""}
                  </p>

                  <p
                    style={{
                      margin: "8px 0 0",
                      fontSize: "13px",
                      color: COLORS.muted,
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {msg.message}
                  </p>

                  <div style={{ marginTop: "12px" }}>
                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(msg._id);
                      }}
                      disabled={deleting === msg._id}
                      style={{
                        background: "#3A1414",
                        color: COLORS.red,
                        border: "none",
                        borderRadius: "8px",
                        padding: "7px 14px",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {deleting === msg._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal — message detail */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "20px",
                  color: COLORS.cyan,
                  fontWeight: 700,
                }}
              >
                Message Detail
              </h2>
              <button
                onClick={() => setSelected(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "22px",
                  cursor: "pointer",
                  color: COLORS.muted,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            <table
              style={{
                width: "100%",
                fontSize: "14px",
                borderCollapse: "collapse",
              }}
            >
              {[
                { label: "Name", value: selected.name },
                { label: "Phone", value: selected.phone },
                { label: "Email", value: selected.email || "Not provided" },
                {
                  label: "Date",
                  value: new Date(selected.createdAt).toLocaleString("en-PK"),
                },
              ].map((row) => (
                <tr
                  key={row.label}
                  style={{ borderBottom: `1px solid ${COLORS.border}` }}
                >
                  <td
                    style={{
                      padding: "10px 0",
                      color: COLORS.muted,
                      fontWeight: 600,
                      width: "80px",
                    }}
                  >
                    {row.label}
                  </td>
                  <td style={{ padding: "10px 0", color: COLORS.text }}>
                    {row.value}
                  </td>
                </tr>
              ))}
            </table>

            <div style={{ marginTop: "16px" }}>
              <p
                style={{
                  margin: "0 0 8px",
                  color: COLORS.muted,
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                Message
              </p>
              <div
                style={{
                  background: COLORS.inputBg,
                  borderRadius: "10px",
                  padding: "16px",
                  color: COLORS.text,
                  fontSize: "14px",
                  lineHeight: "1.7",
                  border: `1px solid ${COLORS.border}`,
                }}
              >
                {selected.message}
              </div>
            </div>

            <div
              className="modal-actions"
              style={{ display: "flex", gap: "12px", marginTop: "24px" }}
            >
              <button
                onClick={() => handleDelete(selected._id)}
                style={{
                  flex: 1,
                  padding: "11px",
                  background: "#3A1414",
                  color: COLORS.red,
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Delete Message
              </button>
              <button
                onClick={() => setSelected(null)}
                style={{
                  flex: 1,
                  padding: "11px",
                  background: COLORS.cyan,
                  color: "#04141C",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Messages;
