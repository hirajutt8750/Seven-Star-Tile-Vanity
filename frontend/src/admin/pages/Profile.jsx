import { useState, useEffect, useRef } from "react";

const API = "https://seven-star-tile-vanity.onrender.com";
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const DEFAULT_PIC =
  "https://ui-avatars.com/api/?name=Admin&background=00E5FF&color=0A0F1E&size=128&bold=true";

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
    if (!file.type.startsWith("image/")) {
      setMessage("error:Please select an image file.");
      return;
    }
    setPreview(URL.createObjectURL(file));
    setMessage("");
  };

  const handleUpload = async () => {
    const file = fileRef.current.files[0];
    if (!file) return;
    setUploading(true);
    setMessage("");
    try {
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
        fileRef.current.value = "";
        setMessage("success:Profile picture updated successfully!");
      } else {
        setMessage("error:Failed to save. Try again.");
      }
    } catch {
      setMessage("error:Something went wrong. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const currentPic = preview || profile?.profileImage || DEFAULT_PIC;
  const isSuccess = message.startsWith("success:");
  const displayMsg = message.replace(/^(success|error):/, "");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0F1E",
        padding: "32px 24px",
        fontFamily: "Inter, system-ui, sans-serif",
        color: "#E6F1FF",
      }}
    >
      <style>{`
        .profile-page-wrap { max-width: 900px; margin: 0 auto; }

        .profile-header { margin-bottom: 32px; }
        .profile-header h1 {
          font-size: 28px; font-weight: 800;
          color: #fff; margin: 0 0 6px;
          letter-spacing: -0.5px;
        }
        .profile-header p { font-size: 14px; color: #5a7a99; margin: 0; }

        .profile-grid {
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 24px;
        }

        .profile-card {
          background: #0D1B2E;
          border: 1px solid #1E3A5F;
          border-radius: 20px;
          overflow: hidden;
        }
        .profile-card-banner {
          height: 90px;
          background: linear-gradient(135deg, #003d66, #001f3f, #0A0F1E);
          position: relative;
        }
        .profile-card-banner::after {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            45deg, transparent, transparent 10px,
            rgba(0,229,255,0.03) 10px, rgba(0,229,255,0.03) 20px
          );
        }
        .profile-card-body {
          padding: 0 24px 28px;
          text-align: center;
        }
        .profile-avatar-wrap {
          position: relative;
          display: inline-block;
          margin-top: -44px;
          margin-bottom: 16px;
        }
        .profile-avatar-img {
          width: 88px; height: 88px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #0D1B2E;
          outline: 3px solid #00E5FF;
          box-shadow: 0 0 24px rgba(0,229,255,0.25);
          display: block;
        }
        .profile-avatar-edit {
          position: absolute;
          bottom: 2px; right: 2px;
          width: 26px; height: 26px;
          border-radius: 50%;
          background: #00E5FF;
          color: #000;
          border: 2px solid #0D1B2E;
          cursor: pointer;
          font-size: 13px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 900;
          transition: transform 0.2s;
          line-height: 1;
        }
        .profile-avatar-edit:hover { transform: scale(1.1); }

        .profile-name {
          font-size: 18px; font-weight: 800;
          color: #fff; margin: 0 0 4px;
        }
        .profile-role-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(0,229,255,0.08);
          border: 1px solid rgba(0,229,255,0.2);
          color: #00E5FF;
          font-size: 11px; font-weight: 700;
          letter-spacing: 1px; text-transform: uppercase;
          padding: 4px 12px; border-radius: 20px;
          margin-bottom: 20px;
        }
        .profile-role-dot {
          width: 6px; height: 6px;
          background: #00E5FF; border-radius: 50%;
          box-shadow: 0 0 6px #00E5FF;
          animation: roledot 1.8s infinite;
        }
        @keyframes roledot {
          0%,100% { opacity:1; } 50% { opacity:0.3; }
        }

        .profile-stats {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 10px; margin-top: 8px;
        }
        .profile-stat {
          background: rgba(0,229,255,0.04);
          border: 1px solid rgba(0,229,255,0.1);
          border-radius: 12px;
          padding: 12px 8px;
          text-align: center;
        }
        .profile-stat-val {
          font-size: 18px; display: block;
        }
        .profile-stat-lbl {
          font-size: 10px; color: #5a7a99;
          text-transform: uppercase; letter-spacing: 0.8px;
          margin-top: 2px; display: block;
        }

        .profile-right { display: flex; flex-direction: column; gap: 20px; }

        .profile-section {
          background: #0D1B2E;
          border: 1px solid #1E3A5F;
          border-radius: 20px;
          padding: 24px;
        }
        .profile-section-title {
          font-size: 13px; font-weight: 700;
          color: rgba(0,229,255,0.6);
          letter-spacing: 1.5px; text-transform: uppercase;
          margin: 0 0 18px;
          display: flex; align-items: center; gap: 8px;
        }
        .profile-section-title::after {
          content: ''; flex: 1; height: 1px;
          background: rgba(0,229,255,0.1);
        }

        .profile-info-row {
          display: flex; align-items: center;
          padding: 14px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .profile-info-row:last-child { border-bottom: none; padding-bottom: 0; }
        .profile-info-icon {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: rgba(0,229,255,0.06);
          border: 1px solid rgba(0,229,255,0.12);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; flex-shrink: 0; margin-right: 14px;
        }
        .profile-info-label {
          font-size: 11px; color: #5a7a99;
          text-transform: uppercase; letter-spacing: 0.8px;
          margin-bottom: 3px;
        }
        .profile-info-value {
          font-size: 14px; color: #E6F1FF; font-weight: 500;
        }

        /* PREVIEW SECTION */
        .preview-wrap {
          display: flex; align-items: center; gap: 16px;
          background: rgba(0,229,255,0.04);
          border: 1px solid rgba(0,229,255,0.15);
          border-radius: 14px;
          padding: 16px;
          margin-bottom: 16px;
        }
        .preview-img {
          width: 64px; height: 64px;
          border-radius: 50%; object-fit: cover;
          border: 2px solid #00E5FF;
          flex-shrink: 0;
        }
        .preview-info { flex: 1; }
        .preview-info p { margin: 0; font-size: 13px; color: #E6F1FF; font-weight: 600; }
        .preview-info span { font-size: 12px; color: #5a7a99; }
        .preview-remove {
          background: rgba(255,82,82,0.1);
          border: 1px solid rgba(255,82,82,0.3);
          color: #FF5252; border-radius: 8px;
          padding: 6px 12px; font-size: 12px;
          cursor: pointer; font-weight: 600;
          font-family: inherit;
        }

        .upload-btn {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #007acc, #00b8ff);
          color: #fff; border: none;
          border-radius: 12px; font-size: 14px;
          font-weight: 700; cursor: pointer;
          transition: all 0.25s;
          letter-spacing: 0.5px;
          font-family: inherit;
        }
        .upload-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,180,255,0.3);
        }
        .upload-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .change-photo-btn {
          width: 100%; padding: 11px;
          background: transparent;
          color: #00E5FF;
          border: 1px solid rgba(0,229,255,0.25);
          border-radius: 12px; font-size: 13px;
          font-weight: 600; cursor: pointer;
          transition: all 0.25s;
          font-family: inherit;
          margin-top: 12px;
        }
        .change-photo-btn:hover {
          background: rgba(0,229,255,0.07);
          border-color: rgba(0,229,255,0.5);
        }

        .msg-box {
          padding: 12px 16px; border-radius: 10px;
          font-size: 13px; margin-bottom: 14px;
          display: flex; align-items: center; gap: 10px;
          font-weight: 500;
        }
        .msg-box.success {
          background: rgba(76,175,80,0.1);
          border: 1px solid rgba(76,175,80,0.3);
          color: #4CAF50;
        }
        .msg-box.error {
          background: rgba(255,82,82,0.1);
          border: 1px solid rgba(255,82,82,0.3);
          color: #FF5252;
        }

        @media (max-width: 768px) {
          .profile-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="profile-page-wrap">
        <div className="profile-header">
          <h1>Profile Settings</h1>
          <p>Manage your admin account and profile picture</p>
        </div>

        <div className="profile-grid">
          {/* LEFT — Profile Card */}
          <div className="profile-card">
            <div className="profile-card-banner" />
            <div className="profile-card-body">
              <div className="profile-avatar-wrap">
                <img
                  src={currentPic}
                  alt="Profile"
                  className="profile-avatar-img"
                />
                <button
                  className="profile-avatar-edit"
                  onClick={() => fileRef.current.click()}
                  title="Change photo"
                >
                  ✎
                </button>
              </div>

              <p className="profile-name">Saad Bin Saeed</p>
              <div className="profile-role-badge">
                <span className="profile-role-dot" />
                Administrator
              </div>

              <div className="profile-stats">
                <div className="profile-stat">
                  <span className="profile-stat-val">🔐</span>
                  <span className="profile-stat-lbl">Secured</span>
                </div>
                <div className="profile-stat">
                  <span className="profile-stat-val">✅</span>
                  <span className="profile-stat-lbl">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="profile-right">
            {/* Account Info */}
            <div className="profile-section">
              <p className="profile-section-title">Account Information</p>

              <div className="profile-info-row">
                <div className="profile-info-icon">✉️</div>
                <div>
                  <div className="profile-info-label">Email Address</div>
                  <div className="profile-info-value">
                    {profile?.email || "Loading..."}
                  </div>
                </div>
              </div>

              <div className="profile-info-row">
                <div className="profile-info-icon">🛡️</div>
                <div>
                  <div className="profile-info-label">Role</div>
                  <div
                    className="profile-info-value"
                    style={{ color: "#00E5FF" }}
                  >
                    Administrator
                  </div>
                </div>
              </div>

              <div className="profile-info-row">
                <div className="profile-info-icon">🔐</div>
                <div>
                  <div className="profile-info-label">Two Factor Auth</div>
                  <div
                    className="profile-info-value"
                    style={{
                      color: profile?.twoFactorEnabled ? "#4CAF50" : "#FF5252",
                    }}
                  >
                    {profile?.twoFactorEnabled ? "Enabled" : "Disabled"}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Picture Section */}
            <div className="profile-section">
              <p className="profile-section-title">Profile Picture</p>

              {/* Hidden file input */}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              {/* Message */}
              {message && (
                <div className={`msg-box ${isSuccess ? "success" : "error"}`}>
                  <span>{isSuccess ? "✓" : "⚠"}</span>
                  {displayMsg}
                </div>
              )}

              {/* Preview */}
              {preview ? (
                <>
                  <div className="preview-wrap">
                    <img src={preview} alt="Preview" className="preview-img" />
                    <div className="preview-info">
                      <p>New photo selected</p>
                      <span>Click save to update your profile picture</span>
                    </div>
                    <button
                      className="preview-remove"
                      onClick={() => {
                        setPreview(null);
                        fileRef.current.value = "";
                      }}
                    >
                      ✕
                    </button>
                  </div>
                  <button
                    className="upload-btn"
                    onClick={handleUpload}
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "💾 Save Profile Picture"}
                  </button>
                </>
              ) : (
                <button
                  className="change-photo-btn"
                  onClick={() => fileRef.current.click()}
                >
                  📷 Change Profile Photo
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
