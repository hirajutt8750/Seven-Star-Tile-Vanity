const Review = require("../models/Review");
const Product = require("../models/Product");
const logAction = require("../utils/auditLogger");
const nodemailer = require("nodemailer");

const sendAdminEmail = async ({ subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Seven Star Tile Vanity" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject,
    html,
  });
};

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

    // Get product name if product id exists
    let productName = "General Review";
    if (product) {
      const prod = await Product.findById(product).select("name");
      if (prod) productName = prod.name;
    }

    // Admin email notification
    sendAdminEmail({
      subject: `⭐ New Review Received — ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#0A0F1E;color:#E6F1FF;border-radius:16px;overflow:hidden;border:1px solid rgba(0,229,255,0.2);">
          <div style="background:linear-gradient(135deg,#0D1B2E,#0A2540);padding:28px 32px;border-bottom:1px solid rgba(0,229,255,0.15);">
            <h1 style="margin:0;font-size:22px;color:#fff;">⭐ New Review Received</h1>
            <p style="margin:6px 0 0;color:#00E5FF;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Seven Star Tile Vanity</p>
          </div>
          <div style="padding:28px 32px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:10px 0;color:#8AA0BF;font-size:13px;width:140px;">Customer</td><td style="padding:10px 0;color:#fff;font-weight:600;font-size:14px;">${name}</td></tr>
              <tr><td style="padding:10px 0;color:#8AA0BF;font-size:13px;">Email</td><td style="padding:10px 0;color:#fff;font-size:14px;">${email}</td></tr>
              <tr><td style="padding:10px 0;color:#8AA0BF;font-size:13px;">Product</td><td style="padding:10px 0;color:#fff;font-size:14px;">${productName}</td></tr>
              <tr><td style="padding:10px 0;color:#8AA0BF;font-size:13px;">Rating</td><td style="padding:10px 0;color:#FFD700;font-size:16px;font-weight:700;">${"⭐".repeat(rating)} (${rating}/5)</td></tr>
            </table>
            <div style="margin-top:20px;background:rgba(0,229,255,0.05);border:1px solid rgba(0,229,255,0.15);border-radius:10px;padding:16px;">
              <p style="margin:0 0 6px;color:#8AA0BF;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Review</p>
              <p style="margin:0;color:#E6F1FF;font-size:14px;line-height:1.7;">${comment}</p>
            </div>
            <div style="margin-top:16px;background:rgba(255,193,7,0.08);border:1px solid rgba(255,193,7,0.2);border-radius:10px;padding:12px 16px;">
              <p style="margin:0;color:#FFC107;font-size:13px;">⏳ This review is pending approval. Please review and approve or reject it.</p>
            </div>
            <a href="${process.env.FRONTEND_URL}/admin/reviews" style="display:inline-block;margin-top:20px;background:linear-gradient(135deg,#007acc,#00b8ff);color:#fff;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;">View Review →</a>
          </div>
          <div style="padding:16px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;font-size:11px;color:#3A5A7A;">
            © ${new Date().getFullYear()} Seven Star Tile Vanity — Admin Notification
          </div>
        </div>
      `,
    }).catch((err) => console.error("Review email error:", err));

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
