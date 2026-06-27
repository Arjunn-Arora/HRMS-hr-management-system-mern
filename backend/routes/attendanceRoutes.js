import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkIn, checkOut, getStatus, getAttendanceForEmployee } from "../controllers/attendanceController.js";

const router = express.Router();

router.post("/check-in", authMiddleware, checkIn);
router.post("/check-out", authMiddleware, checkOut);
router.get("/status", authMiddleware, getStatus);
router.get("/my", authMiddleware, getAttendanceForEmployee);

export default router;
