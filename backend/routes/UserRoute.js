import {
  adduser,
  getMyProfile,
  loginUser,
} from "../controllers/ModelController.js";
import express from "express";
import authMiddleware from "../middleware/AuthMiddleware.js";
import { createReport } from "../controllers/ReportController.js";

const router = express.Router();

router.post("/register", adduser);
router.post("/login", loginUser);
router.get("/myprofile", authMiddleware, getMyProfile);
router.post("/electronics", authMiddleware, createReport);
router.post("/jewellery", authMiddleware, createReport);
router.post("/docs",authMiddleware,createReport)

export default router;
