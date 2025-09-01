import Report from "../model/report.js";
import Profile from "../model/Profile.js";

// Create new report
export const createReport = async (req, res) => {
  try {
    const { reportType, itemName, description, date, location, image } =
      req.body;

    // Validate required fields
    if (!reportType || !itemName || !date || !location) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const profile = await Profile.findOne({ userId: req.user.id }); //TO FIND THE USER PROFILE...
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const newReport = await Report.create({
      reportType,
      itemName,
      description,
      date,
      location,
      imageUrl: image || "",
      userId: req.user.id, // to store in db with users ref
      profileId: profile._id,
    });

    res
      .status(201)
      .json({ message: "Report submitted successfully", report: newReport });
    console.log("profile verify:", newReport);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit report" });
  }
};

export const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("profileId", "fullName") // so you get username on card
      .sort({ createdAt: -1 }); // newest first

    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};
