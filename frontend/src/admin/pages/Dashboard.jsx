import { useState, useEffect } from "react";
import { getProducts } from "../api/products";
import { getOrders } from "../api/orders";
import { getMessages } from "../api/messages";

function Dashboard() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const products = await getProducts();
      const orders = await getOrders();
      const messages = await getMessages();

      setTotalProducts(products.length);
      setTotalOrders(orders.length);

      const pending = orders.filter((o) => o.status === "Pending").length;
      setPendingOrders(pending);

      const revenue = orders.reduce(
        (sum, order) => sum + (order.totalPrice || 0),
        0,
      );
      setTotalRevenue(revenue);
      setRecentOrders(orders.slice(0, 5));

      const unread = messages.filter((m) => !m.isRead).length;
      setUnreadMessages(unread);
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return {
          background: "rgba(255,193,7,0.15)",
          color: "#FFC107",
          border: "1px solid rgba(255,193,7,0.3)",
        };
      case "Confirmed":
        return {
          background: "rgba(0,229,255,0.12)",
          color: "#00E5FF",
          border: "1px solid rgba(0,229,255,0.3)",
        };
      case "Cancelled":
        return {
          background: "rgba(255,82,82,0.12)",
          color: "#FF5252",
          border: "1px solid rgba(255,82,82,0.3)",
        };
      default:
        return {
          background: "rgba(255,255,255,0.08)",
          color: "#aaa",
          border: "1px solid rgba(255,255,255,0.1)",
        };
    }
  };

  const stats = [
    {
      label: "Total Products",
      value: totalProducts,
      icon: "📦",
      accent: "#00E5FF",
      sub: "In store",
    },
    {
      label: "Total Orders",
      value: totalOrders,
      icon: "🧾",
      accent: "#448AFF",
      sub: "All time",
    },
    {
      label: "Pending Orders",
      value: pendingOrders,
      icon: "⏳",
      accent: "#FFC107",
      sub: "Needs action",
    },
    {
      label: "Total Revenue",
      value: `Rs. ${totalRevenue.toLocaleString()}`,
      icon: "💰",
      accent: "#69FF47",
      sub: "Earned so far",
    },
    {
      label: "Unread Messages",
      value: unreadMessages,
      icon: "✉️",
      accent: unreadMessages > 0 ? "#FF5252" : "#00E5FF",
      sub: unreadMessages > 0 ? "New messages!" : "All caught up",
    },
  ];

  const accentRgb = (hex) => {
    const map = {
      "#00E5FF": "0,229,255",
      "#448AFF": "68,138,255",
      "#FFC107": "255,193,7",
      "#69FF47": "105,255,71",
      "#FF5252": "255,82,82",
    };
    return map[hex] || "0,229,255";
  };

  return (
    <div
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
        * { box-sizing: border-box; }

        .stat-card {
          position: relative;
          overflow: hidden;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          cursor: default;
        }
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.45) !important;
        }
        .order-row { transition: background 0.18s ease; }
        .order-row:hover { background: rgba(0,229,255,0.05) !important; }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 13px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
        }

        .glow-line {
          height: 3px;
          border-radius: 2px;
          background: linear-gradient(90deg, #00E5FF, #448AFF);
          width: 48px;
          margin: 8px 0 16px;
        }

        .system-dot {
          width: 7px;
          height: 7px;
          background: #00E5FF;
          border-radius: 50%;
          display: inline-block;
          margin-right: 7px;
          box-shadow: 0 0 6px #00E5FF;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .mini-bar-item {
          width: 10px;
          border-radius: 4px 4px 0 0;
          background: rgba(0,229,255,0.2);
        }
        .mini-bar-item.highlight {
          background: #00E5FF;
          box-shadow: 0 0 8px rgba(0,229,255,0.5);
        }

        .view-all-btn {
          font-size: 13px;
          color: #00E5FF;
          font-weight: 600;
          cursor: pointer;
          background: rgba(0,229,255,0.08);
          border: 1px solid rgba(0,229,255,0.2);
          padding: 6px 14px;
          border-radius: 20px;
          transition: background 0.2s;
        }
        .view-all-btn:hover {
          background: rgba(0,229,255,0.16);
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "6px",
          }}
        ></div>
        <h1
          style={{
            margin: 0,
            fontSize: "26px",
            color: "#FFFFFF",
            fontWeight: 800,
          }}
        >
          Welcome back, <span style={{ color: "#00E5FF" }}>Saad Bin Saeed</span>
        </h1>
        <p style={{ margin: "4px 0 0", color: "#3A5A7A", fontSize: "14px" }}>
          Here's your store performance at a glance.
        </p>
      </div>

      {/* Revenue Banner */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #0D1B2E 0%, #0A2540 60%, #0D1B2E 100%)",
          border: "1px solid rgba(0,229,255,0.2)",
          borderRadius: "20px",
          padding: "28px 32px",
          marginBottom: "28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(0,229,255,0.08)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 200,
            height: 200,
            background:
              "radial-gradient(circle, rgba(0,229,255,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div>
          <p
            style={{
              margin: 0,
              fontSize: "11px",
              color: "#00E5FF",
              fontWeight: 600,
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            Total Revenue
          </p>
          <div className="glow-line" />
          <h2
            style={{
              margin: 0,
              fontSize: "38px",
              color: "#FFFFFF",
              fontWeight: 800,
              letterSpacing: "-1px",
            }}
          >
            Rs. {totalRevenue.toLocaleString()}
          </h2>
          <p style={{ margin: "10px 0 0", color: "#3A5A7A", fontSize: "13px" }}>
            📦 {totalOrders} total orders &nbsp;·&nbsp; ⏳ {pendingOrders}{" "}
            pending
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "6px",
            height: "48px",
          }}
        >
          {[35, 55, 42, 70, 58, 85, 68].map((h, i) => (
            <div
              key={i}
              className={`mini-bar-item ${i === 5 ? "highlight" : ""}`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="stat-card"
            style={{
              background: "linear-gradient(145deg, #0D1B2E, #0A1628)",
              border: `1px solid rgba(${accentRgb(stat.accent)},0.2)`,
              borderRadius: "16px",
              padding: "22px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "11px",
                    color: "#3A5A7A",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                  }}
                >
                  {stat.label}
                </p>
                <h2
                  style={{
                    margin: "10px 0 4px",
                    fontSize: "24px",
                    color: stat.accent,
                    fontWeight: 800,
                  }}
                >
                  {stat.value}
                </h2>
                <p style={{ margin: 0, fontSize: "12px", color: "#3A5A7A" }}>
                  {stat.sub}
                </p>
              </div>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "12px",
                  background: `rgba(${accentRgb(stat.accent)},0.1)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                }}
              >
                {stat.icon}
              </div>
            </div>
            <div
              style={{
                marginTop: "16px",
                height: "2px",
                borderRadius: "2px",
                background: `linear-gradient(90deg, ${stat.accent}, transparent)`,
                opacity: 0.4,
              }}
            />
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "17px",
                color: "#FFFFFF",
                fontWeight: 700,
                margin: 0,
              }}
            >
              Recent Orders
            </h2>
            <div
              style={{
                height: "2px",
                width: "32px",
                background: "linear-gradient(90deg, #00E5FF, transparent)",
                borderRadius: "2px",
                marginTop: "6px",
              }}
            />
          </div>
          <span className="view-all-btn">View all →</span>
        </div>

        <div
          style={{
            background: "linear-gradient(145deg, #0D1B2E, #0A1628)",
            border: "1px solid rgba(0,229,255,0.12)",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
          }}
        >
          {loading ? (
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                color: "#00E5FF",
                fontSize: "14px",
              }}
            >
              <span className="system-dot" /> Loading orders...
            </div>
          ) : recentOrders.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center" }}>
              <div style={{ fontSize: "36px", marginBottom: "10px" }}>📋</div>
              <p style={{ color: "#3A5A7A", margin: 0, fontSize: "14px" }}>
                No orders yet. New orders will appear here.
              </p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid rgba(0,229,255,0.1)",
                    background: "rgba(0,229,255,0.04)",
                  }}
                >
                  {["Customer", "Phone", "City", "Total", "Status", "Date"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: "14px 20px",
                          textAlign: "left",
                          color: "#00E5FF",
                          fontSize: "11px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.8px",
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const statusStyle = getStatusStyle(order.status);
                  return (
                    <tr
                      key={order._id}
                      className="order-row"
                      style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                    >
                      <td
                        style={{
                          padding: "14px 20px",
                          fontWeight: 600,
                          color: "#E0E6F0",
                          fontSize: "14px",
                        }}
                      >
                        {order.fullName}
                      </td>
                      <td
                        style={{
                          padding: "14px 20px",
                          color: "#3A5A7A",
                          fontSize: "14px",
                        }}
                      >
                        {order.phone}
                      </td>
                      <td
                        style={{
                          padding: "14px 20px",
                          color: "#3A5A7A",
                          fontSize: "14px",
                        }}
                      >
                        {order.city}
                      </td>
                      <td
                        style={{
                          padding: "14px 20px",
                          fontWeight: 700,
                          color: "#00E5FF",
                          fontSize: "14px",
                        }}
                      >
                        Rs. {(order.totalPrice || 0).toLocaleString()}
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <span className="badge" style={{ ...statusStyle }}>
                          {order.status === "Confirmed" && "✓ "}
                          {order.status === "Pending" && "⏳ "}
                          {order.status === "Cancelled" && "✕ "}
                          {order.status}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "14px 20px",
                          color: "#3A5A7A",
                          fontSize: "14px",
                        }}
                      >
                        {new Date(order.createdAt).toLocaleDateString("en-PK", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
