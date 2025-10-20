import User from "../models/User.js";

export const getProfile = async (req, res) => {
  try {
    // req.user should be set by Passport after authentication
    const userId = req.user._id;

    // Fetch the user from the database, excluding sensitive fields like password
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user profile
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
