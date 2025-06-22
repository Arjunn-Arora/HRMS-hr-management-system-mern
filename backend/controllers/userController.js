import User from "../models/User.js";

export const updateProfile = async (req, res) => {
  try {
    const { dob, address, phone } = req.body;

    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { dob, address, phone },
      { new: true }
    );

    res.json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};