const Order = require("../models/Order");
const sendWhatsAppMessage = require("../utils/sendWhatsApp");
const logAction = require("../utils/auditLogger");
const nodemailer = require("nodemailer");

const sendAdminEmail = async ({ subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Seven Star Tile Vanity" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject,
    html,
  });
};

const createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    sendWhatsAppMessage(order);

    // Admin email notification
    sendAdminEmail({
      subject: `🛒 New Order Received — ${order.fullName}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#0A0F1E;color:#E6F1FF;border-radius:16px;overflow:hidden;border:1px solid rgba(0,229,255,0.2);">
          <div style="background:linear-gradient(135deg,#0D1B2E,#0A2540);padding:28px 32px;border-bottom:1px solid rgba(0,229,255,0.15);">
            <h1 style="margin:0;font-size:22px;color:#fff;">🛒 New Order Received</h1>
            <p style="margin:6px 0 0;color:#00E5FF;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Seven Star Tile Vanity</p>
          </div>
          <div style="padding:28px 32px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:10px 0;color:#8AA0BF;font-size:13px;width:140px;">Customer</td><td style="padding:10px 0;color:#fff;font-weight:600;font-size:14px;">${order.fullName}</td></tr>
              <tr><td style="padding:10px 0;color:#8AA0BF;font-size:13px;">Phone</td><td style="padding:10px 0;color:#fff;font-size:14px;">${order.phone}</td></tr>
              <tr><td style="padding:10px 0;color:#8AA0BF;font-size:13px;">City</td><td style="padding:10px 0;color:#fff;font-size:14px;">${order.city}</td></tr>
              <tr><td style="padding:10px 0;color:#8AA0BF;font-size:13px;">Product</td><td style="padding:10px 0;color:#fff;font-size:14px;">${order.productName || "—"}</td></tr>
              <tr><td style="padding:10px 0;color:#8AA0BF;font-size:13px;">Total</td><td style="padding:10px 0;color:#00E5FF;font-weight:700;font-size:16px;">Rs. ${(order.totalPrice || 0).toLocaleString()}</td></tr>
            </table>
            <a href="${process.env.FRONTEND_URL}/admin/orders" style="display:inline-block;margin-top:20px;background:linear-gradient(135deg,#007acc,#00b8ff);color:#fff;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;">View Order →</a>
          </div>
          <div style="padding:16px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;font-size:11px;color:#3A5A7A;">
            © ${new Date().getFullYear()} Seven Star Tile Vanity — Admin Notification
          </div>
        </div>
      `,
    }).catch((err) => console.error("Order email error:", err));

    await logAction({
      action: "ORDER_CREATED",
      category: "order",
      description: `New order received from ${order.fullName} - City: ${order.city} - Phone: ${order.phone}`,
      performedBy: "customer",
      ipAddress: req.ip,
      metadata: { orderId: order._id, customerName: order.fullName },
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const oldOrder = await Order.findById(req.params.id);
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!order) return res.status(404).json({ message: "Order not found" });

    await logAction({
      action: "ORDER_UPDATED",
      category: "order",
      description: `Order status changed from "${oldOrder?.status}" to "${req.body.status || "updated"}" - Customer: ${order.fullName}`,
      ipAddress: req.ip,
      metadata: {
        orderId: order._id,
        oldStatus: oldOrder?.status,
        newStatus: req.body.status,
      },
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    await logAction({
      action: "ORDER_DELETED",
      category: "order",
      description: `Order deleted - Customer: ${order.fullName} - Phone: ${order.phone}`,
      ipAddress: req.ip,
      metadata: { orderId: req.params.id, customerName: order.fullName },
    });

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
