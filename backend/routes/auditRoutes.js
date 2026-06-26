const express = require("express");
const router = express.Router();
const AuditLog = require("../models/AuditLog");
const { protect } = require("../middleware/auth");

// Get all logs (protected - admin only)
router.get("/", protect, async (req, res) => {
  try {
    const { category, limit = 100 } = req.query;
    const filter = category && category !== "all" ? { category } : {};
    const logs = await AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete old logs (optional cleanup)
router.delete("/clear", protect, async (req, res) => {
  try {
    await AuditLog.deleteMany({});
    res.json({ message: "All logs cleared." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
