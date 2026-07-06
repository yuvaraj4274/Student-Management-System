// Creates a default admin account so you can log in immediately.
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = (process.env.ADMIN_EMAIL || "admin@school.com").toLowerCase();
    const existing = await User.findOne({ email });

    if (existing) {
      console.log(`An admin with email ${email} already exists. Nothing to do.`);
      return process.exit(0);
    }

    await User.create({
      name: process.env.ADMIN_NAME || "System Admin",
      email,
      password: process.env.ADMIN_PASSWORD || "Admin@12345",
      role: "admin",
    });

    console.log("Admin account created successfully:");
    console.log(`  Email:    ${email}`);
    console.log(`  Password: ${process.env.ADMIN_PASSWORD || "Admin@12345"}`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed admin account:", error.message);
    process.exit(1);
  }
};

seed();
