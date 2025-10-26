import Product from "../models/Product.js";
import Scan from "../models/Scan.js";
import { fetchProductData } from "../utils/openFoodFacts.js";

export const getProduct = async (req, res) => {
  try {
    const { barcode } = req.params;
    const userId = req.user?._id;

    let product = await Product.findOne({ barcode });

    if (!product) {
      const data = await fetchProductData(barcode);
      if (!data) return res.status(404).json({ message: "Product not found" });

      product = await Product.create({
        barcode,
        data,
        score: data.Score,
      });
    }

    // Record scan if user is logged in
    if (userId) {
      await Scan.create({
        user: userId,
        product: product._id,
        scanType: "barcode",
        scannedAt: new Date(),
      });
    }

    // If no user (unauthenticated), return only the product data
    return res.json({ product: product.data });
  } catch (error) {
    console.error("❌ Error in getProduct:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};
