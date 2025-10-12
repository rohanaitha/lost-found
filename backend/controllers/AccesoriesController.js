import AccessoryReport from "../model/Accesories.js";
import Profile from "../model/Profile.js";

// Create a new accessory report
export const createAccessory = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const {
      reportType,
      itemCategory,
      otherItem,
      description,
      date,
      location,
      image,
    } = req.body;

    const accessory = await AccessoryReport.create({
      userId: req.user.id,
      reportType,
      itemCategory,
      otherItem,
      description,
      date,
      location,
      imageUrl: image || "",
      profileId: profile._id,
    });
    await Profile.findOneAndUpdate(
      { userId: req.user.id },
      { $inc: { coins: 10 } }, // increment coins by 10
      { new: true }
    );

    res.status(201).json({ message: "Accessory report created", accessory });
  } catch (error) {
    console.error("Error creating accessory report:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all accessory reports
export const getAccessories = async (req, res) => {
  try {
    const accessories = await AccessoryReport.find()
      .populate("profileId", "fullName avatar")
      .sort({ createdAt: -1 });
    res.status(200).json(accessories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reports", error });
  }
};
