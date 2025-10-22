// src/routes/salons.js - Salon CRUD routes
import express from "express";
import { PrismaClient } from "@prisma/client";
import { verifyAdminToken } from "../utils/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// GET all salons (admin only)
router.get("/", verifyAdminToken, async (req, res) => {
  try {
    const { area } = req.query;
    const where = area ? { area: { contains: area, mode: "insensitive" } } : {};

    const salons = await prisma.salon.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    res.json(salons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single salon by ID (public)
router.get("/:id", async (req, res) => {
  try {
    const salon = await prisma.salon.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { bookings: true },
    });

    if (!salon) {
      return res.status(404).json({ error: "Salon not found" });
    }

    res.json(salon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new salon (admin only)
router.post("/", verifyAdminToken, async (req, res) => {
  try {
    const { name, area, phone, services, address, imageUrl } = req.body;

    if (!name || !area || !phone || !services) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const salon = await prisma.salon.create({
      data: {
        name,
        area,
        phone,
        services,
        address,
        imageUrl,
      },
    });

    res.status(201).json(salon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH update salon (admin only)
router.patch("/:id", verifyAdminToken, async (req, res) => {
  try {
    const { name, area, phone, services, address, imageUrl } = req.body;

    const salon = await prisma.salon.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        area,
        phone,
        services,
        address,
        imageUrl,
      },
    });

    res.json(salon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE salon (admin only)
router.delete("/:id", verifyAdminToken, async (req, res) => {
  try {
    await prisma.salon.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: "Salon deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
