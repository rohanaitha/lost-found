import {
  adduser,
  getMyProfile,
  loginUser,
  updateAvatar
} from "../controllers/ModelController.js";
import express from "express";
import authMiddleware from "../middleware/AuthMiddleware.js";
import { createReport,getReports } from "../controllers/ReportController.js";
import { createDocs, docReports } from "../controllers/DocController.js";

const router = express.Router();

router.post("/register", adduser);
router.post("/login", loginUser);
router.get("/myprofile", authMiddleware, getMyProfile);
router.post("/electronics", authMiddleware, createReport);
router.post("/jewellery", authMiddleware, createReport);
router.post("/docs",authMiddleware,createDocs)
router.get("/reports", authMiddleware, getReports);
router.put("/update-avatar",authMiddleware,updateAvatar);
router.get("/docreport",authMiddleware,docReports)

export default router;
