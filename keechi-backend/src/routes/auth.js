// auth.js - Authentication routes for users and shop owners
import express from "express";
import { PrismaClient } from "@prisma/client";
import {
  hashPassword,
  verifyPassword,
  generateToken,
  authMiddleware,
} from "../utils/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// ========== USER AUTHENTICATION ==========

// POST /api/auth/user/signup
router.post("/user/signup", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        role: "user",
      },
    });

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/user/login
router.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`[Login Attempt] Email: ${email}`);

    if (!email || !password) {
      console.log("[Login Failed] Missing email or password");
      return res.status(400).json({ error: "Email and password required" });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log(`[Login Failed] User not found for email: ${email}`);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      console.log(`[Login Failed] Invalid password for email: ${email}`);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate token
    const token = generateToken(user);
    console.log(`[Login Success] User: ${email}`);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ========== SHOP OWNER AUTHENTICATION ==========

// POST /api/auth/shop/signup
router.post("/shop/signup", async (req, res) => {
  try {
    const { name, email, password, phone, shopName, shopAddress, shopDescription, shopImage } = req.body;

    if (!name || !email || !password || !shopName || !shopAddress) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if email exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create shop owner user and shop in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          phone,
          role: "shopOwner",
        },
      });

      // Create shop
      const shop = await tx.shop.create({
        data: {
          ownerId: user.id,
          name: shopName,
          address: shopAddress,
          description: shopDescription,
          imageUrl: shopImage,
          phone,
        },
      });

      return { user, shop };
    });

    // Generate token
    const token = generateToken(result.user);

    res.status(201).json({
      message: "Shop registered successfully",
      token,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
      shop: {
        id: result.shop.id,
        name: result.shop.name,
        address: result.shop.address,
      },
    });
  } catch (error) {
    console.error("Shop signup error:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/shop/login
router.post("/shop/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.role !== "shopOwner") {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Get shop details
    const shop = await prisma.shop.findUnique({
      where: { ownerId: user.id },
    });

    // Generate token
    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      shop: shop ? {
        id: shop.id,
        name: shop.name,
        address: shop.address,
      } : null,
    });
  } catch (error) {
    console.error("Shop login error:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/auth/me - Get current user
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        shop: true,
        appointments: {
          include: { service: true, shop: true },
        },
      },
    });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
