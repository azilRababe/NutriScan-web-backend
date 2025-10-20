import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const productSchema = new Schema(
  {
    barcode: { type: String, required: true, unique: true },
    score: { type: Number, required: true },
    // rating: { type: Schema.Types.Mixed, required: true },
    data: { type: Schema.Types.Mixed, required: true }, // Store the full API object here
  },
  { timestamps: true }
);

export default model("Product", productSchema);
