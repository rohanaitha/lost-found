import Profile from "../model/Profile.js";
import AccessoryReport from "../model/Accesories.js";
import ClothesReport from "../model/Clothes.js";
import DocReport from "../model/Docs.js";
import ElectronicsReport from "../model/Electronics.js";
import JewelleryReport from "../model/Jewellery.js";

// 🔹 Reusable function (not an endpoint)
const fetchAllReports = async () => {
  const accesories = await AccessoryReport.find().populate(
    "profileId",
    "fullName avatar"
  );
  const clothes = await ClothesReport.find().populate(
    "profileId",
    "fullName avatar"
  );
  const docs = await DocReport.find().populate("profileId", "fullName avatar");
  const electronics = await ElectronicsReport.find().populate(
    "profileId",
    "fullName avatar"
  );
  const jewellery = await JewelleryReport.find().populate(
    "profileId",
    "fullName avatar"
  );

  const allReports = [
    ...clothes.map((item) => ({ category: "clothes", ...item._doc })),
    ...electronics.map((item) => ({ category: "electronics", ...item._doc })),
    ...jewellery.map((item) => ({ category: "jewellery", ...item._doc })),
    ...accesories.map((item) => ({ category: "accessories", ...item._doc })),
    ...docs.map((item) => ({ category: "docs", ...item._doc })),
  ];

  return allReports.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
};

// 🔹 Controller 1: Get all reports
export const getReports = async (req, res) => {
  try {
    const allReports = await fetchAllReports();
    res.json(allReports);
    console.log(allReports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};

// 🔹 Controller 2: Get only my posts
export const myPosts = async (req, res) => {
  try {
    const final = [];
    const allReports = await fetchAllReports(); // ✅ use data function, not controller

    for (const myPost of allReports) {
      if (String(myPost.userId) === String(req.user.id)) {
        final.push(myPost);
      }
    }

    res.json(final);
    console.log("myposts", final);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};

