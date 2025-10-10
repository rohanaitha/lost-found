import {
  adduser,
  getMyProfile,
  loginUser,
  updateAvatar,
} from "../controllers/ModelController.js";
import express from "express";
import authMiddleware from "../middleware/AuthMiddleware.js";
import {
  getReports,
  myPosts,
  otherPosts,
  searchPosts,
} from "../controllers/ReportController.js";
import { createDocs, docReports } from "../controllers/DocController.js";
import {
  createClothes,
  getClothesReports,
} from "../controllers/ClothController.js";
import {
  createAccessory,
  getAccessories,
} from "../controllers/AccesoriesController.js";
import { createJewellery } from "../controllers/JewelleryController.js";
import { createElectronics } from "../controllers/ElectronicsController.js";
import { getOtherProfile } from "../controllers/OtherController.js";

const router = express.Router();

router.post("/register", adduser);
router.post("/login", loginUser);
router.get("/myprofile", authMiddleware, getMyProfile);
router.post("/electronics", authMiddleware, createElectronics);
router.post("/jewellery", authMiddleware, createJewellery);
router.post("/docs", authMiddleware, createDocs);
router.post("/clothes", authMiddleware, createClothes);
router.post("/accesories", authMiddleware, createAccessory);
router.get("/acces", authMiddleware, getAccessories);
router.get("/reports", authMiddleware, getReports);
router.put("/update-avatar", authMiddleware, updateAvatar);
router.get("/docreport", authMiddleware, docReports);
router.get("/clothreport", authMiddleware, getClothesReports);
router.get("/myPosts", authMiddleware, myPosts);
router.get("/profile/:fullName", getOtherProfile);
router.get("/posts/:profileId", otherPosts);
router.get("/searchResults/:title",searchPosts)
export default router;
