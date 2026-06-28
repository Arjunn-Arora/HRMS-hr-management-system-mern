import WFHRequest from "../models/WFHRequest.js";

export const applyWFH = async (req, res) => {
  try {
    const { date, reason } = req.body;
    const employeeId = req.user.userId;

    // Check if already applied for this date
    const existing = await WFHRequest.findOne({ employeeId, date });
    if (existing) {
      return res.status(400).json({ message: "WFH request already exists for this date." });
    }

    const wfh = new WFHRequest({ employeeId, date, reason });
    await wfh.save();

    res.status(201).json({ message: "WFH request submitted successfully", wfh });
  } catch (err) {
    res.status(500).json({ message: "Failed to apply for WFH", error: err.message });
  }
};

export const getMyWFHRequests = async (req, res) => {
  try {
    const employeeId = req.user.userId;
    const requests = await WFHRequest.find({ employeeId }).sort({ date: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch WFH requests", error: err.message });
  }
};

export const getAllWFHRequests = async (req, res) => {
  try {
    const requests = await WFHRequest.find().populate("employeeId", "name email").sort({ date: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch WFH requests", error: err.message });
  }
};

export const updateWFHStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const wfh = await WFHRequest.findByIdAndUpdate(id, { status }, { new: true });
    if (!wfh) return res.status(404).json({ message: "WFH request not found" });

    res.json({ message: "WFH request updated", wfh });
  } catch (err) {
    res.status(500).json({ message: "Failed to update WFH status", error: err.message });
  }
};
