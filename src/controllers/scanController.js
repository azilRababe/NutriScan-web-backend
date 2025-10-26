import Scan from "../models/Scan.js";
import Product from "../models/Product.js";
// import { extractText } from "../utils/ocr.js";
import { fetchProductData } from "../utils/openFoodFacts.js";

export const toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params; // scan ID
    const userId = req.user._id;

    // Find the scan and make sure it belongs to this user
    const scan = await Scan.findOne({ _id: id, user: userId });
    if (!scan) {
      return res
        .status(404)
        .json({ message: "Scan not found or unauthorized" });
    }

    // Toggle favorite
    scan.favorite = !scan.favorite;
    await scan.save();

    res.status(200).json({
      success: true,
      message: `Scan ${scan.favorite ? "added to" : "removed from"} favorites`,
      favorite: scan.favorite,
    });
  } catch (error) {
    console.error("Error toggling favorite:", error);
    res.status(500).json({ message: "Server error" });
  }
};
