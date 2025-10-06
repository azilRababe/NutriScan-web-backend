import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  barcode: { type: String, unique: true },
  name: String,
  brand: String,
  nutriments: Object,
  image_url: String,
  lastUpdated: { type: Date, default: Date.now },
});

export default mongoose.model("Product", productSchema);
