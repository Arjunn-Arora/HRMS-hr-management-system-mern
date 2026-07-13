import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {
  getAppraisalCycles,
  createAppraisalCycle,
  getActiveAppraisalCycle,
  assignAppraisals,
  getMyAppraisals,
  getEmployeeAppraisals,
  submitAppraisal,
  getMyGoals,
  getEmployeeGoals,
  createGoal,
  updateGoal,
  getMyKRAs,
  getEmployeeKRAs,
  createKRA,
  updateKRA,
  getMySkills,
  getEmployeeSkills,
  updateMySkills,
  getHRDashboardStats
} from "../controllers/performanceController.js";

const router = express.Router();

// HR Only - Appraisal Cycles & Stats
router.get("/cycles", authMiddleware, authorizeRoles('hr'), getAppraisalCycles);
router.post("/cycles", authMiddleware, authorizeRoles('hr'), createAppraisalCycle);
router.get("/hr-stats", authMiddleware, authorizeRoles('hr'), getHRDashboardStats);
router.post("/assign", authMiddleware, authorizeRoles('hr'), assignAppraisals);

// Everyone - Active Cycle
router.get("/cycles/active", authMiddleware, getActiveAppraisalCycle);

// Appraisals (Reviews)
router.get("/appraisals/my", authMiddleware, getMyAppraisals); // Appraisals assigned TO ME to fill out
router.get("/appraisals/employee/:employeeId", authMiddleware, authorizeRoles('hr', 'team_lead'), getEmployeeAppraisals);
router.put("/appraisals/:id", authMiddleware, submitAppraisal);

// Goals
router.get("/goals/my", authMiddleware, getMyGoals);
router.get("/goals/employee/:employeeId", authMiddleware, authorizeRoles('hr', 'team_lead'), getEmployeeGoals);
router.post("/goals", authMiddleware, createGoal);
router.put("/goals/:id", authMiddleware, updateGoal);

// KRAs
router.get("/kras/my", authMiddleware, getMyKRAs);
router.get("/kras/employee/:employeeId", authMiddleware, authorizeRoles('hr', 'team_lead'), getEmployeeKRAs);
router.post("/kras", authMiddleware, createKRA);
router.put("/kras/:id", authMiddleware, updateKRA);

// Skills
router.get("/skills/my", authMiddleware, getMySkills);
router.get("/skills/employee/:employeeId", authMiddleware, authorizeRoles('hr', 'team_lead'), getEmployeeSkills);
router.put("/skills/my", authMiddleware, updateMySkills);

export default router;
