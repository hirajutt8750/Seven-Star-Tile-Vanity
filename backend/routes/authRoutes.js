const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

// Register - DISABLED
router.post("/register", (req, res) => {
  res.status(403).json({ message: "Registration is disabled." });
});

// Login - Step 1 (email + password)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Agar 2FA enabled hai to temporary token bhejo
    if (user.twoFactorEnabled) {
      const tempToken = jwt.sign(
        { userId: user._id, require2FA: true },
        process.env.JWT_SECRET,
        { expiresIn: "10m" },
      );
      return res.json({
        require2FA: true,
        tempToken,
        message: "Please enter your 2FA code.",
      });
    }

    // 2FA nahi hai to normal token bhejo
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({ token, message: "Login successful!" });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
});

// Login - Step 2 (2FA verify)
router.post("/verify-2fa", async (req, res) => {
  try {
    const { tempToken, code } = req.body;

    if (!tempToken || !code) {
      return res.status(400).json({ message: "Token and code are required." });
    }

    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    if (!decoded.require2FA) {
      return res.status(400).json({ message: "Invalid token." });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: code,
      window: 1,
    });

    if (!verified) {
      return res.status(400).json({ message: "Invalid or expired 2FA code." });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({ token, message: "Login successful!" });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

// 2FA Setup - QR code generate karo
router.post("/setup-2fa", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    const secret = speakeasy.generateSecret({
      name: `Seven Star Admin (${user.email})`,
      issuer: "Seven Star Tile Vanity",
    });

    user.twoFactorSecret = secret.base32;
    await user.save();

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    res.json({
      qrCode: qrCodeUrl,
      secret: secret.base32,
      message: "Scan this QR code with Google Authenticator.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

// 2FA Enable - verify karke enable karo
router.post("/enable-2fa", protect, async (req, res) => {
  try {
    const { code } = req.body;
    const user = await User.findById(req.user.userId);

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: code,
      window: 1,
    });

    if (!verified) {
      return res
        .status(400)
        .json({ message: "Invalid code. Please try again." });
    }

    user.twoFactorEnabled = true;
    await user.save();

    res.json({ message: "2FA enabled successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

// 2FA Disable
router.post("/disable-2fa", protect, async (req, res) => {
  try {
    const { code } = req.body;
    const user = await User.findById(req.user.userId);

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: code,
      window: 1,
    });

    if (!verified) {
      return res.status(400).json({ message: "Invalid code." });
    }

    user.twoFactorEnabled = false;
    user.twoFactorSecret = null;
    await user.save();

    res.json({ message: "2FA disabled successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

// Forgot Password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        message: "If this email is registered, a reset link has been sent.",
      });
    }

    const resetToken = user.generateResetToken();
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/admin/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Seven Star Admin - Password Reset",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;background:#0f0f0f;color:#fff;padding:32px;border-radius:12px;border:1px solid rgba(212,175,55,0.3);">
          <h2 style="color:#d4af37;margin-top:0;">Password Reset Request</h2>
          <p style="color:rgba(255,255,255,0.7);">You requested a password reset for your admin panel.</p>
          <p style="color:rgba(255,255,255,0.7);">Click the button below — this link expires in <strong>30 minutes</strong>.</p>
          <a href="${resetUrl}" style="display:inline-block;background:#d4af37;color:#000;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:700;margin:20px 0;">
            Reset Password →
          </a>
          <p style="color:rgba(255,255,255,0.4);font-size:12px;margin-top:24px;">If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    res.json({
      message: "If this email is registered, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Reset Password
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Token is invalid or has expired." });
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: "Password reset successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});
// Get Profile
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "-password -resetPasswordToken -resetPasswordExpires -twoFactorSecret",
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

// Update Profile Image
router.put("/profile/image", protect, async (req, res) => {
  try {
    const { profileImage } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { profileImage },
      { new: true },
    ).select("-password");
    res.json({ message: "Profile image updated!", user });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});
module.exports = router;
