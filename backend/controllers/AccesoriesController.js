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

  // guard: ensure newPost has an _id
  if (!newPost || !newPost._id) {
    console.warn("checkForMatches called with invalid newPost:", newPost);
    return [];
  }

  if (newPost.reportType === "found") {
    const lostMatches = matched.filter((m) => m.reportType === "lost");
    const filtered = lostMatches.filter(
      (m) => String(m.userId) !== String(newPost.userId)
    );

    const matchesByProfile = new Map();
    for (const m of filtered) {
      const pid = m.profileId?._id || m.profileId;
      if (!pid) continue;
      const key = String(pid);
      if (!matchesByProfile.has(key)) matchesByProfile.set(key, []);
      matchesByProfile.get(key).push(m);
    }

    for (const [profileId, posts] of matchesByProfile.entries()) {
      if (String(profileId) === String(newPost.profileId || newPost.userId))
        continue;
      try {
        const notification = {
          type: "match",
          category: "accessories",
          postId: newPost._id,
          message: `A found post matches your lost report: ${
            newPost.itemCategory || newPost.otherItem
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
          `🔔 Accessory notification added for lost owner profileId: ${profileId} (matches: ${posts.length})`
        );
      } catch (err) {
        console.error(
          "Error adding accessory notification for profileId:",
          profileId,
          err
        );
      }
    }

    return filtered;
  }

  if (newPost.reportType === "lost") {
    const foundMatches = matched.filter((m) => m.reportType === "found");
    if (foundMatches.length === 0) return [];
    const profileId = newPost.profileId || newPost.userId;
    if (!profileId) return foundMatches;
    try {
      const primaryFound = foundMatches[0];
      const notification = {
        type: "match",
        category: "accessories",
        postId: primaryFound?._id || newPost._id,
        message: `We found ${
          foundMatches.length
        } found post(s) that may match your lost report: ${
          newPost.itemCategory || newPost.otherItem
        }`,
        read: false,
        createdAt: new Date(),
        newPost: primaryFound
          ? {
              _id: primaryFound._id,
              itemCategory: primaryFound.itemCategory,
              otherItem: primaryFound.otherItem,
              location: primaryFound.location,
            }
          : {
              _id: newPost._id,
              itemName: newPost.itemName,
              itemCategory: newPost.itemCategory,
              location: newPost.location,
            },
        matchedPosts: foundMatches.map((p) => ({
          _id: p._id,
          itemCategory: p.itemCategory,
          otherItem: p.otherItem,
          location: p.location,
        })),
        matchedCount: foundMatches.length,
      };
      await Profile.findByIdAndUpdate(
        profileId,
        { $push: { notifications: notification } },
        { new: true }
      );
      console.log(
        `🔔 Notification added for new lost post owner profileId: ${profileId} (matches: ${foundMatches.length})`
      );
    } catch (err) {
      console.error("Error notifying lost post owner:", profileId, err);
    }

    return foundMatches;
  }

  return [];
};
