import express from "express";
import upload from "../middleware/uploadBuffer.js";
import {authMiddleware} from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {
  uploadDocument,
  getAllDocuments,
  getMyDocuments,
  downloadDocument,
  getAllEmployees,
} from "../controllers/documentController.js";

const router = express.Router();

// HR uploads document to MongoDB
router.post(
  "/upload",
  authMiddleware,
  authorizeRoles("hr"),
  upload.single("document"),
  uploadDocument
);

// HR gets all documents
router.get("/", authMiddleware, authorizeRoles("hr"), getAllDocuments);

// Employee gets their own documents
router.get("/employee/me", authMiddleware, authorizeRoles("employee", "team_lead"), getMyDocuments);


// File download (binary streaming)
router.get("/download/:id", authMiddleware, downloadDocument);

// fetch all employees
router.get("/all", authMiddleware, authorizeRoles("hr"), getAllEmployees);

export default router;
