import express from "express";
import {
  createEmployee,
  getEmployees,
  getAllUsers,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getAllTeamLeads,
  assignProjectToTeamLead,
  getPendingOnboardingUsers,
  getOnboardingCount,
  triggerOnboarding
} from "../controllers/hrController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.use(authorizeRoles("hr", "admin"));

// Form-data handler for update: profilePic + resume
router.put(
  "/employee/:id",
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  updateEmployee
);

router.post("/create-employee", createEmployee);
router.get("/employees", getEmployees);
router.get("/all-users", getAllUsers);
router.get("/employee/:id", getEmployeeById);
router.delete("/employee/:id", deleteEmployee);
router.get("/team-leads", getAllTeamLeads);
router.post("/assign-project", assignProjectToTeamLead);

// Onboarding Routes
router.get("/onboarding-pending", getPendingOnboardingUsers);
router.get("/onboarding-count", getOnboardingCount);
router.put("/trigger-onboarding/:id", triggerOnboarding);

export default router;
