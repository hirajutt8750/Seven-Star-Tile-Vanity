require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const existing = await User.findOne({ email: "admin@factory.com" });
  if (existing) {
    console.log("Admin pehle se exist karta hai!");
  } else {
    const user = new User({
      email: "admin@factory.com",
      password: "admin321",
    });
    await user.save();
    console.log("Admin ban gaya!");
  }
  mongoose.disconnect();
});
