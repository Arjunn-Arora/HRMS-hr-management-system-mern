import Announcement from "../models/Announcement.js";
import User from "../models/User.js";

export const createAnnouncement = async (req, res) => {
  try {
    const { title, message } = req.body;
    const { userId, role } = req.user;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const announcement = await Announcement.create({
      title,
      message,
      createdBy: {
        userId,
        name: user.name,
        role: user.role
      }
    });

    res.status(201).json(announcement);  // return the new announcement directly
  } catch (err) {
    res.status(500).json({ message: "Error creating announcement", error: err.message });
  }
};

export const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);  // return array directly
  } catch (err) {
    res.status(500).json({ message: "Error fetching announcements", error: err.message });
  }
};
