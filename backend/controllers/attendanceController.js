import Attendance from "../models/Attendance.js";
import User from "../models/User.js";

export const submitAttendance = async (req, res) => {
  try {
    const { attendanceData } = req.body; // Array of { employeeId, projectName, isPresent }

    const markedBy = req.user.userId;
    const markerUser = await User.findById(markedBy);

    const records = await Promise.all(attendanceData.map(async (entry) => {
      return await Attendance.create({
        ...entry,
        markedBy,
        markedByName: markerUser.name,
        markedAt: new Date()
      });
    }));

    res.status(201).json({ message: "Attendance submitted", records });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit attendance", error: error.message });
  }
};

export const getAttendanceForEmployee = async (req, res) => {
  try {
    const employeeId = req.user.userId;
    const records = await Attendance.find({ employeeId }).sort({ markedAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance", error: error.message });
  }
};
