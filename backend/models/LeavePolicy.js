// models/LeavePolicy.js
import mongoose from "mongoose";

const leavePolicySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // e.g., Paid, Unpaid, Sick
  totalDays: { type: Number, required: true },
  description: { type: String },
  settings: {
    includePublicHolidays: { type: Boolean, default: false },
    sandwichPolicy: { type: Boolean, default: false },
    documentRequired: { type: Boolean, default: false },
    priorNoticeDays: { type: Number, default: 0 }
  }
}, { timestamps: true });

export default mongoose.model("LeavePolicy", leavePolicySchema);
