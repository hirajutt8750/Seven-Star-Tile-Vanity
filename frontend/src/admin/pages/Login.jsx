import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      sessionStorage.setItem("adminToken", res.data.token);
      setMessage("success:Login successful!");
      window.location.href = "/admin";
    } catch (error) {
      setMessage("error:Incorrect email or password!");
    } finally {
      setLoading(false);
    }
  };

  const isSuccess = message.startsWith("success:");
  const displayMsg = message.replace(/^(success|error):/, "");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020810",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        position: "relative",
        overflow: "hidden",
        padding: "20px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');

        .bg-grid {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(0,180,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,180,255,0.03) 1px, transparent 1px);
          background-size: 44px 44px;
        }
        .bg-glow-center {
          position: fixed; top: -200px; left: 50%;
          transform: translateX(-50%);
          width: 700px; height: 400px;
          background: radial-gradient(ellipse, rgba(0,140,255,0.15) 0%, transparent 65%);
          pointer-events: none; z-index: 0;
        }
        .bg-glow-bl {
          position: fixed; bottom: -100px; left: -80px;
          width: 350px; height: 350px;
          background: radial-gradient(circle, rgba(0,220,255,0.08) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }

        .split {
          display: flex;
          width: 100%;
          max-width: 820px;
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid rgba(0,180,255,0.18);
          position: relative; z-index: 5;
          box-shadow: 0 40px 100px rgba(0,0,0,0.7),
                      inset 0 1px 0 rgba(255,255,255,0.04);
        }

        .left {
          flex: 1;
          background: linear-gradient(160deg, #081628 0%, #030c18 60%, #020810 100%);
          padding: 52px 44px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
          border-right: 1px solid rgba(0,180,255,0.1);
        }
        .left-glow-t {
          position: absolute; top: -80px; left: -40px;
          width: 260px; height: 260px;
          background: radial-gradient(circle, rgba(0,180,255,0.14) 0%, transparent 70%);
          pointer-events: none;
        }
        .left-glow-b {
          position: absolute; bottom: -60px; right: -40px;
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(0,140,255,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .status-pill {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(0,200,255,0.07);
          border: 1px solid rgba(0,200,255,0.2);
          border-radius: 100px;
          padding: 6px 16px;
          width: fit-content;
          margin-bottom: 36px;
        }
        .live-dot {
          width: 7px; height: 7px;
          background: #00e5ff; border-radius: 50%;
          box-shadow: 0 0 6px #00e5ff;
          animation: livepulse 1.6s ease-in-out infinite;
        }
        @keyframes livepulse {
          0%,100%{ opacity:1; transform:scale(1); }
          50%{ opacity:0.3; transform:scale(0.65); }
        }
        .status-txt {
          font-size: 10px; font-weight: 700;
          color: #00d4ff; letter-spacing: 2px; text-transform: uppercase;
        }

        .brand-line1 {
          font-size: 52px; font-weight: 900;
          color: #fff; letter-spacing: -1px; line-height: 1;
        }
        .brand-line2 {
          font-size: 52px; font-weight: 900;
          letter-spacing: -1px; line-height: 1;
          background: linear-gradient(90deg, #00aaff, #00e5ff, #60cfff);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradmove 3s linear infinite;
        }
        @keyframes gradmove { to { background-position: 200% center; } }

        .brand-rule {
          width: 52px; height: 3px;
          background: linear-gradient(90deg, #00aaff, #00e5ff);
          border-radius: 2px; margin: 18px 0 16px;
        }
        .brand-tagline {
          font-size: 13px; color: rgba(255,255,255,0.3);
          line-height: 1.8; max-width: 240px;
        }
        .brand-tagline em {
          color: rgba(0,210,255,0.6);
          font-style: normal; font-weight: 600;
        }

        .right {
          flex: 1;
          background: #040c18;
          padding: 52px 44px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
        }
        .right::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, transparent, #00aaff, #00e5ff, transparent);
        }

        .form-eyebrow {
          font-size: 10px; font-weight: 700;
          color: rgba(0,200,255,0.5);
          letter-spacing: 2.5px; text-transform: uppercase;
          margin-bottom: 8px;
        }
        .form-title {
          font-size: 26px; font-weight: 900;
          color: #fff; margin-bottom: 4px;
        }
        .form-sub {
          font-size: 13px; color: rgba(255,255,255,0.25);
          margin-bottom: 32px;
        }

        .f-lbl {
          font-size: 10px; font-weight: 700;
          color: rgba(0,200,255,0.55);
          letter-spacing: 1.2px; text-transform: uppercase;
          margin-bottom: 7px;
        }
        .inp-wrap { position: relative; margin-bottom: 16px; }
        .inp-field {
          display: block; width: 100%;
          background: rgba(0,160,255,0.05);
          border: 1px solid rgba(0,160,255,0.15);
          border-radius: 11px;
          padding: 13px 16px 13px 42px;
          font-size: 13px; color: #fff;
          font-family: inherit; outline: none;
          transition: all 0.22s; box-sizing: border-box;
        }
        .inp-field::placeholder { color: rgba(255,255,255,0.15); }
        .inp-field:focus {
          border-color: rgba(0,200,255,0.55);
          background: rgba(0,200,255,0.07);
          box-shadow: 0 0 0 3px rgba(0,200,255,0.08);
        }
        .inp-icon {
          position: absolute; left: 14px; top: 50%;
          transform: translateY(-50%);
          color: rgba(0,180,255,0.35); font-size: 15px;
          pointer-events: none;
        }
        .eye-btn {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          color: rgba(0,180,255,0.35);
          cursor: pointer; font-size: 15px;
          padding: 0; transition: color 0.2s;
        }
        .eye-btn:hover { color: #00c8ff; }

        .forgot-row { text-align: right; margin: -4px 0 22px; }
        .forgot {
          font-size: 11px; color: rgba(0,200,255,0.4);
          cursor: pointer; transition: color 0.2s;
          background: none; border: none; font-family: inherit;
        }
        .forgot:hover { color: #00e5ff; }

        .msg-box {
          border-radius: 8px; padding: 10px 14px;
          font-size: 12px; margin-bottom: 14px;
          display: flex; align-items: center; gap: 8px;
        }
        .msg-box.success {
          background: rgba(0,200,255,0.08);
          border: 1px solid rgba(0,200,255,0.25); color: #00d4ff;
        }
        .msg-box.error {
          background: rgba(217,83,79,0.1);
          border: 1px solid rgba(217,83,79,0.3); color: #ff7875;
        }

        .submit-btn {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #005fcc, #0099ff, #00d4ff);
          background-size: 200% auto;
          border: none; border-radius: 11px;
          font-size: 13px; font-weight: 800; color: #fff;
          letter-spacing: 1.5px; text-transform: uppercase;
          cursor: pointer; transition: all 0.3s;
          box-shadow: 0 4px 20px rgba(0,150,255,0.25);
          animation: btnshine 3s linear infinite;
          font-family: inherit;
        }
        @keyframes btnshine {
          0%{ background-position: 0% 50%; }
          100%{ background-position: 200% 50%; }
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(0,170,255,0.45);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 13px; height: 13px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block; vertical-align: middle; margin-right: 8px;
        }

        .bottom-rule {
          height: 1px;
          background: rgba(0,180,255,0.08);
          margin: 28px 0 18px;
        }
        .footer-txt {
          text-align: center; font-size: 10px;
          color: rgba(255,255,255,0.13); letter-spacing: 0.5px;
        }

        @media (max-width: 620px) {
          .split { flex-direction: column; }
          .left {
            padding: 36px 28px;
            border-right: none;
            border-bottom: 1px solid rgba(0,180,255,0.1);
          }
          .right { padding: 36px 28px; }
          .brand-line1, .brand-line2 { font-size: 38px; }
        }
      `}</style>

      <div className="bg-grid" />
      <div className="bg-glow-center" />
      <div className="bg-glow-bl" />

      <div className="split">
        {/* ── LEFT PANEL ── */}
        <div className="left">
          <div className="left-glow-t" />
          <div className="left-glow-b" />

          <div className="status-pill">
            <div className="live-dot" />
            <span className="status-txt">System Online</span>
          </div>

          <div className="brand-line1">SEVEN</div>
          <div className="brand-line2">STAR</div>
          <div className="brand-rule" />
          <p className="brand-tagline">
            <em>Premium tile vanity</em> — manage your entire catalog, orders
            &amp; clients from one powerful dashboard.
          </p>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="right">
          <div className="form-eyebrow">Admin Access</div>
          <div className="form-title">Welcome back</div>
          <div className="form-sub">Sign in to your control panel</div>

          {message && (
            <div className={`msg-box ${isSuccess ? "success" : "error"}`}>
              <span>{isSuccess ? "✓" : "⚠"}</span>
              {displayMsg}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="f-lbl">Email Address</div>
            <div className="inp-wrap">
              <span className="inp-icon">✉</span>
              <input
                className="inp-field"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="off"
              />
            </div>

            <div className="f-lbl">Password</div>
            <div className="inp-wrap">
              <span className="inp-icon">🔑</span>
              <input
                className="inp-field"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                style={{ paddingRight: "42px" }}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <div className="forgot-row">
              <Link to="/admin/forgot-password" className="forgot">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner" />
                  Signing in...
                </>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          <div className="bottom-rule" />
          <div className="footer-txt">
            © {new Date().getFullYear()} Seven Star Tile Vanity — All rights
            reserved
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
