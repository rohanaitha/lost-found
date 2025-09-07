import JewelleryReport from "../model/Jewellery.js";
import Profile from "../model/Profile.js";

// Create new jewellery report
export const createJewellery = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const {
      reportType,
      itemName,
      description,
      date,
      location,
      image,
      brand,
      color,
      material,
      uniqueId,
      reward,
    } = req.body;

    const jewellery = await JewelleryReport.create({
      userId: req.user.id,
      profileId: profile._id,
      reportType,
      itemName,
      description,
      date,
      location,
      imageUrl: image || "", // frontend sends Cloudinary URL as "image"
      brand,
      color,
      material,
      uniqueId,
      reward: reportType === "lost" ? reward : null,
    });

    res.status(201).json({ message: "Jewellery report created", jewellery });
  } catch (error) {
    console.error("Error creating jewellery report:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all jewellery reports
export const getJewellery = async (req, res) => {
  try {
    const reports = await JewelleryReport.find()
      .populate("profileId", "fullName avatar")
      .sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching jewellery reports", error });
  }
};
