// hrRoutes.js
import express from "express";
import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getAllTeamLeads,
  assignProjectToTeamLead,
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
router.get("/employee/:id", getEmployeeById);
router.delete("/employee/:id", deleteEmployee);
router.get("/team-leads", authMiddleware, authorizeRoles("hr"), getAllTeamLeads);
router.post("/assign-project", authMiddleware, authorizeRoles("hr", "admin"), assignProjectToTeamLead);

export default router;
