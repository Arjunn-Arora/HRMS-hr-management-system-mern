import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  startDate: { type: Date },
  endDate: { type: Date },
  status: { type: String, enum: ['Not Started', 'In Progress', 'Completed', 'Deferred'], default: 'Not Started' }
}, { timestamps: true });

export default mongoose.model('Goal', goalSchema);
