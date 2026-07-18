import User from "../models/User.js";
import Project from "../models/Project.js";
import jwt from "jsonwebtoken";
import sendMail from "../utils/sendMail.js";

export const createEmployee = async (req, res) => {
  try {
    const { 
      name, email, role, teamLeadId, department, 
      designation, employmentType, employeeStatus, dateOfJoining, 
      dob, gender, maritalStatus, pan, aadhar, presentAddress, 
      permanentAddress, dateOfExit 
    } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Employee already exists" });
    const newUser = await User.create({
      name,
      email,
      role: role || 'employee',
      department,
      teamLeadId: teamLeadId || null,
      designation,
      employmentType,
      employeeStatus,
      dateOfJoining,
      dob,
      gender,
      maritalStatus,
      pan,
      aadhar,
      presentAddress,
      permanentAddress,
      dateOfExit
    });
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const link = `https://hrms-hr-management-system-mern.vercel.app/verify/${token}`;
    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
          <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 30px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: 0.5px;">Welcome to HRMS</h1>
          </div>
          <div style="padding: 40px 30px;">
            <h2 style="color: #1f2937; margin-top: 0; font-size: 22px;">Hello ${name},</h2>
            <p style="color: #4b5563; line-height: 1.8; font-size: 16px; margin-bottom: 25px;">
              We are absolutely thrilled to welcome you to the team! Your employee account has been successfully created.
              To gain access to your dashboard and complete your onboarding process, please click the button below to verify your email and set up your secure password.
            </p>
            <div style="text-align: center; margin: 35px 0;">
              <a href="${link}" style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(79, 70, 229, 0.25);">Verify & Set Password</a>
            </div>
            <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 30px;">
              If you experience any issues or have questions, please reach out to your HR department.
            </p>
          </div>
          <div style="background-color: #f9fafb; padding: 20px; text-align: center; color: #9ca3af; font-size: 13px; border-top: 1px solid #f3f4f6;">
            &copy; ${new Date().getFullYear()} HRMS Inc. All rights reserved.
          </div>
        </div>
      </div>
    `;
    await sendMail(email, 'Verify Your HRMS Account', html);
    res.status(201).json({ message: 'Employee created and email sent' });
  } catch (error) {
    // res.status(500).json({ message: "Server error", error: error.message });
    console.error(error);
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
    const { 
      name, email, department, designation, employmentType, employeeStatus, 
      dateOfJoining, dob, gender, maritalStatus, pan, aadhar, 
      presentAddress, permanentAddress, dateOfExit 
    } = req.body;
    
    const employee = await User.findById(req.params.id);
    if (!employee || employee.role !== 'employee') {
      return res.status(404).json({ message: "Employee not found" });
    }

    employee.name = name || employee.name;
    employee.email = email || employee.email;
    employee.department = department || employee.department;
    if (designation !== undefined) employee.designation = designation;
    if (employmentType !== undefined) employee.employmentType = employmentType;
    if (employeeStatus !== undefined) employee.employeeStatus = employeeStatus;
    if (dateOfJoining !== undefined) employee.dateOfJoining = dateOfJoining;
    if (dob !== undefined) employee.dob = dob;
    if (gender !== undefined) employee.gender = gender;
    if (maritalStatus !== undefined) employee.maritalStatus = maritalStatus;
    if (pan !== undefined) employee.pan = pan;
    if (aadhar !== undefined) employee.aadhar = aadhar;
    if (presentAddress !== undefined) employee.presentAddress = presentAddress;
    if (permanentAddress !== undefined) employee.permanentAddress = permanentAddress;
    if (dateOfExit !== undefined) employee.dateOfExit = dateOfExit;

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
  employees: [] // empty initially
});


await User.updateMany(
  { _id: { $in: employeeIds } },
  {
    projectName: project.name,
    projectId: project._id
  }
);

    res.status(201).json({ message: "Project assigned successfully", project });
  } catch (error) {
    console.error("Error in assigning project:", error);
    res.status(500).json({ message: "Failed to assign project", error: error.message });
  }
};

export const getPendingOnboardingUsers = async (req, res) => {
  try {
    const users = await User.find({ onboardingStatus: 'Pending HR Action' }).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getOnboardingCount = async (req, res) => {
  try {
    const count = await User.countDocuments({ onboardingStatus: 'Pending HR Action' });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const triggerOnboarding = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.onboardingStatus = 'Onboarding Triggered';
    await user.save();
    res.json({ message: "Onboarding triggered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
