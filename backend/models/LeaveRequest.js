import mongoose from "mongoose";

const leaveRequestSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  leavePolicy: { type: mongoose.Schema.Types.ObjectId, ref: "LeavePolicy", required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalDays: { type: Number, required: true },
  breakdown: [
    {
      date: { type: String, required: true },
      type: { type: String, enum: ["Full Day", "First Half", "Second Half"], required: true }
    }
  ],
  reason: String,
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" }
}, { timestamps: true });

export default mongoose.model("LeaveRequest", leaveRequestSchema);
