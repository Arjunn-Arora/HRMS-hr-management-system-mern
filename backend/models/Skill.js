import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skills: [{
    name: { type: String, required: true },
    proficiencyLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Expert'], default: 'Beginner' },
    yearsExperience: { type: Number, default: 0 }
  }]
}, { timestamps: true });

export default mongoose.model('Skill', skillSchema);
