import User from "../models/User.js";
import Project from "../models/Project.js";
import jwt from "jsonwebtoken";
import sendMail from "../utils/sendMail.js";

export const createEmployee = async (req, res) => {
  try {
    const { name, email, teamLeadId, department } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Employee already exists" });
    const newUser = await User.create({
  name,
  email,
  role: 'employee',
  department,
  teamLeadId: teamLeadId || null
});
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const link = `http://localhost:5173/verify/${token}`;
    const html = `<h3>Welcome ${name}!</h3><p>Your account has been created. Click below to verify and set password:</p><a href="${link}">${link}</a>`;
    await sendMail(email, 'Verify Your HRMS Account', html);
    res.status(201).json({ message: 'Employee created and email sent' });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' }).select("-password");
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single employee by ID
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id).select("-password");
    if (!employee || employee.role !== 'employee') {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update employee details
export const updateEmployee = async (req, res) => {
  try {
    const { name, email, department } = req.body;
    const employee = await User.findById(req.params.id);
    if (!employee || employee.role !== 'employee') {
      return res.status(404).json({ message: "Employee not found" });
    }

    employee.name = name || employee.name;
    employee.email = email || employee.email;
    employee.department = department || employee.department;

    if (req.files) {
      if (req.files.profilePic) {
        employee.profilePic = req.files.profilePic[0].path;
      }
      if (req.files.resume) {
        employee.resume = req.files.resume[0].path;
      }
    }

    await employee.save();
    res.json({ message: "Employee updated successfully", employee });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Delete employee
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id);
    if (!employee || employee.role !== 'employee') {
      return res.status(404).json({ message: "Employee not found" });
    }
    await employee.remove();
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllTeamLeads = async (req, res) => {
  try {
    const teamLeads = await User.find({ role: "team_lead" }).select("_id name department");
    res.json(teamLeads);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch team leads", error: error.message });
  }
};

export const assignProjectToTeamLead = async (req, res) => {
  try {
    const { teamLeadId, projectName, startDate, deadline } = req.body;

    if (!teamLeadId || !projectName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate team lead exists
    const lead = await User.findById(teamLeadId);
    if (!lead || lead.role !== "team_lead") {
      return res.status(404).json({ message: "Team lead not found" });
    }

    // Find all employees under this team lead
    const teamMembers = await User.find({ teamLeadId });
    const employeeIds = teamMembers.map(emp => emp._id);

    // Create the project
    const project = await Project.create({
      name: projectName,
      startDate,
      deadline,
      assignedTo: teamLeadId,
      employees: employeeIds
    });

    res.status(201).json({ message: "Project assigned successfully", project });
  } catch (error) {
    console.error("Error in assigning project:", error);
    res.status(500).json({ message: "Failed to assign project", error: error.message });
  }
};

