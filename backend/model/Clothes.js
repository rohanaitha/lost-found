import mongoose from "mongoose";

const clothesSchema = new mongoose.Schema(
  {
    reportType: {
      type: String,
      enum: ["lost", "found"],
      required: true,
    },
    itemName: { type: String, required: true },
    description: { type: String },
    date: { type: String },
    location: { type: String, required: true },
    imageUrl: { type: String, default: "" },

    // Extra fields
    gender: {
      type: String,
      enum: ["male", "female", "unisex"],
      default: "unisex",
    },
    size: {
      type: String,
      enum: ["S", "M", "L", "XL", "XXL"],
    },
    color: { type: String },
    material: { type: String },
    pattern: { type: String },
    brand: { type: String },
    reward: { type: String },

    // Links
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
  },
  { timestamps: true }
);

const ClothesReport = mongoose.model("ClothesReport", clothesSchema);
export default ClothesReport;
