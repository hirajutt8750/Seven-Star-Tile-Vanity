import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { getMessages } from "../api/messages";
import adminPic from "../../assets/admin-pic.jpg";

function AdminLayout({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    loadUnread();
    const interval = setInterval(loadUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadUnread = async () => {
    try {
      const messages = await getMessages();
      const unread = messages.filter((m) => !m.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0A0F1E" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .topbar {
          height: 72px;
          background: linear-gradient(135deg, #0D1B2E 0%, #0A1628 60%, #0A0F1E 100%);
          border-bottom: 1px solid rgba(0,229,255,0.12);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 4px 28px rgba(0,0,0,0.45);
          backdrop-filter: blur(10px);
        }

        .topbar-brand-icon {
          width: 42px; height: 42px;
          border-radius: 12px;
          background: linear-gradient(145deg, rgba(0,229,255,0.18), rgba(0,229,255,0.04));
          border: 1px solid rgba(0,229,255,0.25);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          box-shadow: 0 0 18px rgba(0,229,255,0.08), inset 0 1px 0 rgba(255,255,255,0.05);
          flex-shrink: 0;
        }

        .topbar-title {
          margin: 0; font-size: 16px; font-weight: 800;
          color: #fff; letter-spacing: 0.3px;
          font-family: 'Inter', sans-serif;
        }
        .topbar-subtitle {
          margin: 2px 0 0; font-size: 12px;
          color: #00E5FF; letter-spacing: 0.6px;
          font-weight: 500;
          display: flex; align-items: center; gap: 6px;
        }

        .topbar-date {
          font-size: 12px; color: #8AAFC8;
          font-weight: 500; letter-spacing: 0.3px;
          padding: 6px 14px;
          border-radius: 20px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
        }

        .notif-btn {
          position: relative;
          width: 42px; height: 42px;
          border-radius: 12px;
          background: rgba(0,229,255,0.06);
          border: 1px solid rgba(0,229,255,0.15);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; cursor: pointer;
          transition: all 0.25s ease;
          flex-shrink: 0;
        }
        .notif-btn:hover {
          background: rgba(0,229,255,0.14);
          border-color: rgba(0,229,255,0.4);
          box-shadow: 0 0 16px rgba(0,229,255,0.2);
          transform: translateY(-2px);
        }
        .notif-badge {
          position: absolute;
          top: -5px; right: -5px;
          background: #FF5252;
          color: #fff;
          font-size: 10px; font-weight: 700;
          border-radius: 50%;
          width: 18px; height: 18px;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid #0A1628;
          box-shadow: 0 0 8px rgba(255,82,82,0.6);
          animation: badgePulse 2s infinite;
        }
        @keyframes badgePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.12); }
        }

        /* ── HAMBURGER MENU BUTTON ── */
        .hamburger-btn {
          display: none;
          width: 42px; height: 42px;
          border-radius: 12px;
          background: rgba(0,229,255,0.06);
          border: 1px solid rgba(0,229,255,0.15);
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.25s ease;
          flex-direction: column;
          gap: 4px;
        }
        .hamburger-btn:hover {
          background: rgba(0,229,255,0.14);
          border-color: rgba(0,229,255,0.4);
        }
        .hamburger-line {
          width: 18px; height: 2px;
          background: #00E5FF;
          border-radius: 2px;
          transition: all 0.25s ease;
        }

        .profile-btn {
          display: flex; align-items: center; gap: 10px;
          padding: 5px 16px 5px 5px;
          background: rgba(0,229,255,0.05);
          border: 1px solid rgba(0,229,255,0.15);
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .profile-btn:hover {
          background: rgba(0,229,255,0.12);
          border-color: rgba(0,229,255,0.4);
          box-shadow: 0 0 16px rgba(0,229,255,0.15);
          transform: translateY(-2px);
        }
        .profile-avatar {
          width: 36px; height: 36px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #00E5FF;
          display: block;
          box-shadow: 0 0 10px rgba(0,229,255,0.3);
          flex-shrink: 0;
        }
        .profile-btn-name {
          font-size: 13px; font-weight: 700;
          color: #E0E6F0; margin: 0; line-height: 1.3;
        }
        .profile-btn-role {
          font-size: 11px;
          color: #00E5FF;
          margin: 0; line-height: 1.3;
          font-weight: 500;
        }
        .profile-btn-arrow {
          color: #00E5FF; font-size: 10px;
          transition: transform 0.25s ease;
        }
        .profile-text { display: block; }

        .admin-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background: linear-gradient(145deg, #0D1B2E, #0A1628);
          border: 1px solid rgba(0,229,255,0.2);
          border-radius: 16px;
          min-width: 240px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 20px rgba(0,229,255,0.05);
          z-index: 999;
          overflow: hidden;
          animation: dropDown 0.2s ease;
        }
        @keyframes dropDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .admin-dd-header {
          display: flex; align-items: center; gap: 12px;
          padding: 16px;
          background: rgba(0,229,255,0.05);
          border-bottom: 1px solid rgba(0,229,255,0.1);
        }
        .admin-dd-avatar {
          width: 46px; height: 46px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #00E5FF;
          flex-shrink: 0;
        }
        .admin-dd-name {
          margin: 0; font-size: 14px;
          font-weight: 700; color: #fff;
        }
        .admin-dd-role {
          margin: 3px 0 0; font-size: 11px;
          color: #00E5FF;
        }

        .admin-dd-item {
          display: flex; align-items: center; gap: 12px;
          padding: 13px 18px;
          font-size: 13px; color: #8AAFC8;
          cursor: pointer;
          transition: all 0.2s ease;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          font-family: 'Inter', sans-serif;
        }
        .admin-dd-item:last-child { border-bottom: none; }
        .admin-dd-item:hover {
          background: rgba(0,229,255,0.07);
          color: #00E5FF;
        }
        .admin-dd-item.logout:hover {
          background: rgba(255,82,82,0.08);
          color: #FF5252;
        }
        .dd-icon {
          width: 32px; height: 32px;
          border-radius: 8px;
          background: rgba(0,229,255,0.08);
          border: 1px solid rgba(0,229,255,0.12);
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; flex-shrink: 0;
        }
        .logout .dd-icon {
          background: rgba(255,82,82,0.08);
          border-color: rgba(255,82,82,0.12);
        }

        .topbar-divider {
          width: 1px; height: 32px;
          background: linear-gradient(180deg, transparent, rgba(0,229,255,0.2), transparent);
        }

        .system-dot {
          width: 8px; height: 8px;
          background: #00E5FF;
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 8px #00E5FF;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .admin-content-wrap {
          margin-left: 220px;
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        /* ══════════════════════════════════════════════
           MOBILE — hamburger appears, sidebar margin removed
        ══════════════════════════════════════════════ */
        @media (max-width: 900px) {
          .admin-content-wrap {
            margin-left: 0;
          }

          .hamburger-btn { display: flex; }

          .topbar { padding: 0 16px; }
          .topbar-date { display: none; }
          .topbar-divider { display: none; }

          .profile-text { display: none; }
          .profile-btn { padding: 5px; }
          .profile-btn-arrow { display: none; }

          .admin-dropdown {
            position: fixed;
            top: 64px;
            right: 12px;
            left: 12px;
            min-width: unset;
          }
        }

        @media (max-width: 480px) {
          .topbar-title { font-size: 14px; }
          .topbar-subtitle { font-size: 11px; }
          .topbar-brand-icon { width: 36px; height: 36px; font-size: 17px; }
        }
      `}</style>

      {/* Sidebar — receives open/close state */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Right Side */}
      <div className="admin-content-wrap">
        {/* ── TOPBAR ── */}
        <div className="topbar">
          {/* Left — Hamburger + Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            {/* Hamburger — mobile only */}
            <button
              className="hamburger-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <span className="hamburger-line" />
              <span className="hamburger-line" />
              <span className="hamburger-line" />
            </button>

            <div className="topbar-brand-icon">🏠</div>
            <div>
              <p className="topbar-title">Admin Panel</p>
              <p className="topbar-subtitle">
                <span className="system-dot" />7 Star Tile Vanity
              </p>
            </div>
          </div>

          {/* Right — Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Date pill */}
            <div className="topbar-date">{currentDate}</div>

            {/* Notification Bell */}
            <div
              className="notif-btn"
              onClick={() => navigate("/admin/messages")}
            >
              🔔
              {unreadCount > 0 && (
                <span className="notif-badge">{unreadCount}</span>
              )}
            </div>

            <div className="topbar-divider" />

            {/* Profile */}
            <div style={{ position: "relative" }} ref={dropdownRef}>
              <div
                className="profile-btn"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <img src={adminPic} alt="Admin" className="profile-avatar" />
                <div className="profile-text">
                  <p className="profile-btn-name">Saad Bin Saeed</p>
                  <p className="profile-btn-role">Administrator</p>
                </div>
                <span
                  className="profile-btn-arrow"
                  style={{
                    transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  ▾
                </span>
              </div>

              {/* Dropdown */}
              {showDropdown && (
                <div className="admin-dropdown">
                  <div className="admin-dd-header">
                    <img
                      src={adminPic}
                      alt="Admin"
                      className="admin-dd-avatar"
                    />
                    <div>
                      <p className="admin-dd-name">Saad Bin Saeed</p>
                      <p className="admin-dd-role">Administrator</p>
                    </div>
                  </div>

                  <div
                    className="admin-dd-item"
                    onClick={() => {
                      navigate("/admin/messages");
                      setShowDropdown(false);
                    }}
                  >
                    <div className="dd-icon">✉️</div>
                    <span>Messages</span>
                    {unreadCount > 0 && (
                      <span
                        style={{
                          marginLeft: "auto",
                          background: "#FF5252",
                          color: "#fff",
                          fontSize: "11px",
                          fontWeight: 700,
                          borderRadius: "20px",
                          padding: "2px 8px",
                        }}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </div>

                  <div
                    className="admin-dd-item"
                    onClick={() => {
                      navigate("/admin/orders");
                      setShowDropdown(false);
                    }}
                  >
                    <div className="dd-icon">🧾</div>
                    <span>Orders</span>
                  </div>

                  <div
                    className="admin-dd-item"
                    onClick={() => {
                      navigate("/admin");
                      setShowDropdown(false);
                    }}
                  >
                    <div className="dd-icon">📊</div>
                    <span>Dashboard</span>
                  </div>

                  <div className="admin-dd-item logout" onClick={handleLogout}>
                    <div className="dd-icon">🚪</div>
                    <span>Logout</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div
          style={{
            flex: 1,
            background: "#0A0F1E",
            padding: "28px",
            minHeight: "calc(100vh - 72px)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
