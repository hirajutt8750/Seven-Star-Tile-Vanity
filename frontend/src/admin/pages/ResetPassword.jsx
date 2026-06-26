import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setMessage("error:Passwords match nahi kar rahe.");
      return;
    }
    if (password.length < 6) {
      setMessage("error:Password kam se kam 6 characters ka hona chahiye.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password },
      );
      setMessage("success:" + res.data.message);
      setTimeout(() => navigate("/admin/login"), 2000);
    } catch (err) {
      setMessage(
        "error:" +
          (err.response?.data?.message || "Token invalid ya expire ho gaya."),
      );
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
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#040c18",
          border: "1px solid rgba(0,180,255,0.18)",
          borderRadius: "16px",
          padding: "40px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        <h2
          style={{
            color: "#fff",
            margin: "0 0 8px",
            fontSize: "22px",
            fontWeight: 800,
          }}
        >
          Reset Password
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "13px",
            margin: "0 0 28px",
          }}
        >
          Naya password set karein
        </p>

        {message && (
          <div
            style={{
              background: isSuccess
                ? "rgba(0,200,100,0.1)"
                : "rgba(217,83,79,0.1)",
              border: `1px solid ${isSuccess ? "rgba(0,200,100,0.3)" : "rgba(217,83,79,0.3)"}`,
              color: isSuccess ? "#00c864" : "#ff7875",
              padding: "10px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              marginBottom: "16px",
            }}
          >
            {isSuccess ? "✓ " : "⚠ "}
            {displayMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "rgba(0,200,255,0.55)",
                letterSpacing: "1.2px",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "7px",
              }}
            >
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
              style={{
                width: "100%",
                background: "rgba(0,160,255,0.05)",
                border: "1px solid rgba(0,160,255,0.15)",
                borderRadius: "10px",
                padding: "13px 16px",
                color: "#fff",
                fontSize: "13px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "rgba(0,200,255,0.55)",
                letterSpacing: "1.2px",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "7px",
              }}
            >
              Confirm Password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm new password"
              required
              style={{
                width: "100%",
                background: "rgba(0,160,255,0.05)",
                border: "1px solid rgba(0,160,255,0.15)",
                borderRadius: "10px",
                padding: "13px 16px",
                color: "#fff",
                fontSize: "13px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: "linear-gradient(135deg, #005fcc, #0099ff)",
              border: "none",
              borderRadius: "10px",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 800,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Resetting..." : "Reset Password →"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
