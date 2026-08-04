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
const { upload } = require("../utils/cloudinary");

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post(
  "/",
  protect,
  upload.array("images", 20),
  validateProduct,
  createProduct,
); // ✅ upload add kiya
router.put(
  "/:id",
  protect,
  upload.array("images", 20),
  validateProduct,
  updateProduct,
); // ✅ upload add kiya
router.delete("/:id", protect, deleteProduct);

module.exports = router;
