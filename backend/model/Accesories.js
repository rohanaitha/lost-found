import mongoose from "mongoose";

const accessorySchema = new mongoose.Schema(
  {
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile", // connects to Profile model
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reportType: {
      type: String,
      enum: ["lost", "found"],
      required: true,
    },
    itemCategory: {
      type: String,
      enum: ["wallet", "watch", "sunglasses", "belt", "bag", "cap", "other"],
      required: true,
    },
    otherItem: { type: String }, // if "other" is chosen
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    image: { type: String, default: "" }, // URL (if you upload to Cloudinary, store secure_url here)
  },
  { timestamps: true }
);

const AccessoryReport = mongoose.model("AccessoryReport", accessorySchema);
export default AccessoryReport;
