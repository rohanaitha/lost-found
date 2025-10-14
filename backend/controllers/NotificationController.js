import Profile from "../model/Profile.js";

export const getNotifications = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    // Diagnostic logging to help debug empty notifications
    console.log(
      `Profile ${profile._id} found. notifications type:`,
      typeof profile.notifications
    );
    console.log(
      `notifications length:`,
      Array.isArray(profile.notifications)
        ? profile.notifications.length
        : "not-array"
    );

    // Ensure we return an array (sorted newest first) to the client
    const notifications = Array.isArray(profile.notifications)
      ? profile.notifications
      : [];

    // optional: sort by createdAt descending so newest notifications come first
    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
