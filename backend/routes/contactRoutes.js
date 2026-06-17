const express = require("express");
const router = express.Router();
const {
  createContactMessage,
  getAllMessages,
  markAsRead,
  deleteMessage,
} = require("../controllers/contactController");

router.post("/", createContactMessage);
router.get("/", getAllMessages);
router.put("/:id/read", markAsRead);
router.delete("/:id", deleteMessage);

module.exports = router;
