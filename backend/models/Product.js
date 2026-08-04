const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: function () {
      return !this.isCustom; // ✅ Custom product ho to price required nahi
    },
    default: 0,
  },
  category: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: "",
  },
  finish: {
    type: String,
    default: "",
  },
  images: {
    type: [String],
    default: [],
  },
  stock: {
    type: Number,
    default: 0,
  },
  isCustom: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
