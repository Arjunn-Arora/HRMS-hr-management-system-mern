import mongoose from "mongoose";

const kraSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  weightage: { type: Number, min: 0, max: 100, default: 0 },
  achievedScore: { type: Number, min: 0, max: 100, default: 0 }, // For the employee to fill in
  period: { type: String }, // e.g. "Q1-2026"
  status: { type: String, enum: ['Active', 'Completed'], default: 'Active' }
}, { timestamps: true });

export default mongoose.model('KRA', kraSchema);
