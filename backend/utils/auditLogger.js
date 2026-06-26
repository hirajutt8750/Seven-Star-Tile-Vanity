const AuditLog = require("../models/AuditLog");

const logAction = async ({
  action,
  category = "other",
  description,
  performedBy = "admin",
  ipAddress = "",
  metadata = {},
}) => {
  try {
    await AuditLog.create({
      action,
      category,
      description,
      performedBy,
      ipAddress,
      metadata,
    });
    console.log(`📋 Audit Log: [${category.toUpperCase()}] ${description}`);
  } catch (err) {
    console.error("Audit log error:", err.message);
  }
};

module.exports = logAction;
