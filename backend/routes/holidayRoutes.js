import express from "express";
import { getHolidays, createHoliday, deleteHoliday } from "../controllers/holidayController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getHolidays);
router.post("/", authMiddleware, authorizeRoles("hr", "admin"), createHoliday);
router.delete("/:id", authMiddleware, authorizeRoles("hr", "admin"), deleteHoliday);

export default router;
