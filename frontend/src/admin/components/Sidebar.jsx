import { Link, useLocation } from "react-router-dom";

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

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: "📊" },
    { path: "/admin/categories", label: "Categories", icon: "📂" },
    { path: "/admin/products", label: "Products", icon: "📦" },
    { path: "/admin/orders", label: "Orders", icon: "🧾" },
    { path: "/admin/messages", label: "Messages", icon: "✉️" },
    { path: "/admin/reviews", label: "Customer Reviews", icon: "⭐" },
    { path: "/admin/audit-logs", label: "Audit Logs", icon: "📋" },
    { path: "/admin/2fa-setup", label: "2FA Setup", icon: "🔐" },
  ];

  return (
    <>
      <style>{`
        @keyframes sidebarFadeIn {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .admin-sidebar {
          width: 220px;
          min-height: 100vh;
          background: ${COLORS.background};
          color: ${COLORS.text};
          padding: 20px 0;
          position: fixed;
          left: 0;
          top: 0;
          border-right: 1px solid ${COLORS.border};
          font-family: 'Inter', 'Segoe UI', sans-serif;
          z-index: 300;
          transition: transform 0.3s ease;
        }

        .sidebar-link {
          position: relative;
          transition: background 0.25s ease, color 0.25s ease, padding-left 0.25s ease;
          animation: sidebarFadeIn 0.4s ease both;
        }
        .sidebar-link:hover {
          background: ${COLORS.card} !important;
          color: ${COLORS.cyan} !important;
          padding-left: 26px;
        }
        .sidebar-link:hover .sidebar-icon {
          transform: scale(1.15) rotate(-4deg);
        }
        .sidebar-icon {
          display: inline-block;
          transition: transform 0.25s ease;
        }
        .sidebar-link.active {
          background: ${COLORS.card} !important;
          color: ${COLORS.cyan} !important;
          box-shadow: inset 0 0 14px rgba(0,229,255,0.08);
        }
        .sidebar-link.active::after {
          content: "";
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${COLORS.cyan};
          box-shadow: 0 0 8px ${COLORS.cyan};
        }
        .sidebar-logo h2 {
          transition: text-shadow 0.3s ease;
        }
        .sidebar-logo:hover h2 {
          text-shadow: 0 0 12px ${COLORS.cyan}88;
        }

        .sidebar-close-btn {
          display: none;
        }

        .sidebar-overlay {
          display: none;
        }

        /* ── MOBILE: slide-in overlay sidebar ───────────── */
        @media (max-width: 900px) {
          .admin-sidebar {
            transform: translateX(${isOpen ? "0" : "-100%"});
            box-shadow: ${isOpen ? "8px 0 40px rgba(0,0,0,0.5)" : "none"};
            width: 240px;
          }

          .sidebar-close-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 16px;
            right: 16px;
            width: 32px;
            height: 32px;
            border-radius: 8px;
            background: rgba(255,255,255,0.05);
            border: 1px solid ${COLORS.border};
            color: ${COLORS.muted};
            font-size: 18px;
            cursor: pointer;
          }
          .sidebar-close-btn:hover {
            background: rgba(255,82,82,0.1);
            color: ${COLORS.red};
            border-color: rgba(255,82,82,0.3);
          }

          .sidebar-overlay {
            display: ${isOpen ? "block" : "none"};
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.55);
            backdrop-filter: blur(2px);
            z-index: 290;
            animation: overlayFadeIn 0.25s ease;
          }
        }
      `}</style>

      {/* dark overlay behind sidebar on mobile */}
      <div className="sidebar-overlay" onClick={onClose} />

      <div className="admin-sidebar">
        {/* Close button — mobile only */}
        <button
          className="sidebar-close-btn"
          onClick={onClose}
          aria-label="Close menu"
        >
          ✕
        </button>

        {/* Logo */}
        <div
          className="sidebar-logo"
          style={{
            padding: "0 20px 20px",
            borderBottom: `1px solid ${COLORS.border}`,
          }}
        >
          <h2 style={{ margin: 0, color: COLORS.cyan, fontWeight: 700 }}>
            ShopAdmin
          </h2>
          <p
            style={{ margin: "5px 0 0", fontSize: "12px", color: COLORS.muted }}
          >
            Admin Panel
          </p>
        </div>

        {/* Menu */}
        <nav style={{ marginTop: "20px" }}>
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-link ${isActive ? "active" : ""}`}
                onClick={onClose}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 20px",
                  color: isActive ? COLORS.cyan : COLORS.muted,
                  background: isActive ? COLORS.card : "transparent",
                  textDecoration: "none",
                  fontSize: "15px",
                  fontWeight: isActive ? 600 : 400,
                  borderLeft: isActive
                    ? `3px solid ${COLORS.cyan}`
                    : "3px solid transparent",
                  animationDelay: `${index * 0.06}s`,
                }}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}

export default Sidebar;
