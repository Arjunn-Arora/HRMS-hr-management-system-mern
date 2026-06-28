import express from "express";
import { getShifts, createShift, deleteShift, assignShiftToUsers } from "../controllers/shiftController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getShifts);
router.post("/", authMiddleware, authorizeRoles("hr", "admin"), createShift);
router.delete("/:id", authMiddleware, authorizeRoles("hr", "admin"), deleteShift);
router.post("/assign", authMiddleware, authorizeRoles("hr", "admin"), assignShiftToUsers);

export default router;
