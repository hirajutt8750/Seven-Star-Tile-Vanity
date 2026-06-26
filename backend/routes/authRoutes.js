const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");

// Register - DISABLED
router.post("/register", (req, res) => {
  res.status(403).json({ message: "Registration is disabled." });
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email aur password required hain." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email ya password galat hai." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Email ya password galat hai." });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({ token, message: "Login ho gaya!" });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
});

// Forgot Password - email bhejo
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required hai." });
    }

    const user = await User.findOne({ email });

    // Security: same response chahe user mile ya na mile
    if (!user) {
      return res.json({
        message:
          "Agar ye email registered hai to reset link bhej diya gaya hai.",
      });
    }

    const resetToken = user.generateResetToken();
    await user.save();

    // Reset link
    const resetUrl = `${process.env.FRONTEND_URL}/admin/reset-password/${resetToken}`;

    // Email bhejo
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
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #0f0f0f; color: #fff; padding: 32px; border-radius: 12px; border: 1px solid rgba(212,175,55,0.3);">
          <h2 style="color: #d4af37; margin-top: 0;">Password Reset Request</h2>
          <p style="color: rgba(255,255,255,0.7);">Aap ne admin panel ka password reset request kiya hai.</p>
          <p style="color: rgba(255,255,255,0.7);">Neeche button click karein — ye link <strong>30 minutes</strong> mein expire ho jayega.</p>
          <a href="${resetUrl}" style="display: inline-block; background: #d4af37; color: #000; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; margin: 20px 0;">
            Reset Password →
          </a>
          <p style="color: rgba(255,255,255,0.4); font-size: 12px; margin-top: 24px;">Agar aap ne ye request nahi kiya to is email ko ignore karein.</p>
        </div>
      `,
    });

    res.json({
      message: "Agar ye email registered hai to reset link bhej diya gaya hai.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Reset Password - naya password set karo
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password kam se kam 6 characters ka hona chahiye." });
    }

    // Token hash karo aur match karo
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
        .json({ message: "Token invalid ya expire ho gaya hai." });
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: "Password successfully reset ho gaya!" });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
