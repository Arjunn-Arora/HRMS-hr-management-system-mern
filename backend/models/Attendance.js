import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  sessions: [
    {
      checkIn: { type: Date, required: true },
      checkOut: { type: Date }
    }
  ],
  totalHours: { type: Number, default: 0 } // Computed in hours (can be fractional)
});

export default mongoose.model("Attendance", attendanceSchema);
