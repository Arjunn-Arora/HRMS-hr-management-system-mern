import mongoose from "mongoose";

const shiftSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startTime: { type: String, required: true }, // Format: "09:00 AM" or "09:00"
  endTime: { type: String, required: true },   // Format: "06:00 PM" or "18:00"
}, { timestamps: true });

export default mongoose.model("Shift", shiftSchema);
