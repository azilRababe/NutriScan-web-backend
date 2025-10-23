import Product from "../models/Product.js";
import Scan from "../models/Scan.js";
import { fetchProductData } from "../utils/openFoodFacts.js";

export const getProduct = async (req, res) => {
  try {
    const { barcode } = req.params;
    let product = await Product.findOne({ barcode });

    if (!product) {
      const data = await fetchProductData(barcode);
      if (!data) return res.status(404).json({ message: "Product not found" });

      product = await Product.create({
        barcode,
        data,
        score: data.Score,
      });

      if (req.user && product) {
        await Scan.create({
          user: req.user._id,
          product: product._id,
          scanType: "barcode",
          scannedAt: new Date(),
        });
      }

      return res.json(product.data);
    }

    // respond when product already exists
    return res.json(product.data);
  } catch (error) {
    console.error("❌ Error in getProduct:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};
