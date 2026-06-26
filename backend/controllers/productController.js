const Product = require("../models/Product");
const logAction = require("../utils/auditLogger");

const getAllProducts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error occurred", error });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error occurred", error });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();

    await logAction({
      action: "PRODUCT_CREATED",
      category: "product",
      description: `New product added: "${product.name}" - Category: ${product.category} - Price: Rs. ${product.price}`,
      ipAddress: req.ip,
      metadata: {
        productId: product._id,
        name: product.name,
        price: product.price,
        category: product.category,
      },
    });

    res.status(201).json({ message: "Product created successfully!", product });
  } catch (error) {
    res.status(500).json({ message: "Error occurred", error });
  }
};

const updateProduct = async (req, res) => {
  try {
    const oldProduct = await Product.findById(req.params.id);
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
    });

    await logAction({
      action: "PRODUCT_UPDATED",
      category: "product",
      description: `Product updated: "${oldProduct?.name || req.params.id}" - Category: ${oldProduct?.category}`,
      ipAddress: req.ip,
      metadata: {
        productId: req.params.id,
        name: oldProduct?.name,
        changes: req.body,
      },
    });

    res.json({ message: "Product updated successfully!", product });
  } catch (error) {
    res.status(500).json({ message: "Error occurred", error });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    await Product.findByIdAndDelete(req.params.id);

    await logAction({
      action: "PRODUCT_DELETED",
      category: "product",
      description: `Product deleted: "${product?.name || req.params.id}" - Category: ${product?.category}`,
      ipAddress: req.ip,
      metadata: {
        productId: req.params.id,
        name: product?.name,
        category: product?.category,
      },
    });

    res.json({ message: "Product deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error occurred", error });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
