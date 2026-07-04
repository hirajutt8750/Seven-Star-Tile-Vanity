const express = require("express");
const router = express.Router();
const { upload } = require("../utils/cloudinary");

// Single image upload
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Image nahi mili!" });
  }
  res.json({
    message: "Image upload ho gayi!",
    imageUrl: req.file.path,
  });
});

module.exports = router;
