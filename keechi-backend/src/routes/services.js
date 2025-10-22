// services.js - Routes for service management
import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, roleMiddleware } from "../utils/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/services - Get all services (optionally filtered by shopId)
router.get("/", async (req, res) => {
  try {
    const { shopId } = req.query;

    const where = shopId ? { shopId: parseInt(shopId) } : {};

    const services = await prisma.service.findMany({
      where,
      include: { shop: true },
    });

    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/services/owner/my-services - Get current owner's services
router.get("/owner/my-services", authMiddleware, roleMiddleware(["shopOwner"]), async (req, res) => {
  try {
    const shop = await prisma.shop.findUnique({
      where: { ownerId: req.user.id },
    });

    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    const services = await prisma.service.findMany({
      where: { shopId: shop.id },
    });

    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/services - Create service (shop owner only)
router.post("/", authMiddleware, roleMiddleware(["shopOwner"]), async (req, res) => {
  try {
    const { name, description, price, duration } = req.body;

    if (!name || !price || !duration) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Get owner's shop
    const shop = await prisma.shop.findUnique({
      where: { ownerId: req.user.id },
    });

    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    const service = await prisma.service.create({
      data: {
        shopId: shop.id,
        name,
        description,
        price: parseFloat(price),
        duration: parseInt(duration),
      },
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/services/:id - Update service (shop owner only)
router.patch("/:id", authMiddleware, roleMiddleware(["shopOwner"]), async (req, res) => {
  try {
    const service = await prisma.service.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { shop: true },
    });

    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    // Verify ownership
    if (service.shop.ownerId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const updatedService = await prisma.service.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });

    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/services/:id - Delete service (shop owner only)
router.delete("/:id", authMiddleware, roleMiddleware(["shopOwner"]), async (req, res) => {
  try {
    const service = await prisma.service.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { shop: true },
    });

    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    // Verify ownership
    if (service.shop.ownerId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await prisma.service.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
