import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {
  getMyTeamMembers,
  getAllocatedProjects, // ✅ Add this
  assignEmployeesToProject,
  getProjectAssignedEmployees
} from "../controllers/teamLeadController.js";

const router = express.Router();

// Existing
router.get("/members", authMiddleware, authorizeRoles("team_lead"), getMyTeamMembers);

// ✅ Add this new route
router.get("/projects", authMiddleware, authorizeRoles("team_lead"), getAllocatedProjects);

// Existing
router.post(
  "/assign/:projectId",
  authMiddleware,
  authorizeRoles("team_lead"),
  assignEmployeesToProject
);

router.get(
  "/project/:projectId",
  authMiddleware,
  authorizeRoles("team_lead"),
  getProjectAssignedEmployees
);

export default router;
