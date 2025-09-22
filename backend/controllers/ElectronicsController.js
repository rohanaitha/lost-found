import ElectronicsReport from "../model/Electronics.js";
import Profile from "../model/Profile.js";
import Model from "../model/Model.js";

// Create new electronics report
export const createElectronics = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    const user = await Model.findOne({ _id: req.user.id });
    console.log("idcheck:",user)
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const {
      reportType,
      itemName,
      description,
      date,
      location,
      brand,
      model,
      size,
      skins,
      charge,
      lock,
      image,
    } = req.body;

    const electronics = await ElectronicsReport.create({
      userId: user._id,
      profileId: profile._id,
      reportType,
      itemName,
      description,
      date,
      location,
      brand,
      model,
      size,
      skins,
      charge,
      lock,
      imageUrl: image || "",
    });

    res
      .status(201)
      .json({ message: "Electronics report created", electronics });
  } catch (error) {
    console.error("Error creating electronics report:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all electronics reports
export const getElectronics = async (req, res) => {
  try {
    const electronics = await ElectronicsReport.find()
      .populate("profileId", "fullName avatar")
      .sort({ createdAt: -1 });

    res.status(200).json(electronics);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reports", error });
  }
};
