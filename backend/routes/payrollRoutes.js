// routes/payrollRoutes.js
import express from 'express';
import {
  createSalaryStructure,
  getAllStructures,
  generatePayslip,
  getPayslips,
  getPayrollSummary,
  filterPayslips,
  getPayrollHistory,
  markAsPaid,
  getEligibleEmployees
} from '../controllers/payrollController.js';
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/summary", authMiddleware, authorizeRoles("hr"), getPayrollSummary);

// HR: Add/Update salary structure
router.post('/structure', authMiddleware, authorizeRoles('hr'), createSalaryStructure);
router.get('/structures', authMiddleware, authorizeRoles('hr'), getAllStructures);
router.get('/eligible', authMiddleware, authorizeRoles('hr'), getEligibleEmployees);

// HR: Generate payslip
router.post('/generate', authMiddleware, authorizeRoles('hr'), generatePayslip);

// HR & Employee: View payslips
router.get('/history', authMiddleware, authorizeRoles('hr'), getPayrollHistory);
router.get('/payslips/filter', authMiddleware, authorizeRoles('hr'), filterPayslips);
router.put("/pay/:id", authMiddleware, authorizeRoles("hr"), markAsPaid);

export default router;
