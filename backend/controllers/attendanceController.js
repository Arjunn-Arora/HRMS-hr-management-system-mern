import Attendance from "../models/Attendance.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// Utility to get today's date in YYYY-MM-DD
const getTodayDateString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const checkIn = async (req, res) => {
  try {
    const employeeId = req.user.userId;
    const date = getTodayDateString();
    
    let record = await Attendance.findOne({ employeeId, date });
    
    if (!record) {
      record = new Attendance({ employeeId, date, sessions: [] });
    }

    // Check if there is an active session
    const hasActiveSession = record.sessions.some(s => !s.checkOut);
    if (hasActiveSession) {
      return res.status(400).json({ message: "Already checked in" });
    }

    record.sessions.push({ checkIn: new Date() });
    await record.save();

    res.status(200).json({ message: "Checked in successfully", record });
  } catch (error) {
    res.status(500).json({ message: "Check-in failed", error: error.message });
  }
};

export const checkOut = async (req, res) => {
  try {
    const employeeId = req.user.userId;
    const date = getTodayDateString();
    
    let record = await Attendance.findOne({ employeeId, date });
    
    if (!record) {
      return res.status(400).json({ message: "No active check-in found for today" });
    }

    // Find the active session
    const activeSession = record.sessions.find(s => !s.checkOut);
    if (!activeSession) {
      return res.status(400).json({ message: "You are not currently checked in" });
    }

    activeSession.checkOut = new Date();

    // Recalculate total hours for today
    let totalMs = 0;
    record.sessions.forEach(s => {
      if (s.checkIn && s.checkOut) {
        totalMs += (new Date(s.checkOut) - new Date(s.checkIn));
      }
    });
    record.totalHours = totalMs / (1000 * 60 * 60);

    await record.save();

    res.status(200).json({ message: "Checked out successfully", record });
  } catch (error) {
    res.status(500).json({ message: "Check-out failed", error: error.message });
  }
};

export const getStatus = async (req, res) => {
  try {
    const employeeId = req.user.userId;
    const date = getTodayDateString();
    
    const record = await Attendance.findOne({ employeeId, date });
    
    if (!record) {
      return res.status(200).json({ isCheckedIn: false, activeCheckInTime: null, todayTotalHours: 0 });
    }

    const activeSession = record.sessions.find(s => !s.checkOut);
    
    res.status(200).json({
      isCheckedIn: !!activeSession,
      activeCheckInTime: activeSession ? activeSession.checkIn : null,
      todayTotalHours: record.totalHours
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get status", error: error.message });
  }
};

export const getAttendanceForEmployee = async (req, res) => {
  try {
    const employeeId = req.user.userId;

    const records = await Attendance.find({ employeeId }).sort({ date: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance", error: error.message });
  }
};
