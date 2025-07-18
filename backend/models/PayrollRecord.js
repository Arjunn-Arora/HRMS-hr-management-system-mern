import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: String, // e.g. "July 2025"
  year: Number,
  baseSalary: Number,
  hra: Number,
  allowances: Number,
  deductions: Number,
  gross: Number,
  netPay: Number,
  generatedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['Generated', 'Paid'], default: 'Generated' }
}, { timestamps: true });
export default mongoose.model('PayrollRecord', payrollSchema);
