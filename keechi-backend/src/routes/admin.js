// src/routes/admin.js - Admin authentication and management
import express from "express";
import { generateAdminToken, verifyAdminToken } from "../utils/auth.js";

const router = express.Router();

// Admin login endpoint
router.post("/login", (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password required" });
    }

    // Simple hardcoded password check
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = generateAdminToken();
    const admin = {
      id: "admin",
      role: "admin",
      email: "admin@keechi.com",
      name: "Keechi Admin",
    };

    res.json({
      success: true,
      token,
      admin,
      message: "✅ Login successful",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin token verification endpoint
router.get("/verify", verifyAdminToken, (req, res) => {
  try {
    const admin = {
      id: req.admin?.id || "admin",
      role: req.admin?.role || "admin",
      email: "admin@keechi.com",
      name: "Keechi Admin",
    };

    res.json({
      success: true,
      admin,
      message: "Token valid",
    });
  } catch (error) {
    res.status(401).json({ message: "Token verification failed" });
  }
});

export default router;
