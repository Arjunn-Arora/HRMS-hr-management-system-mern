import Shift from "../models/Shift.js";
import User from "../models/User.js";

export const getShifts = async (req, res) => {
  try {
    const shifts = await Shift.find();
    res.json(shifts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch shifts", error: error.message });
  }
};

export const createShift = async (req, res) => {
  try {
    const { name, startTime, endTime } = req.body;
    const shift = new Shift({ name, startTime, endTime });
    await shift.save();
    res.status(201).json(shift);
  } catch (error) {
    res.status(500).json({ message: "Failed to create shift", error: error.message });
  }
};

export const deleteShift = async (req, res) => {
  try {
    await Shift.findByIdAndDelete(req.params.id);
    // Unassign shift from users
    await User.updateMany({ shiftId: req.params.id }, { shiftId: null });
    res.json({ message: "Shift deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete shift", error: error.message });
  }
};

export const assignShiftToUsers = async (req, res) => {
  try {
    const { shiftId, userIds } = req.body;
    await User.updateMany({ _id: { $in: userIds } }, { shiftId });
    res.json({ message: "Shift assigned successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to assign shift", error: error.message });
  }
};
