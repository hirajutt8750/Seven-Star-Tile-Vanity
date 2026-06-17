const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  sendOrderEmail,
} = require("../controllers/orderController");

// Get all orders
router.get("/", getAllOrders);

// Get single order
router.get("/:id", getOrderById);

// Create new order
router.post("/", createOrder);

// Update order
router.put("/:id", updateOrder);

// Delete order
router.delete("/:id", deleteOrder);

// Send order to Email
router.post("/send-email", sendOrderEmail);

module.exports = router;
