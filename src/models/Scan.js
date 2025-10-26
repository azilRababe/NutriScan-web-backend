import mongoose from "mongoose";

const scanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    favorite: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Scan", scanSchema);
