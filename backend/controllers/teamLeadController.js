import User from "../models/User.js";
import Project from "../models/Project.js";

export const getMyTeamMembers = async (req, res) => {
  try {
    const teamLeadId = req.user.userId;
    const members = await User.find({ teamLeadId, role: "employee" }).select("name department email");
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const assignEmployeesToProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { employeeIds } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.employees = [...new Set([...project.employees, ...employeeIds])];
    await project.save();

    // Optional: update users' project reference (if you store assigned project inside User model)
    await User.updateMany(
      { _id: { $in: employeeIds } },
      { $addToSet: { projectName: project.name } } // Assuming you store projectName
    );

    res.status(200).json({ message: "Employees assigned successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to assign employees", error: err.message });
  }
};

export const getAllocatedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ assignedTo: req.user.userId }).populate('employees', 'name');
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: "Error fetching projects", error: err.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId).populate('employees', '_id');
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const assignedEmployeeIds = project.employees.map(emp => emp._id.toString());
    res.status(200).json({ assignedEmployeeIds });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch project data', error: error.message });
  }
};

export const getProjectAssignedEmployees = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId).populate("employees", "_id");
    if (!project) return res.status(404).json({ message: "Project not found" });

    const assignedEmployeeIds = project.employees.map((emp) => emp._id.toString());
    res.json({ assignedEmployeeIds });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch project data", error: err.message });
  }
};
