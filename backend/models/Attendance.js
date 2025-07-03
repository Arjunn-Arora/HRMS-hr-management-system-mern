import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  projectName: { type: String, required: true },
  markedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  markedByName: { type: String },
  isPresent: { type: Boolean, default: false },
  projectId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Project"
},
  markedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Attendance", attendanceSchema);
