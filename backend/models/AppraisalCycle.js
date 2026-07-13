import mongoose from "mongoose";

const appraisalCycleSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "Annual Review 2026"
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['Active', 'Completed', 'Draft'], default: 'Draft' },
  includedEmployees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

export default mongoose.model('AppraisalCycle', appraisalCycleSchema);
