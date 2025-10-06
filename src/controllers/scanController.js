import Scan from "../models/Scan.js";
import Product from "../models/Product.js";
import { extractText } from "../utils/ocr.js";
import { fetchProductData } from "../utils/openFoodFacts.js";

export const createScan = async (req, res) => {
  try {
    const { imageUrl, barcode, userId } = req.body;

    const detectedText = await extractText(imageUrl);

    let product = await Product.findOne({ barcode });
    if (!product) {
      const data = await fetchProductData(barcode);
      if (data) {
        product = await Product.create({
          barcode,
          name: data.product_name,
          brand: data.brands,
          nutriments: data.nutriments,
          image_url: data.image_url,
        });
      }
    }

    const scan = await Scan.create({
      user: userId,
      imageUrl,
      detectedText,
      product: product?._id || null,
    });

    res.status(201).json(scan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
