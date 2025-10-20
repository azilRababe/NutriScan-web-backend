import Product from "../models/Product.js";
import Scan from "../models/Scan.js";
import { fetchProductData } from "../utils/openFoodFacts.js";

export const getProduct = async (req, res) => {
  const { barcode } = req.params;
  let product = await Product.findOne({ barcode });

  if (!product) {
    const data = await fetchProductData(barcode);
    if (!data) return res.status(404).json({ message: "Product not found" });

    product = await Product.create({
      barcode,
      data: data,
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
    res.json(product.data);
  }
};
