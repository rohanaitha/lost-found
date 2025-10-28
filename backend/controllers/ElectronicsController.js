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

  // guard: newPost must have an _id
  if (!newPost || !newPost._id) {
    console.warn("checkForMatches called with invalid newPost:", newPost);
    return [];
  }

  // guard: newPost must have an _id
  if (!newPost || !newPost._id) {
    console.warn("checkForMatches called with invalid newPost:", newPost);
    return [];
  }

  // New behaviour:
  // - If a FOUND post is created -> notify owners of matching LOST posts only
  // - If a LOST post is created -> notify the NEW lost post owner if there are existing FOUND matches

  if (newPost.reportType === "found") {
    // notify owners of lost posts that match this found post
    const lostMatches = matchedPosts.filter((m) => m.reportType === "lost");
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
      // don't notify the found post owner
      if (String(profileId) === String(newPost.profileId || newPost.userId)) {
        console.log(
          "Skipping notification for post owner profileId:",
          profileId
        );
        continue;
      }
      try {
        const notification = {
          type: "match",
          category: "electronics",
          postId: newPost._id,
          message: `A found post matches your lost report: ${newPost.itemName}`,
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
          `🔔 Notification added for lost owner profileId: ${profileId} (matches: ${posts.length})`
        );
      } catch (err) {
        console.error(
          "Error adding aggregated notification for profileId:",
          profileId,
          err
        );
      }
    }

    return filtered;
  }

  if (newPost.reportType === "lost") {
    // If there are existing found posts that match this lost post, notify the lost post owner only
    const foundMatches = matchedPosts.filter((m) => m.reportType === "found");
    if (foundMatches.length === 0) return [];

    const profileId = newPost.profileId || newPost.userId;
    if (!profileId) return foundMatches;

    try {
      // Prefer showing the found post(s) in the notification: set postId/newPost to the first found match
      const primaryFound = foundMatches[0];
      const notification = {
        type: "match",
        category: "electronics",
        postId: primaryFound?._id || newPost._id,
        message: `We found ${foundMatches.length} found post(s) that may match your lost report: ${newPost.itemName}`,
        read: false,
        createdAt: new Date(),
        newPost: primaryFound
          ? {
              _id: primaryFound._id,
              itemName: primaryFound.itemName,
              reportType: primaryFound.reportType,
              location: primaryFound.location,
            }
          : {
              _id: newPost._id,
              itemName: newPost.itemName,
              reportType: newPost.reportType,
              location: newPost.location,
            },
        matchedPosts: foundMatches.map((p) => ({
          _id: p._id,
          itemName: p.itemName,
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
