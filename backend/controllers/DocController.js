import DocReport from "../model/Docs.js";
import Profile from "../model/Profile.js";

export const createDocs = async (req, res) => {
  try {
    const {
      reportType,
      itemName,
      description,
      date,
      location,
      image,
      docType,
      otherDoc,
      docNumber,
      issuingAuthority,
      otherAuthority,
      nameOnDoc,
      identifier,
      reward,
    } = req.body;
    const profile = await Profile.findOne({ userId: req.user.id }); //TO FIND THE USER PROFILE...
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    const finalDocType = docType === "other" ? otherDoc : docType;
    const finalAuthority =
      issuingAuthority === "Others" ? otherAuthority : issuingAuthority;

    const newDoc = await DocReport.create({
      reportType,
      itemName,
      description,
      date,
      location,
      imageUrl: image || "",
      docType,
      finalDocType,
      docNumber,
      issuingAuthority,
      finalAuthority,
      nameOnDoc,
      identifier,
      reward: reward || "no reward alloted",
      userId: req.user.id, // to store in db with users ref
      profileId: profile._id,
    });
    res
      .status(201)
      .json({ message: "report submitted succesfully", report: newDoc });
    console.log("report:", newDoc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to submit report" });
  }
};
export const docReports = async (req, res) => {
  try {
    const reports = await DocReport.find()
      .populate("profileId", "fullName avatar") // so you get username on card
      .sort({ createdAt: -1 }); // newest first

    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};