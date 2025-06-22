import User from "../models/User.js";

export const getMyTeamMembers = async (req, res) => {
  try {
    const teamLeadId = req.user.userId;
    const members = await User.find({ teamLeadId, role: "employee" }).select("name department email");
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
