const ContactMessage = require("../models/ContactMessage");
const nodemailer = require("nodemailer");
const logAction = require("../utils/auditLogger");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const createContactMessage = async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;

    const newMsg = new ContactMessage({ name, phone, email, message });
    await newMsg.save();

    transporter
      .sendMail({
        from: `"Seven Star Tile Vanity" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: `✉️ New Message Received — ${name}`,
        html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#0A0F1E;color:#E6F1FF;border-radius:16px;overflow:hidden;border:1px solid rgba(0,229,255,0.2);">
          <div style="background:linear-gradient(135deg,#0D1B2E,#0A2540);padding:28px 32px;border-bottom:1px solid rgba(0,229,255,0.15);">
            <h1 style="margin:0;font-size:22px;color:#fff;">✉️ New Message Received</h1>
            <p style="margin:6px 0 0;color:#00E5FF;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Seven Star Tile Vanity</p>
          </div>
          <div style="padding:28px 32px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:10px 0;color:#8AA0BF;font-size:13px;width:140px;">Name</td><td style="padding:10px 0;color:#fff;font-weight:600;font-size:14px;">${name}</td></tr>
              <tr><td style="padding:10px 0;color:#8AA0BF;font-size:13px;">Phone</td><td style="padding:10px 0;color:#fff;font-size:14px;">${phone}</td></tr>
              <tr><td style="padding:10px 0;color:#8AA0BF;font-size:13px;">Email</td><td style="padding:10px 0;color:#fff;font-size:14px;">${email || "Not provided"}</td></tr>
              <tr><td style="padding:10px 0;color:#8AA0BF;font-size:13px;">Time</td><td style="padding:10px 0;color:#fff;font-size:14px;">${new Date().toLocaleString("en-PK")}</td></tr>
            </table>
            <div style="margin-top:20px;background:rgba(0,229,255,0.05);border:1px solid rgba(0,229,255,0.15);border-radius:10px;padding:16px;">
              <p style="margin:0 0 6px;color:#8AA0BF;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Message</p>
              <p style="margin:0;color:#E6F1FF;font-size:14px;line-height:1.7;">${message}</p>
            </div>
            <a href="${process.env.FRONTEND_URL}/admin/messages" style="display:inline-block;margin-top:20px;background:linear-gradient(135deg,#007acc,#00b8ff);color:#fff;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;">View Message →</a>
          </div>
          <div style="padding:16px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;font-size:11px;color:#3A5A7A;">
            © ${new Date().getFullYear()} Seven Star Tile Vanity — Admin Notification
          </div>
        </div>
      `,
      })
      .catch((err) => console.error("Contact email error:", err));

    await logAction({
      action: "MESSAGE_RECEIVED",
      category: "other",
      description: `New contact message from ${name} - Phone: ${phone}`,
      performedBy: "customer",
      ipAddress: req.ip,
      metadata: { name, phone, email },
    });

    res
      .status(201)
      .json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

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

const deleteMessage = async (req, res) => {
  try {
    const msg = await ContactMessage.findById(req.params.id);
    await ContactMessage.findByIdAndDelete(req.params.id);

    await logAction({
      action: "MESSAGE_DELETED",
      category: "other",
      description: `Contact message deleted from ${msg?.name || "unknown"}`,
      ipAddress: req.ip,
      metadata: { messageId: req.params.id, name: msg?.name },
    });

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
