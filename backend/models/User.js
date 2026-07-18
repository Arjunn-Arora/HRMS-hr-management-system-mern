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
  dob: Date,
  designation: String,
  employmentType: { type: String, enum: ['Full-Time', 'Part-Time', 'Contract', 'Internship'], default: 'Full-Time' },
  employeeStatus: { type: String, enum: ['Active', 'Inactive', 'Terminated', 'Resigned', 'Deceased'], default: 'Active' },
  dateOfJoining: Date,
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  maritalStatus: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed'] },
  pan: String,
  aadhar: String,
  presentAddress: String,
  permanentAddress: String,
  dateOfExit: Date,
  onboardingStatus: { 
    type: String, 
    enum: ['Not Started', 'Pending HR Action', 'Onboarding Triggered', 'Completed'], 
    default: 'Not Started' 
  },
  phone: String,
  teamLeadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  shiftId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Shift",
  default: null,
},
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
