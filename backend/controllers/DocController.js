import DocReport from "../model/Docs.js";
import Profile from "../model/Profile.js";
import { fetchAllReports } from "./ReportController.js";

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
    await Profile.findOneAndUpdate(
      { userId: req.user.id },
      { $inc: { coins: 10 } }, // increment coins by 10
      { new: true }
    );

    res
      .status(201)
      .json({ message: "report submitted succesfully", report: newDoc });
    console.log("report:", newDoc);
    // Check for matches and notify
    try {
      await checkForMatches({ ...newDoc._doc, category: "docs" });
    } catch (e) {
      console.error("Error checking matches for docs:", e);
    }
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

const checkForMatches = async (newPost) => {
  const allReports = await fetchAllReports();
  const oppositeType = newPost.reportType === "lost" ? "found" : "lost";
  const potentialMatches = allReports.filter(
    (r) => r.reportType === oppositeType && r.category?.toLowerCase() === "docs"
  );
  const normalize = (v) => {
    if (v === null || v === undefined) return "";
    if (typeof v === "string") return v.trim().toLowerCase();
    try {
      return String(v).trim().toLowerCase();
    } catch (e) {
      return "";
    }
  };
  const isSame = (a, b) => {
    const na = normalize(a);
    const nb = normalize(b);
    if (!na || !nb) return false;
    return na === nb;
  };

  const matched = potentialMatches.filter(
    (item) =>
      isSame(item.itemName, newPost.itemName) ||
      isSame(item.location, newPost.location) ||
      isSame(item.docNumber, newPost.docNumber) ||
      isSame(item.identifier, newPost.identifier)
  );

  // group by profile
  const matchesByProfile = new Map();
  for (const m of matched) {
    const pid = m.profileId?._id || m.profileId;
    if (!pid) continue;
    const key = String(pid);
    if (!matchesByProfile.has(key)) matchesByProfile.set(key, []);
    matchesByProfile.get(key).push(m);
  }

  for (const [profileId, posts] of matchesByProfile.entries()) {
    try {
      const notification = {
        type: "match",
        category: "docs",
        postId: newPost._id,
        message: `A new post matches your report: ${newPost.itemName}`,
        read: false,
        createdAt: new Date(),
        newPost: {
          _id: newPost._id,
          itemName: newPost.itemName,
          location: newPost.location,
        },
        matchedPosts: posts.map((p) => ({
          _id: p._id,
          itemName: p.itemName,
          location: p.location,
        })),
        matchedCount: posts.length,
      };
      await Profile.findByIdAndUpdate(
        profileId,
        { $push: { notifications: notification } },
        { new: true }
      );
      console.log(
        `🔔 Doc notification added for profileId: ${profileId} (matches: ${posts.length})`
      );
    } catch (err) {
      console.error(
        "Error adding doc notification for profileId:",
        profileId,
        err
      );
    }
  }
};
