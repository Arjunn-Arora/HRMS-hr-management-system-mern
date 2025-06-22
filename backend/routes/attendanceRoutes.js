import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { submitAttendance, getAttendanceForEmployee } from "../controllers/attendanceController.js";

const router = express.Router();

router.post("/mark", authMiddleware, authorizeRoles("team_lead"), submitAttendance);
router.get("/my", authMiddleware, getAttendanceForEmployee);
router.get("/my", authMiddleware, getAttendanceForEmployee);

export default router;
