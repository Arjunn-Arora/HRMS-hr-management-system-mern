import express from "express";
import { createAnnouncement, getAllAnnouncements } from "../controllers/announcementController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, authorizeRoles("hr", "admin"), createAnnouncement);
router.get("/all", authMiddleware, getAllAnnouncements);

export default router;
