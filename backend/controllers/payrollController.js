import SalaryStructure from "../models/SalaryStructure.js";
import PayrollRecord from "../models/PayrollRecord.js";

export const createSalaryStructure = async (req, res) => {
  try {
    const { employee, basic, hra, allowances, deductions } = req.body;
    const structure = await SalaryStructure.findOneAndUpdate(
      { employee },
      { basic, hra, allowances, deductions },
      { upsert: true, new: true }
    );
    res.status(200).json(structure);
  } catch (err) {
    res.status(500).json({ message: "Failed to save structure", error: err.message });
  }
};

export const getAllStructures = async (req, res) => {
  const structures = await SalaryStructure.find().populate('employee', 'name email');
  res.json(structures);
};

export const generatePayslip = async (req, res) => {
  try {
    const { employee, month, year } = req.body;
    const structure = await SalaryStructure.findOne({ employee });
    if (!structure) return res.status(404).json({ message: "No salary structure found" });

    const { basic, hra, allowances, deductions } = structure;
    const gross = basic + hra + allowances;
    const netPay = gross - deductions;

    const payslip = await PayrollRecord.create({
      employee,
      month,
      year,
      salaryDetails: { basic, hra, allowances, deductions, gross, netPay }
    });

    res.status(201).json(payslip);
  } catch (err) {
    res.status(500).json({ message: "Payslip generation failed", error: err.message });
  }
};

export const getPayslips = async (req, res) => {
  const query = req.user.role === 'employee'
    ? { employee: req.user.userId }
    : {};
  const slips = await PayrollRecord.find(query).populate('employee', 'name email').sort({ generatedAt: -1 });
  res.json(slips);
};

export const getPayrollSummary = async (req, res) => {
  try {
    const payrolls = await PayrollRecord.find();

    const totalPaid = payrolls.reduce((sum, p) => sum + (p.netSalary || 0), 0);
    const employeeCount = new Set(payrolls.map(p => p.employeeId.toString())).size;

    const thisMonth = new Date().toISOString().slice(0, 7); // 'YYYY-MM'
    const monthlyTotal = payrolls
      .filter(p => p.month === thisMonth)
      .reduce((sum, p) => sum + (p.netSalary || 0), 0);

    const lastPayrollDate = payrolls.length > 0
      ? new Date(Math.max(...payrolls.map(p => new Date(p.createdAt)))).toISOString()
      : null;

    res.json({ totalPaid, employeeCount, monthlyTotal, lastPayrollDate });
  } catch (err) {
    res.status(500).json({ message: "Error fetching payroll summary", error: err.message });
  }
};


export const filterPayslips = async (req, res) => {
  const { month, year, employee } = req.query;
  const filter = {};
  if (month) filter.month = month;
  if (year) filter.year = parseInt(year);
  if (employee) filter.employee = employee;
  const results = await PayrollRecord.find(filter).populate('employee', 'name email');
  res.json(results);
};