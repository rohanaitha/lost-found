import Profile from "../model/Profile.js";
import AccessoryReport from "../model/Accesories.js";
import ClothesReport from "../model/Clothes.js";
import DocReport from "../model/Docs.js";
import ElectronicsReport from "../model/Electronics.js";
import JewelleryReport from "../model/Jewellery.js";

// 🔹 Reusable function (not an endpoint)
export const fetchAllReports = async () => {
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

export const otherPosts = async (req, res) => {
  try {
    const finalPost = [];
    const allReports = await fetchAllReports();
    for (const myPost of allReports) {
      if (
        String(myPost.profileId._id.toString()) === String(req.params.profileId)
      ) {
        finalPost.push(myPost);
      }
      console.log("checking: ", myPost.profileId._id.toString());
    }
    res.json(finalPost);
    console.log("result: ", finalPost);
    console.log("checking: ", req.params.profileId);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};

export const searchPosts = async (req, res) => {
  try {
    const searchedPosts = [];
    const allReports = await fetchAllReports();
    for (const myPost of allReports) {
      if (
        myPost.itemName
          ?.toLowerCase()
          .includes(req.params.title?.toLowerCase()) ||
        myPost.itemCategory
          ?.toLowerCase()
          .includes(req.params.title?.toLowerCase())
      ) {
        searchedPosts.push(myPost);
      }
    }
    res.json(searchedPosts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};


export const getPostByCategoryAndId = async (req, res) => {
  try {
    const { category, id } = req.params;
    let model;

    switch (category.toLowerCase()) {
      case "electronics":
        model = ElectronicsReport;
        break;
      case "clothes":
        model = ClothesReport;
        break;
      case "accessories":
        model = AccessoryReport;
        break;
      case "jewellery":
        model = JewelleryReport;
        break;
      case "docs":
        model = DocReport;
        break;
      default:
        return res.status(400).json({ message: "Invalid category" });
    }

    const post = await model.findById(id).populate(
      "profileId",
      "fullName avatar"
    );
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json(post);
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};