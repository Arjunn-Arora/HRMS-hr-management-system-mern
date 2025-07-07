// models/LeavePolicy.js
import mongoose from "mongoose";

const leavePolicySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // e.g., Paid, Unpaid, Sick
  totalDays: { type: Number, required: true },
  description: { type: String }
});

export default mongoose.model("LeavePolicy", leavePolicySchema);
