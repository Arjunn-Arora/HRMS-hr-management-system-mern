import mongoose from 'mongoose';
const structureSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  baseSalary: Number,
  hra: Number,
  allowances: Number,
  deductions: Number
}, { timestamps: true });
export default mongoose.model('SalaryStructure', structureSchema);
