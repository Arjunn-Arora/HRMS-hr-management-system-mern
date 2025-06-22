import mongoose from "mongoose";
import bcrypt from "bcrypt";
import 'dotenv/config'; // if you're using .env for DB_URI
import User from "./models/User.js"; // adjust the path based on your project structure

const insertTeamLead = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/hrms`);
    console.log("✅ Connected to MongoDB");

    const existing = await User.findOne({ email: "rohit.teamlead@example.com" });
    if (existing) {
      console.log("⚠️ Team Lead already exists:", existing.email);
      return;
    }

    const hashedPassword = await bcrypt.hash("TeamLead@123", 10);

    const teamLead = new User({
      name: "Rohit Sharma",
      email: "rohit.teamlead@example.com",
      password: hashedPassword,
      role: "team_lead", 
      department: "Engineering",
      isVerified: true
    });

    const result = await teamLead.save();
    console.log("✅ Team Lead inserted:", result);
  } catch (err) {
    console.error("❌ Error inserting team lead:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB connection closed.");
  }
};

insertTeamLead();
