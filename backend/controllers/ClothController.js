import ClothesReport from "../model/Clothes.js";
import Profile from "../model/Profile.js";
import { fetchAllReports } from "./ReportController.js";

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
      reward,
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
    await Profile.findOneAndUpdate(
      { userId: req.user.id },
      { $inc: { coins: 10 } }, // increment coins by 10
      { new: true }
    );

    res.status(201).json({
      message: "Clothes report submitted successfully",
      report: newReport,
    });
    try {
      await checkForMatches({ ...newReport._doc, category: "clothes" });
    } catch (e) {
      console.error("Error checking matches for clothes:", e);
    }
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

const checkForMatches = async (newPost) => {
  const allReports = await fetchAllReports();
  const oppositeType = newPost.reportType === "lost" ? "found" : "lost";
  const potentialMatches = allReports.filter(
    (r) =>
      r.reportType === oppositeType && r.category?.toLowerCase() === "clothes"
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
      isSame(item.size, newPost.size) ||
      isSame(item.color, newPost.color)
  );
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
        category: "clothes",
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
        `🔔 Clothes notification added for profileId: ${profileId} (matches: ${posts.length})`
      );
    } catch (err) {
      console.error(
        "Error adding clothes notification for profileId:",
        profileId,
        err
      );
    }
  }
};
