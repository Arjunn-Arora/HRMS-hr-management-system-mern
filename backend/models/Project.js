import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  startDate: {
    type: Date,
    default: Date.now
  },
  deadline: {
    type: Date
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // should be a team lead
    required: true
  },
  employees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' // team members
    }
  ]
}, {
  timestamps: true
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
