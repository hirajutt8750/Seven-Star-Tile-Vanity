const express = require("express");
const router = express.Router();
const {
  createReview,
  getProductReviews,
  getFeaturedReviews,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/auth");

// Public
router.post("/", createReview);
router.get("/featured", getFeaturedReviews);
router.get("/product/:productId", getProductReviews);

// Admin only
router.get("/admin/all", protect, getAllReviews);
router.put("/admin/:id", protect, updateReviewStatus);
router.delete("/admin/:id", protect, deleteReview);

module.exports = router;
