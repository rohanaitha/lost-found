import ElectronicsReport from "../model/Electronics.js";
import Profile from "../model/Profile.js";
import Model from "../model/Model.js";
import { fetchAllReports } from "./ReportController.js"; // adjust path if needed

// Create new electronics report
export const createElectronics = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    const user = await Model.findOne({ _id: req.user.id });
    console.log("idcheck:", user);
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
    await Profile.findOneAndUpdate(
      { userId: req.user.id },
      { $inc: { coins: 10 } }, // increment coins by 10
      { new: true }
    );
    const matchedItems = await checkForMatches({
      ...electronics._doc,
      category: "electronics",
    });

    if (matchedItems.length > 0) {
      console.log("🎯 Possible matches found:", matchedItems);
    }
    res.status(201).json({
      message: "Electronics report created",
      electronics,
      matchedItems,
    });
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

const checkForMatches = async (newPost) => {
  const allReports = await fetchAllReports();

  // Determine opposite report type (lost ↔ found)
  const oppositeType = newPost.reportType === "lost" ? "found" : "lost";

  // Filter only opposite type & same category
  const potentialMatches = allReports.filter(
    (r) =>
      r.reportType === oppositeType &&
      r.category?.toLowerCase() === "electronics"
  );

  // Normalizer to safely compare strings
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
    if (!na || !nb) return false; // don't match on empty values
    return na === nb;
  };

  const matchedPosts = potentialMatches.filter(
    (item) =>
      isSame(item.itemName, newPost.itemName) ||
      isSame(item.location, newPost.location) ||
      isSame(item.brand, newPost.brand) ||
      isSame(item.model, newPost.model) ||
      isSame(item.size, newPost.size) ||
      isSame(item.skins, newPost.skins) ||
      isSame(item.charge, newPost.charge) ||
      isSame(item.lock, newPost.lock)
  );

  console.log(
    `Potential matches scanned: ${potentialMatches.length}. Matches found: ${matchedPosts.length}`
  );

  // Avoid notifying the user who created the new post
  const filteredMatches = matchedPosts.filter(
    (m) => String(m.userId) !== String(newPost.userId)
  );
  if (filteredMatches.length !== matchedPosts.length) {
    console.log(
      `Filtered out ${
        matchedPosts.length - filteredMatches.length
      } self-match(es) to avoid notifying the post owner.`
    );
  }

  // group matched posts by profileId so each profile gets one notification
  const matchesByProfile = new Map();
  for (const m of filteredMatches) {
    const pid = m.profileId?._id || m.profileId;
    if (!pid) {
      console.warn("No profileId found for matched post:", m);
      continue;
    }
    const key = String(pid);
    if (!matchesByProfile.has(key)) matchesByProfile.set(key, []);
    matchesByProfile.get(key).push(m);
  }

  // push one aggregated notification per profile
  for (const [profileId, posts] of matchesByProfile.entries()) {
    try {
      const notification = {
        type: "match",
        category: "electronics",
        postId: newPost._id,
        message: `A new post matches your report: ${newPost.itemName}`,
        read: false,
        createdAt: new Date(),
        newPost: {
          _id: newPost._id,
          itemName: newPost.itemName,
          reportType: newPost.reportType,
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
        `🔔 Notification added for profileId: ${profileId} (matches: ${posts.length})`
      );
    } catch (err) {
      console.error(
        "Error adding aggregated notification for profileId:",
        profileId,
        err
      );
    }
  }

  return filteredMatches;
};
