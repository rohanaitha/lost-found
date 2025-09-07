import ClothesReport from "../model/Clothes.js";
import Profile from "../model/Profile.js";

// Create clothes report
export const createClothes = async (req, res) => {
  try {
    const {
      reportType,
      itemName,
      description,
      date,
      location,
      image,
      gender,
      size,
      color,
      material,
      pattern,
      brand,
      reward
    } = req.body;

    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const newReport = await ClothesReport.create({
      reportType,
      itemName,
      description,
      date,
      location,
      imageUrl: image || "",
      gender,
      size,
      color,
      material,
      pattern,
      brand,
      reward: reportType === "lost" ? reward : "no reward allotted",
      userId: req.user.id,
      profileId: profile._id,
    });

    res
      .status(201)
      .json({
        message: "Clothes report submitted successfully",
        report: newReport,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit clothes report" });
  }
};

// Fetch all clothes reports
export const getClothesReports = async (req, res) => {
  try {
    const reports = await ClothesReport.find()
      .populate("profileId", "fullName avatar")
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch clothes reports" });
  }
};
