import { useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";
const getToken = () => sessionStorage.getItem("adminToken");

function TwoFactorSetup() {
  const [step, setStep] = useState(1);
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const generateQR = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/auth/setup-2fa`,
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } },
      );
      setQrCode(res.data.qrCode);
      setSecret(res.data.secret);
      setStep(2);
    } catch (err) {
      setMessage("error:Failed to generate QR code.");
    } finally {
      setLoading(false);
    }
  };

  const verifyAndEnable = async () => {
    if (!code || code.length !== 6) {
      setMessage("error:Please enter a valid 6-digit code.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${BASE_URL}/auth/enable-2fa`,
        { code },
        { headers: { Authorization: `Bearer ${getToken()}` } },
      );
      setEnabled(true);
      setStep(3);
      setMessage("success:2FA enabled successfully!");
    } catch (err) {
      setMessage("error:" + (err.response?.data?.message || "Invalid code."));
    } finally {
      setLoading(false);
    }
  };

  const isSuccess = message.startsWith("success:");
  const displayMsg = message.replace(/^(success|error):/, "");

  const COLORS = {
    background: "#0A0F1E",
    card: "#0D1B2E",
    cyan: "#00E5FF",
    text: "#E6F1FF",
    muted: "#8AA0BF",
    border: "#1E3A5F",
    inputBg: "#10233A",
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
      <h1
        style={{
          margin: "0 0 8px",
          fontSize: "26px",
          color: COLORS.cyan,
          fontWeight: 700,
        }}
      >
        Two-Factor Authentication
      </h1>
      <p style={{ margin: "0 0 32px", color: COLORS.muted, fontSize: "14px" }}>
        Add an extra layer of security to your admin account
      </p>

      {message && (
        <div
          style={{
            background: isSuccess
              ? "rgba(0,200,100,0.1)"
              : "rgba(255,82,82,0.1)",
            border: `1px solid ${isSuccess ? "rgba(0,200,100,0.3)" : "rgba(255,82,82,0.3)"}`,
            color: isSuccess ? "#00c864" : "#FF5252",
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            marginBottom: "24px",
          }}
        >
          {isSuccess ? "✓ " : "⚠ "}
          {displayMsg}
        </div>
      )}

      <div
        style={{
          background: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          borderRadius: "14px",
          padding: "32px",
          maxWidth: "500px",
        }}
      >
        {/* Step 1 */}
        {step === 1 && (
          <div>
            <div
              style={{
                fontSize: "48px",
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              🔐
            </div>
            <h2
              style={{
                color: COLORS.text,
                textAlign: "center",
                margin: "0 0 12px",
              }}
            >
              Setup Google Authenticator
            </h2>
            <p
              style={{
                color: COLORS.muted,
                fontSize: "14px",
                textAlign: "center",
                lineHeight: 1.7,
                margin: "0 0 28px",
              }}
            >
              Make sure{" "}
              <strong style={{ color: COLORS.cyan }}>
                Google Authenticator
              </strong>{" "}
              app is installed on your phone before continuing.
            </p>
            <button
              onClick={generateQR}
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background: COLORS.cyan,
                color: "#04141C",
                border: "none",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {loading ? "Generating..." : "Generate QR Code →"}
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div>
            <h2
              style={{
                color: COLORS.text,
                margin: "0 0 8px",
                fontSize: "18px",
              }}
            >
              Scan QR Code
            </h2>
            <p
              style={{
                color: COLORS.muted,
                fontSize: "13px",
                margin: "0 0 20px",
              }}
            >
              Open Google Authenticator app → Tap "+" → Scan QR code
            </p>

            {qrCode && (
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <img
                  src={qrCode}
                  alt="QR Code"
                  style={{
                    width: "200px",
                    height: "200px",
                    borderRadius: "8px",
                    background: "#fff",
                    padding: "8px",
                  }}
                />
              </div>
            )}

            <div
              style={{
                background: COLORS.inputBg,
                border: `1px solid ${COLORS.border}`,
                borderRadius: "8px",
                padding: "12px",
                marginBottom: "20px",
              }}
            >
              <p
                style={{
                  color: COLORS.muted,
                  fontSize: "11px",
                  margin: "0 0 4px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Manual Entry Code (if QR doesn't work):
              </p>
              <p
                style={{
                  color: COLORS.cyan,
                  fontSize: "13px",
                  fontWeight: 700,
                  margin: 0,
                  wordBreak: "break-all",
                }}
              >
                {secret}
              </p>
            </div>

            <p
              style={{
                color: COLORS.muted,
                fontSize: "13px",
                margin: "0 0 10px",
              }}
            >
              Enter the 6-digit code from the app:
            </p>
            <input
              type="text"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="000000"
              maxLength={6}
              style={{
                width: "100%",
                background: COLORS.inputBg,
                border: `1px solid ${COLORS.border}`,
                borderRadius: "10px",
                padding: "13px 16px",
                color: COLORS.text,
                fontSize: "24px",
                letterSpacing: "8px",
                textAlign: "center",
                outline: "none",
                boxSizing: "border-box",
                marginBottom: "16px",
              }}
            />
            <button
              onClick={verifyAndEnable}
              disabled={loading || code.length !== 6}
              style={{
                width: "100%",
                padding: "14px",
                background:
                  code.length === 6 ? COLORS.cyan : "rgba(0,229,255,0.2)",
                color: code.length === 6 ? "#04141C" : COLORS.muted,
                border: "none",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 700,
                cursor: code.length === 6 ? "pointer" : "not-allowed",
              }}
            >
              {loading ? "Verifying..." : "Verify & Enable 2FA →"}
            </button>
          </div>
        )}

        {/* Step 3 - Success */}
        {step === 3 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>✅</div>
            <h2 style={{ color: COLORS.cyan, margin: "0 0 12px" }}>
              2FA Enabled!
            </h2>
            <p
              style={{
                color: COLORS.muted,
                fontSize: "14px",
                lineHeight: 1.7,
                margin: "0 0 24px",
              }}
            >
              Two-factor authentication is now active. Every login will require
              your Google Authenticator code.
            </p>
            <div
              style={{
                background: "rgba(255,193,7,0.1)",
                border: "1px solid rgba(255,193,7,0.3)",
                borderRadius: "8px",
                padding: "14px",
                color: "#FFC107",
                fontSize: "13px",
                textAlign: "left",
              }}
            >
              ⚠️ <strong>Important:</strong> Do not delete the Google
              Authenticator entry. If you lose access to the app, you will not
              be able to login.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TwoFactorSetup;
