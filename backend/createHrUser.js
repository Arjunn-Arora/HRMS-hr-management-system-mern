import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true, trim: true },
  password: String,
  role: { type: String, enum: ['admin', 'hr', 'employee'], default: 'employee' },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

const MONGODB_URI = process.env.MONGODB_URI;

const createHrUser = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/hrms`);

    const existing = await User.findOne({ email: "hr@example.com" });
    if (existing) {
      console.log("HR user already exists.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Arjun!123", 10);

    const hrUser = new User({
      name: "Rahul Sharma",
      email: "hr@example.com",
      password: hashedPassword,
      role: "hr",
      isVerified: true
    });

    await hrUser.save();
    console.log("HR user created successfully!");
    process.exit(0);

  } catch (error) {
    console.error("Error creating HR user:", error);
    process.exit(1);
  }
};

createHrUser();
