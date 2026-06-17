const ContactMessage = require("../models/ContactMessage");
const nodemailer = require("nodemailer");

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST — message save + email send
const createContactMessage = async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;

    // MongoDB mein save
    const newMsg = new ContactMessage({ name, phone, email, message });
    await newMsg.save();

    // Email bhejo
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Contact Message from ${name}`,
      html: `
        <h2 style="color:#d4af37;">New Message — 7 Star Tile Vanity</h2>
        <table style="font-family:Arial;font-size:14px;border-collapse:collapse;width:100%">
          <tr><td style="padding:8px;font-weight:bold;">Name:</td><td style="padding:8px;">${name}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Phone:</td><td style="padding:8px;">${phone}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Email:</td><td style="padding:8px;">${email || "Not provided"}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Message:</td><td style="padding:8px;">${message}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Time:</td><td style="padding:8px;">${new Date().toLocaleString("en-PK")}</td></tr>
        </table>
      `,
    });

    res
      .status(201)
      .json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

// GET — sab messages (admin ke liye)
const getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch messages." });
  }
};

// PUT — message read mark karo
const markAsRead = async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true },
    );
    res.status(200).json({ success: true, data: msg });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update." });
  }
};

// DELETE — message delete karo
const deleteMessage = async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete." });
  }
};

module.exports = {
  createContactMessage,
  getAllMessages,
  markAsRead,
  deleteMessage,
};
