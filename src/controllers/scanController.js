import Scan from "../models/Scan.js";
import Product from "../models/Product.js";
// import { extractText } from "../utils/ocr.js";
import { fetchProductData } from "../utils/openFoodFacts.js";

export const createScan = async (req, res) => {
  try {
    const { imageUrl, barcode, scanType = "barcode" } = req.body;
    const userId = req.user._id; // Get from Passport.js (JWT auth)

    let product;

    if (scanType === "barcode" && barcode) {
      product = await Product.findOne({ barcode });

      if (!product) {
        const data = await fetchProductData(barcode);

        if (!data || !data.product_name) {
          return res
            .status(404)
            .json({ message: "Product not found in database or API." });
        }

        product = await Product.create({
          barcode,
          name: data.product_name,
          brand: data.brands,
          nutriments: data.nutriments,
          image_url: data.image_url,
          category: data.categories?.split(",")[0] || "Unknown",
          lastFetched: new Date(),
        });
      }
    }

    // Create Scan record
    const scan = await Scan.create({
      user: userId,
      product: product._id,
      scanType,
    });

    res.status(201).json({
      success: true,
      message: "Scan created successfully",
      scan,
      product,
    });
  } catch (err) {
    console.error("Error creating scan:", err);
    res.status(500).json({ message: err.message });
  }
};
