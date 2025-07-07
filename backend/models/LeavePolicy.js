import mongoose from "mongoose";

const leavePolicySchema = new mongoose.Schema({
  name: { type: String, required: true },
  maxDaysPerYear: { type: Number, required: true },
  description: String
}, { timestamps: true });

export default mongoose.model("LeavePolicy", leavePolicySchema);
