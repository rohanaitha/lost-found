import mongoose from "mongoose";

const electronicsSchema = new mongoose.Schema(
  {
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
    reportType: {
      type: String,
      enum: ["lost", "found"],
      required: true,
    },
    itemName: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    brand: { type: String },
    model: { type: String },
    size: { type: String },
    skins: { type: String },
    charge: { type: String },
    lock: { type: String },
    imageUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

const ElectronicsReport = mongoose.model(
  "ElectronicsReport",
  electronicsSchema
);

export default ElectronicsReport;
