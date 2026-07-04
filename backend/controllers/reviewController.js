const Review = require("../models/Review");
const Product = require("../models/Product");
const logAction = require("../utils/auditLogger");

// Public: customer submits a review (status = pending until admin approves)
const createReview = async (req, res) => {
  try {
    const { product, name, email, rating, comment } = req.body;

    if (!name || !email || !rating || !comment) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const review = new Review({
      product: product || null,
      name,
      email,
      rating,
      comment,
    });

    await review.save();

    res.status(201).json({
      message: "Review submitted! It will appear after approval.",
      review,
    });
  } catch (error) {
    res.status(500).json({ message: "Error occurred", error });
  }
};

// Public: approved reviews for a single product page
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
      status: "approved",
    }).sort({ createdAt: -1 });

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    res.json({
      count: reviews.length,
      averageRating: Math.round(avgRating * 10) / 10,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ message: "Error occurred", error });
  }
};

// Public: featured reviews for Home page testimonials
const getFeaturedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: "approved", isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error occurred", error });
  }
};

// Admin: get all reviews, optional ?status=pending filter
const getAllReviews = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    const reviews = await Review.find(filter)
      .populate("product", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error occurred", error });
  }
};

// Admin: approve / reject / feature a review
const updateReviewStatus = async (req, res) => {
  try {
    const { status, isFeatured } = req.body;

    const update = {};
    if (status) update.status = status;
    if (typeof isFeatured === "boolean") update.isFeatured = isFeatured;

    const review = await Review.findByIdAndUpdate(req.params.id, update, {
      returnDocument: "after",
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await logAction({
      action: "REVIEW_STATUS_UPDATED",
      category: "review",
      description: `Review by "${review.name}" set to "${review.status}"${
        typeof isFeatured === "boolean"
          ? ` - Featured: ${review.isFeatured}`
          : ""
      }`,
      ipAddress: req.ip,
      metadata: {
        reviewId: review._id,
        name: review.name,
        status: review.status,
        isFeatured: review.isFeatured,
      },
    });

    res.json({ message: "Review updated successfully!", review });
  } catch (error) {
    res.status(500).json({ message: "Error occurred", error });
  }
};

// Admin: delete a review
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    await Review.findByIdAndDelete(req.params.id);

    await logAction({
      action: "REVIEW_DELETED",
      category: "review",
      description: `Review deleted: by "${review?.name || req.params.id}"`,
      ipAddress: req.ip,
      metadata: {
        reviewId: req.params.id,
        name: review?.name,
      },
    });

    res.json({ message: "Review deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error occurred", error });
  }
};

module.exports = {
  createReview,
  getProductReviews,
  getFeaturedReviews,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
};
