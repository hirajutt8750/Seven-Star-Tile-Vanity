const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  altPhone: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  productType: {
    type: String,
    default: "",
  },
  category: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "",
  },
  customWidth: {
    type: String,
    default: "",
  },
  customHeight: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "",
  },
  finish: {
    type: String,
    default: "",
  },
  design: {
    type: String,
    default: "",
  },
  quantity: {
    type: String,
    default: "",
  },
  specialNotes: {
    type: String,
    default: "",
  },
  customImages: {
    type: [String],
    default: [],
  },
  deliveryMethod: {
    type: String,
    default: "home",
  },
  deliveryAddress: {
    type: String,
    default: "",
  },
  deliveryDate: {
    type: String,
    default: "",
  },
  urgency: {
    type: String,
    default: "normal",
  },
  cartItems: {
    type: Array,
    default: [],
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
