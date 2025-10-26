import User from "../models/User.js";
import Scan from "../models/Scan.js";

export const getProfile = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }

    // Fetch user excluding sensitive data
    const user = await User.findById(userId).select("-password -__v");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Use Promise.all to execute DB queries in parallel for performance
    const [totalScans, scanHistory] = await Promise.all([
      Scan.countDocuments({ user: userId }),
      Scan.find({ user: userId })
        .populate("product", "barcode data score")
        .lean(),
    ]);

    // Extract favorite scans
    const favoriteScans = scanHistory.filter((scan) => scan.favorite);

    // Send response
    res.status(200).json({
      success: true,
      user,
      stats: {
        totalScans,
        totalFavorites: favoriteScans.length,
      },
      scanHistory,
      favoriteScans,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the profile",
    });
  }
};

export const getFavoriteScans = async (req, res) => {
  try {
    const userId = req.user._id;
    const favorites = await Scan.find({
      user: userId,
      favorite: true,
    }).populate("product", "barcode data score");

    res.json(favorites);
  } catch (error) {
    console.error("❌ Error fetching favorites:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
