import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { getMyTeamMembers } from "../controllers/teamLeadController.js";

const router = express.Router();

router.get("/members", authMiddleware, authorizeRoles("team_lead"), getMyTeamMembers);

export default router;
