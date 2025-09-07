import mongoose from "mongoose";

const docSchema = new mongoose.Schema(
  {
    reportType: {
      type: String,
      enum: ["lost", "found"],
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: true,
    },
    date: {
      type: String,
      default: true,
    },
    location: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    docType: {
      type: String,
      enum: [
        "aadhar",
        "voter",
        "dl",
        "passport",
        "pan",
        "student",
        "work",
        "other",
      ],
      required: true,
    },
    otherDoc: {
      type: String, // free text if docType = "other"
      trim: true,
    },
    nameOnDoc: {
      type: String,
      required: true,
    },
    docNumber: {
      type: String,
      default: "",
    },
    issuingAuthority: {
      type: String,
      enum: [
        "UIDAI",
        "Income Tax Department",
        "Election Commission of India",
        "RTO",
        "Passport Seva Kendra",
        "College/University",
        "Employer",
        "Others",
      ],
      required: true,
    },
    otherAuthority: {
      type: String,
      trim: true,
    },
    identifier: {
      type: String,
    },
    reward: {
      type: String,
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

const DocReport = mongoose.model("DocReport", docSchema);
export default DocReport;
