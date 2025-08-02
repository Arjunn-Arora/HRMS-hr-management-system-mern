import SalaryStructure from "../models/SalaryStructure.js";
import PayrollRecord from "../models/PayrollRecord.js";
import User from "../models/User.js";

export const createSalaryStructure = async (req, res) => {
  try {
    const { employee, basic, hra, allowances, deductions } = req.body;

    console.log("Payload Received:", req.body);

    const structure = await SalaryStructure.findOneAndUpdate(
      { employeeId: employee },
      {
        employeeId: employee,
        baseSalary: basic,
        hra,
        allowances,
        deductions
      },
      { upsert: true, new: true }
    );

    res.status(200).json(structure);
  } catch (err) {
    console.error("createSalaryStructure Error:", err);
    res.status(500).json({ message: "Failed to save structure", error: err.message });
  }
};

export const getAllStructures = async (req, res) => {
  try {
    const structures = await SalaryStructure.find().populate('employeeId', 'name email');
    res.json(structures);
  } catch (err) {
    res.status(500).json({ message: "Failed to load salary structures", error: err.message });
  }
};

export const generatePayslip = async (req, res) => {
  try {
    const { employee, month, year } = req.body;

    // Check agar payroll already exist karta hai
    const existing = await PayrollRecord.findOne({
      employeeId: employee,
      month,
      year,
    });

    if (existing) {
      return res.status(400).json({
        message: "Payroll already generated for this employee in the selected month.",
      });
    }

    const structure = await SalaryStructure.findOne({ employeeId: employee });
    if (!structure) {
      return res.status(404).json({ message: "No salary structure found" });
    }

    const { baseSalary, hra, allowances, deductions } = structure;
    const gross = baseSalary + hra + allowances;
    const netPay = gross - deductions;

    const payslip = await PayrollRecord.create({
      employeeId: employee,
      month,
      year,
      salaryDetails: {
        basic: baseSalary,
        hra,
        allowances,
        deductions,
        gross,
        netPay,
      },
      status: "Generated",
    });

    res.status(201).json(payslip);
  } catch (err) {
    res.status(500).json({ message: "Payslip generation failed", error: err.message });
  }
};

export const getEligibleEmployees = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required" });
    }

    // Sab employees lao
    const allEmployees = await User.find(
      { role: "employee" },
      "_id name email department"
    );

    // Jo employees ka payroll already generate ho chuka hai unko hatao
    const generatedPayrolls = await PayrollRecord.find({ month, year }).select("employeeId");
    const generatedIds = generatedPayrolls.map((p) => p.employeeId.toString());

    // Filter karo jo eligible hain
    const eligible = allEmployees.filter(
      (emp) => !generatedIds.includes(emp._id.toString())
    );

    res.status(200).json(eligible);
  } catch (err) {
    console.error("getEligibleEmployees Error:", err);
    res.status(500).json({
      message: "Failed to fetch eligible employees",
      error: err.message,
    });
  }
};

export const getPayslips = async (req, res) => {
  try {
    const query = req.user.role === 'employee'
      ? { employeeId: req.user.userId }
      : {};

    const slips = await PayrollRecord.find(query)
      .populate('employeeId', 'name email') // 🔧 fix here
      .sort({ generatedAt: -1 });

    res.json(slips);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch payroll history", error: err.message });
  }
};


export const getPayrollSummary = async (req, res) => {
  try {
    const { month, year } = req.query; // Get month and year from query params
    const payrolls = await PayrollRecord.find();

    // Convert month string to lowercase for case-insensitive match
    const filtered = payrolls.filter(p =>
      (!month || p.month?.toLowerCase() === month.toLowerCase()) &&
      (!year || p.year == year) &&
      p.status === "Paid"
    );

    const totalPaid = filtered.reduce((sum, p) => sum + (p.netPay || 0), 0);
    const monthlyDeductions = filtered.reduce((sum, p) => sum + (p.deductions || 0), 0);
    const employeeCount = new Set(filtered.map(p => p.employeeId.toString())).size;

    const lastPayrollDate = filtered.length > 0
      ? new Date(Math.max(...filtered.map(p => new Date(p.createdAt)))).toISOString()
      : null;

    res.json({ totalPaid, employeeCount, monthlyDeductions, lastPayrollDate });
  } catch (err) {
    res.status(500).json({ message: "Error fetching payroll summary", error: err.message });
  }
};


export const getPayrollHistory = async (req, res) => {
  try {
    const records = await PayrollRecord.find().populate("employeeId", "name email department");

    const data = records.map((r) => ({
      _id: r._id,
      employeeName: r.employeeId?.name,
      employeeId: r.employeeId?._id,
      email: r.employeeId?.email,
      department: r.employeeId?.department || "N/A",
      month: r.month,
      year: r.year,
      status: r.status,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      salaryDetails: {
        basic: r.baseSalary,
        hra: r.hra,
        allowances: r.allowances,
        deductions: r.deductions,
        gross: r.gross,
        netPay: r.netPay,
      },
    }));

    res.status(200).json(data);
  } catch (err) {
    console.error("getPayrollHistory Error:", err);
    res.status(500).json({ message: "Failed to fetch payroll history" });
  }
};


export const markAsPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await PayrollRecord.findByIdAndUpdate(
      id,
      { status: "Paid" },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    console.error("markAsPaid Error:", err);
    res.status(500).json({ message: "Failed to update status" });
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