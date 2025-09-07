import mongoose from "mongoose";

const JewellerySchema = new mongoose.Schema(
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

    reportType: { type: String, enum: ["lost", "found"], required: true },
    itemName: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },

    imageUrl: { type: String }, // from Cloudinary

    // extra fields
    brand: { type: String },
    color: { type: String },
    material: { type: String },
    uniqueId: { type: String },
    reward: { type: Number }, // only if lost
  },
  { timestamps: true }
);

const JewelleryReport = mongoose.model("JewelleryReport", JewellerySchema);
export default JewelleryReport;
