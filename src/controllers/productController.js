import Product from "../models/Product.js";
import { fetchProductData } from "../utils/openFoodFacts.js";

export const getProduct = async (req, res) => {
  const { barcode } = req.params;
  let product = await Product.findOne({ barcode });

  if (!product) {
    const data = await fetchProductData(barcode);
    if (!data) return res.status(404).json({ message: "Not found" });
    product = await Product.create({
      barcode,
      name: data.product_name,
      brand: data.brands,
      nutriments: data.nutriments,
      image_url: data.image_url,
    });
  }

  res.json(product);
};
