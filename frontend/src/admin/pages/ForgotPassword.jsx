import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email },
      );
      setMessage("success:" + res.data.message);
    } catch (err) {
      setMessage("error:Kuch ghalat hua, dobara try karein.");
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
          Forgot Password
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "13px",
            margin: "0 0 28px",
          }}
        >
          Apna email enter karein — reset link bhej denge
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
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
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
            {loading ? "Sending..." : "Send Reset Link →"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link
            to="/admin/login"
            style={{
              color: "rgba(0,200,255,0.5)",
              fontSize: "13px",
              textDecoration: "none",
            }}
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
