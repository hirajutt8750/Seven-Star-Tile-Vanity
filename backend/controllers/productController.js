const Product = require("../models/Product");

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error aaya", error });
  }
};

// Get single product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product nahi mila!" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error aaya", error });
  }
};

// Create product
const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ message: "Product ban gaya!", product });
  } catch (error) {
    res.status(500).json({ message: "Error aaya", error });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after", // ✅ updated
    });
    res.json({ message: "Product update ho gaya!", product });
  } catch (error) {
    res.status(500).json({ message: "Error aaya", error });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product delete ho gaya!" });
  } catch (error) {
    res.status(500).json({ message: "Error aaya", error });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
