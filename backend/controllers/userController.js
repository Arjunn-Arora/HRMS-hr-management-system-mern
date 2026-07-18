import User from "../models/User.js";

export const updateProfile = async (req, res) => {
  try {
    const { dob, presentAddress, permanentAddress, phone, maritalStatus } = req.body;

    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (dob !== undefined) user.dob = dob;
    if (presentAddress !== undefined) user.presentAddress = presentAddress;
    if (permanentAddress !== undefined) user.permanentAddress = permanentAddress;
    if (phone !== undefined) user.phone = phone;
    if (maritalStatus !== undefined) user.maritalStatus = maritalStatus;

    // Complete Onboarding if triggered
    if (user.onboardingStatus === 'Onboarding Triggered') {
      user.onboardingStatus = 'Completed';
    }

    const updatedUser = await user.save();

    res.json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};