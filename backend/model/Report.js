import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reportType: {
      type: String,
      enum: ["lost", "found"], // only these 2 values allowed
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    date: {
      type: String, // keep as string since you’re passing from input[type=date]
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String, // Cloudinary URL
      default: "",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // links to User collection
      required: true,
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile", // connects to Profile model
      required: true,
    },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);
export default Report;
