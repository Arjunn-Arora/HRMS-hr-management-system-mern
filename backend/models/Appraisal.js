import mongoose from "mongoose";

const appraisalSchema = new mongoose.Schema({
  cycleId: { type: mongoose.Schema.Types.ObjectId, ref: 'AppraisalCycle', required: true },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Self', 'Peer', 'Manager'], required: true },
  ratings: [{
    criteria: { type: String }, // e.g. "Communication", "Technical Skills"
    score: { type: Number, min: 1, max: 5 },
    comment: { type: String }
  }],
  overallScore: { type: Number, min: 1, max: 5 },
  overallFeedback: { type: String },
  status: { type: String, enum: ['Pending', 'Draft', 'Submitted', 'Reviewed'], default: 'Pending' }
}, { timestamps: true });

export default mongoose.model('Appraisal', appraisalSchema);
