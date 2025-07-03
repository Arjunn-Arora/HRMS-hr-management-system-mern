import Attendance from "../models/Attendance.js";
import User from "../models/User.js";

import mongoose from "mongoose";

export const submitAttendance = async (req, res) => {
  try {
    const { attendanceData } = req.body;

    const markedBy = req.user.userId;
    const markerUser = await User.findById(markedBy);

    const records = await Promise.all(attendanceData.map(async (entry) => {
      return await Attendance.create({
        employeeId: entry.employeeId,
        projectId: new mongoose.Types.ObjectId(entry.projectId), // ✅ fixed
        projectName: entry.projectName || "Not Assigned",
        isPresent: entry.isPresent,
        markedBy,
        markedByName: markerUser.name,
        markedAt: new Date()
      });
    }));

    res.status(201).json({ message: "Attendance submitted", records });
  } catch (error) {
    console.error("Attendance error:", error);
    res.status(500).json({ message: "Failed to submit attendance", error: error.message });
  }
};


export const getAttendanceForEmployee = async (req, res) => {
  try {
    const employeeId = req.user.userId;

    const records = await Attendance.find({ employeeId })
  .populate("projectId", "name") // ✅ populate project name from ID
  .sort({ markedAt: -1 });

    // Map response to always return a `projectName` field (fallback-safe)
    const formatted = records.map((r) => ({
      ...r.toObject(),
      projectName: r.projectId?.name || r.projectName
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching attendance",
      error: error.message
    });
  }
};

