const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect } = require("../middleware/auth");
const { validateProduct } = require("../middleware/validate");

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", protect, validateProduct, createProduct);
router.put("/:id", protect, validateProduct, updateProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;
