// shops.js - Routes for shop management
import express from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";
import fs from "fs";
import { authMiddleware, roleMiddleware } from "../utils/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// Configure multer for file uploads
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
});

// GET /api/shops - Get all shops
router.get("/", async (req, res) => {
  try {
    const shops = await prisma.shop.findMany({
      include: {
        owner: { select: { name: true, email: true } },
        services: true,
      },
    });

    res.json(shops);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/shops/:id - Get shop details with all info
router.get("/:id", async (req, res) => {
  try {
    const shop = await prisma.shop.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        owner: { select: { name: true, email: true } },
        services: true,
        reviews: {
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    // Calculate average rating
    const avgRating =
      shop.reviews.length > 0
        ? (
            shop.reviews.reduce((sum, r) => sum + r.rating, 0) / shop.reviews.length
          ).toFixed(1)
        : 0;

    res.json({
      ...shop,
      averageRating: parseFloat(avgRating),
      reviewCount: shop.reviews.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/shops/:id - Update shop (owner only)
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(["shopOwner"]),
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      // Verify ownership
      const shop = await prisma.shop.findUnique({
        where: { id: parseInt(req.params.id) },
      });

      if (!shop || shop.ownerId !== req.user.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const updateData = { ...req.body };

      // Handle cover image upload
      if (req.files?.coverImage?.[0]) {
        updateData.coverImage = `/uploads/${req.files.coverImage[0].filename}`;
      }

      // Handle gallery images upload
      if (req.files?.galleryImages?.length > 0) {
        const galleryPaths = req.files.galleryImages.map(
          (file) => `/uploads/${file.filename}`
        );
        updateData.galleryImages = galleryPaths;
      }

      const updatedShop = await prisma.shop.update({
        where: { id: parseInt(req.params.id) },
        data: updateData,
        include: {
          owner: { select: { name: true, email: true } },
          services: true,
        },
      });

      res.json(updatedShop);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// GET /api/shops/owner/me - Get current owner's shop
router.get("/owner/me", authMiddleware, roleMiddleware(["shopOwner"]), async (req, res) => {
  try {
    const shop = await prisma.shop.findUnique({
      where: { ownerId: req.user.id },
      include: {
        services: true,
        appointments: {
          include: { user: true, service: true },
        },
      },
    });

    res.json(shop);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
