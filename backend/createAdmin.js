require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    // Delete old admin
    await User.deleteMany({});
    console.log("Old admin deleted!");

    // Create new admin
    const user = new User({
      email: "saadbinsaeed674@gmail.com",
      password: "$tarv@nitY_05",
    });

    await user.save();
    console.log("New admin created successfully!");
    console.log("Email:", user.email);
    console.log("Role:", user.role);
  } catch (error) {
    console.log("Error:", error.message);
  } finally {
    mongoose.disconnect();
    console.log("Database disconnected.");
  }
});
