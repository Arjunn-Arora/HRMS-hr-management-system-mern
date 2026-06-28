import express from "express";
import { applyWFH, getMyWFHRequests, getAllWFHRequests, updateWFHStatus } from "../controllers/wfhController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/apply", authMiddleware, authorizeRoles("employee", "team_lead"), applyWFH);
router.get("/my", authMiddleware, authorizeRoles("employee", "team_lead"), getMyWFHRequests);
router.get("/all", authMiddleware, authorizeRoles("hr", "admin"), getAllWFHRequests);
router.put("/:id", authMiddleware, authorizeRoles("hr", "admin"), updateWFHStatus);

export default router;
