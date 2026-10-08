const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true },
  price: { type: Number, required: true },
});

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
      return !this.isCustom && this.variants.length === 0;
      // ✅ Custom ya variants hon to price required nahi
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
  variants: {
    type: [variantSchema], // ✅ size + price variants
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
