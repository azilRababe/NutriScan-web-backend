import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const productSchema = new Schema(
  {
    barcode: { type: String, required: true, unique: true },
    score: { type: Number },
    data: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export default model("Product", productSchema);
