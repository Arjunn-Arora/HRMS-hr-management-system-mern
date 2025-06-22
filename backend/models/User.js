import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'hr', 'employee', 'team_lead'], default: 'employee' },
  department: { type: String, default: 'General' },
  profilePic: String,  // URL for profile picture
  resume: String,      // URL or path for resume upload
  isVerified: { type: Boolean, default: false },
  dob: String,
address: String,
phone: String,
  teamLeadId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null,
},
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
