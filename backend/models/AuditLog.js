const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["product", "order", "category", "auth", "other"],
    default: "other",
  },
  description: {
    type: String,
    required: true,
  },
  performedBy: {
    type: String,
    default: "admin",
  },
  ipAddress: {
    type: String,
    default: "",
  },
  metadata: {
    type: Object,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("AuditLog", auditLogSchema);
