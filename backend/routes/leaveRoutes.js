import express from "express";
import {
  createLeavePolicy,
  getAllLeavePolicies,
  applyLeave,
  getLeaveRequests,
  updateLeaveStatus,
  getMyLeaveHistory,
  getMyLeaveBalance,
  updateLeavePolicy,
  deleteLeavePolicy,
  filterLeaves,
  getLeaveStats
} from "../controllers/leaveController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Create a new leave policy (HR only)
router.post(
  "/policy",
  authMiddleware,
  authorizeRoles("hr"),
  createLeavePolicy
);

// Get all leave policies (HR can manage or view all)
router.get(
  "/policy",
  authMiddleware,
  getAllLeavePolicies
);

// Get all leave requests by all employees (HR dashboard)
router.get(
  "/requests",
  authMiddleware,
  authorizeRoles("hr"),
  getLeaveRequests
);

// Update leave status (approve/reject) (HR only)
router.put(
  "/update-status/:id",
  authMiddleware,
  authorizeRoles("hr"),
  updateLeaveStatus
);

// Apply for leave
router.post(
  "/apply",
  authMiddleware,
  authorizeRoles("employee", "team_lead"),
  applyLeave
);

// Get logged-in employee's leave history
router.get(
  "/my-leaves",
  authMiddleware,
  authorizeRoles("employee", "team_lead"),
  getMyLeaveHistory
);

router.get("/my-balance", authMiddleware, getMyLeaveBalance);
router.get("/my-history", authMiddleware, getMyLeaveHistory);
router.get("/filter", authMiddleware, authorizeRoles("hr"), filterLeaves);
router.get("/stats", authMiddleware, authorizeRoles("hr"), getLeaveStats);
router.put("/policies/:id", authMiddleware, authorizeRoles("hr"), updateLeavePolicy);
router.delete("/policies/:id", authMiddleware, authorizeRoles("hr"), deleteLeavePolicy);



export default router;
