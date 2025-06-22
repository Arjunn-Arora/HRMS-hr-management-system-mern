import express from "express";
import { loginUser, logoutUser, verifyAndSetPassword, getLoggedInUser } from "../controllers/authController.js";
import { updateProfile } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/verify/:token", verifyAndSetPassword);
router.get("/me", authMiddleware, getLoggedInUser);
router.put("/update-profile", authMiddleware, updateProfile);

export default router;