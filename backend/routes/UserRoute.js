import {
  adduser,
  getMyProfile,
  loginUser,
  updateAvatar,
} from "../controllers/ModelController.js";
import express from "express";
import authMiddleware from "../middleware/AuthMiddleware.js";
import { createReport, getReports } from "../controllers/ReportController.js";
import { createDocs, docReports } from "../controllers/DocController.js";
import { createClothes, getClothesReports } from "../controllers/ClothController.js";
import { createAccessory, getAccessories } from "../controllers/AccesoriesController.js";
import { createJewellery } from "../controllers/JewelleryController.js";
import { createElectronics } from "../controllers/ElectronicsController.js";

const router = express.Router();

router.post("/register", adduser);
router.post("/login", loginUser);
router.get("/myprofile", authMiddleware, getMyProfile);
router.post("/electronics", authMiddleware, createElectronics);
router.post("/jewellery", authMiddleware, createJewellery);
router.post("/docs", authMiddleware, createDocs);
router.post("/clothes",authMiddleware,createClothes)
router.post("/accesories",authMiddleware,createAccessory)
router.get("/acces",authMiddleware,getAccessories)
router.get("/reports", authMiddleware, getReports);
router.put("/update-avatar", authMiddleware, updateAvatar);
router.get("/docreport", authMiddleware, docReports);
router.get("/clothreport",authMiddleware,getClothesReports)

export default router;
