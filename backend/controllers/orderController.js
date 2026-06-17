const Order = require("../models/Order");
const sendWhatsAppMessage = require("../utils/sendWhatsApp");
const nodemailer = require("nodemailer");
const path = require("path");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Create new order
const createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    sendWhatsAppMessage(order);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single order
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete order
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send PDF via email
const sendOrderEmail = async (req, res) => {
  try {
    const { orderId, pdfBase64, customerEmail } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const pdfBuffer = Buffer.from(pdfBase64, "base64");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customerEmail || order.email,
      subject: `Order Confirmation — 7 Star Tile Vanity`,
      html: `
        <div style="font-family:Arial;max-width:600px;margin:auto;">
          <h2 style="color:#d4af37;border-bottom:2px solid #d4af37;padding-bottom:10px;">
            7 Star Tile Vanity
          </h2>
          <p>Dear <strong>${order.fullName}</strong>,</p>
          <p>Thank you for your order! Please find your order confirmation attached.</p>
          <table style="width:100%;font-size:14px;border-collapse:collapse;margin:20px 0;">
            <tr style="background:#f5f5f5;">
              <td style="padding:10px;font-weight:bold;">Order ID</td>
              <td style="padding:10px;">${order._id}</td>
            </tr>
            <tr>
              <td style="padding:10px;font-weight:bold;">Name</td>
              <td style="padding:10px;">${order.fullName}</td>
            </tr>
            <tr style="background:#f5f5f5;">
              <td style="padding:10px;font-weight:bold;">Phone</td>
              <td style="padding:10px;">${order.phone}</td>
            </tr>
            <tr>
              <td style="padding:10px;font-weight:bold;">Total Price</td>
              <td style="padding:10px;color:#d4af37;font-weight:bold;">
                Rs. ${(order.totalPrice || 0).toLocaleString()}
              </td>
            </tr>
            <tr style="background:#f5f5f5;">
              <td style="padding:10px;font-weight:bold;">Status</td>
              <td style="padding:10px;">${order.status}</td>
            </tr>
            <tr>
              <td style="padding:10px;font-weight:bold;">Delivery Date</td>
              <td style="padding:10px;">${order.deliveryDate || "To be confirmed"}</td>
            </tr>
          </table>
          <p style="color:#888;font-size:13px;">
            For any queries, contact us at 0323 7429771 or reply to this email.
          </p>
          <p style="color:#d4af37;font-weight:bold;">7 Star Tile Vanity — Gujranwala, Pakistan</p>
        </div>
      `,
      attachments: [
        {
          filename: `Order_${order._id}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  sendOrderEmail,
};
