const Order = require("../models/Order");
const sendWhatsAppMessage = require("../utils/sendWhatsApp");
const logAction = require("../utils/auditLogger");

const createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    sendWhatsAppMessage(order);

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
