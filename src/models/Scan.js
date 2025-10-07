import mongoose from "mongoose";

const scanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  scanType: { type: String, enum: ["barcode", "image"], default: "barcode" },
  scannedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Scan", scanSchema);
