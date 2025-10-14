import AccessoryReport from "../model/Accesories.js";
import Profile from "../model/Profile.js";
import { fetchAllReports } from "./ReportController.js";

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
    try {
      await checkForMatches({ ...accessory._doc, category: "accessories" });
    } catch (e) {
      console.error("Error checking matches for accessories:", e);
    }
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

const checkForMatches = async (newPost) => {
  const allReports = await fetchAllReports();
  const oppositeType = newPost.reportType === "lost" ? "found" : "lost";
  const potentialMatches = allReports.filter(
    (r) =>
      r.reportType === oppositeType &&
      r.category?.toLowerCase() === "accessories"
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
      isSame(item.itemCategory, newPost.itemCategory) ||
      isSame(item.otherItem, newPost.otherItem) ||
      isSame(item.location, newPost.location)
  );
  // avoid notifying the user who created the new post
  const filteredMatches = matched.filter(
    (m) => String(m.userId) !== String(newPost.userId)
  );
  if (filteredMatches.length !== matched.length) {
    console.log(
      `Filtered out ${
        matched.length - filteredMatches.length
      } self-match(es) for accessories to avoid notifying the post owner.`
    );
  }
  const matchesByProfile = new Map();
  for (const m of filteredMatches) {
    const pid = m.profileId?._id || m.profileId;
    if (!pid) continue;
    const key = String(pid);
    if (!matchesByProfile.has(key)) matchesByProfile.set(key, []);
    matchesByProfile.get(key).push(m);
  }
  // guard: ensure newPost has an _id
  if (!newPost || !newPost._id) {
    console.warn("checkForMatches called with invalid newPost:", newPost);
    return;
  }

  for (const [profileId, posts] of matchesByProfile.entries()) {
    // skip notifying the post owner
    if (String(profileId) === String(newPost.profileId || newPost.userId)) {
      console.log("Skipping notification for post owner profileId:", profileId);
      continue;
    }
    try {
      const notification = {
        type: "match",
        category: "accessories",
        postId: newPost._id,
        message: `A new post matches your report: ${
          newPost.itemName || newPost.itemCategory
        }`,
        read: false,
        createdAt: new Date(),
        newPost: {
          _id: newPost._id,
          itemName: newPost.itemName,
          itemCategory: newPost.itemCategory,
          location: newPost.location,
        },
        matchedPosts: posts.map((p) => ({
          _id: p._id,
          itemCategory: p.itemCategory,
          otherItem: p.otherItem,
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
        `🔔 Accessory notification added for profileId: ${profileId} (matches: ${posts.length})`
      );
    } catch (err) {
      console.error(
        "Error adding accessory notification for profileId:",
        profileId,
        err
      );
    }
  }
};
