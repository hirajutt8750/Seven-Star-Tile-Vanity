import { useState, useEffect, useRef } from "react";

const API = "https://seven-star-tile-vanity.onrender.com";
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const DEFAULT_PIC =
  "https://ui-avatars.com/api/?name=Admin&background=00E5FF&color=0A0F1E&size=128&bold=true";

const COLORS = {
  background: "#0A0F1E",
  card: "#0D1B2E",
  cyan: "#00E5FF",
  red: "#FF5252",
  green: "#4CAF50",
  text: "#E6F1FF",
  muted: "#8AA0BF",
  border: "#1E3A5F",
};

function Profile() {
  const [profile, setProfile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();
  const token = sessionStorage.getItem("adminToken");

  useEffect(() => {
    fetch(`${API}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setProfile(d))
      .catch(() => {});
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    const file = fileRef.current.files[0];
    if (!file) return;

    setUploading(true);
    setMessage("");

    try {
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("folder", "seven-star/admin");

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData },
      );
      const cloudData = await cloudRes.json();

      if (!cloudData.secure_url) throw new Error("Upload failed");

      // Save to backend
      const res = await fetch(`${API}/api/auth/profile/image`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ profileImage: cloudData.secure_url }),
      });

      const data = await res.json();
      if (res.ok) {
        setProfile(data.user);
        setPreview(null);
        setMessage("success:Profile picture updated successfully!");
        fileRef.current.value = "";
      } else {
        setMessage("error:Failed to save image.");
      }
    } catch (err) {
      setMessage("error:Something went wrong. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const currentPic = preview || profile?.profileImage || DEFAULT_PIC;

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
        Profile Settings
      </h1>

      <div
        style={{
          maxWidth: "500px",
          background: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          borderTop: `2px solid ${COLORS.cyan}`,
          borderRadius: "16px",
          padding: "32px",
        }}
      >
        {/* Profile Picture */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              src={currentPic}
              alt="Profile"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                border: `3px solid ${COLORS.cyan}`,
                boxShadow: `0 0 20px rgba(0,229,255,0.3)`,
              }}
            />
            <button
              onClick={() => fileRef.current.click()}
              style={{
                position: "absolute",
                bottom: "4px",
                right: "4px",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: COLORS.cyan,
                color: "#000",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700",
              }}
              title="Change photo"
            >
              ✏️
            </button>
          </div>

          <p
            style={{
              margin: "12px 0 0",
              color: COLORS.muted,
              fontSize: "13px",
            }}
          >
            Click the pencil icon to change photo
          </p>
        </div>

        {/* Email */}
        {profile && (
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: "700",
                color: `${COLORS.cyan}99`,
                letterSpacing: "1px",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              Email Address
            </label>
            <div
              style={{
                background: `${COLORS.cyan}08`,
                border: `1px solid ${COLORS.border}`,
                borderRadius: "10px",
                padding: "12px 14px",
                fontSize: "14px",
                color: COLORS.muted,
              }}
            >
              {profile.email}
            </div>
          </div>
        )}

        {/* File Input (hidden) */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {/* Message */}
        {message && (
          <div
            style={{
              padding: "12px 14px",
              borderRadius: "10px",
              fontSize: "13px",
              marginBottom: "16px",
              background: message.startsWith("success")
                ? `${COLORS.green}18`
                : `${COLORS.red}18`,
              border: `1px solid ${message.startsWith("success") ? COLORS.green : COLORS.red}`,
              color: message.startsWith("success") ? COLORS.green : COLORS.red,
            }}
          >
            {message.replace(/^(success|error):/, "")}
          </div>
        )}

        {/* Upload Button — only show when file selected */}
        {preview && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            style={{
              width: "100%",
              padding: "13px",
              background: uploading ? `${COLORS.cyan}44` : COLORS.cyan,
              color: "#000",
              border: "none",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: "700",
              cursor: uploading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            {uploading ? "Uploading..." : "Save Profile Picture"}
          </button>
        )}
      </div>
    </div>
  );
}

export default Profile;
