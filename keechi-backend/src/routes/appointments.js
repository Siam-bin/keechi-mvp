// appointments.js - Routes for appointment management
import express from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, roleMiddleware } from "../utils/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/appointments - Get appointments (role-based filtering)
router.get("/", authMiddleware, async (req, res) => {
  try {
    let appointments;

    if (req.user.role === "user") {
      // Get user's appointments
      appointments = await prisma.appointment.findMany({
        where: { userId: req.user.id },
        include: { shop: true, service: true, user: true },
      });
    } else if (req.user.role === "shopOwner") {
      // Get shop's appointments
      const shop = await prisma.shop.findUnique({
        where: { ownerId: req.user.id },
      });

      if (!shop) {
        return res.status(404).json({ error: "Shop not found" });
      }

      appointments = await prisma.appointment.findMany({
        where: { shopId: shop.id },
        include: { shop: true, service: true, user: true },
      });
    }

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/appointments/:id - Get appointment details (no auth required for confirmation view)
router.get("/:id", async (req, res) => {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { shop: true, service: true, user: true },
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // If authenticated, verify access (user or shop owner)
    if (req.user) {
      if (
        (req.user.role === "user" && appointment.userId !== req.user.id) ||
        (req.user.role === "shopOwner" && appointment.shop.ownerId !== req.user.id)
      ) {
        return res.status(403).json({ error: "Unauthorized" });
      }
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/appointments - Create appointment (optional auth for linking to user)
router.post("/", async (req, res) => {
  try {
    // Try to get user from auth header if provided
    let userId = null;
    const token = req.headers.authorization?.split(" ")[1];
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
        userId = decoded.id;
      } catch (err) {
        // Token invalid, but continue as guest
      }
    }

    const { shopId, serviceId, dateTime, notes, userName, userPhone } = req.body;

    if (!shopId || !serviceId || !dateTime) {
      return res.status(400).json({ error: "Missing required fields: shopId, serviceId, dateTime" });
    }

    // Verify shop and service exist
    const shop = await prisma.shop.findUnique({
      where: { id: parseInt(shopId) },
    });

    const service = await prisma.service.findUnique({
      where: { id: parseInt(serviceId) },
    });

    if (!shop) {
      return res.status(404).json({ error: `Shop ${shopId} not found` });
    }

    if (!service) {
      return res.status(404).json({ error: `Service ${serviceId} not found` });
    }

    if (service.shopId !== parseInt(shopId)) {
      return res
        .status(404)
        .json({ error: `Service ${serviceId} does not belong to shop ${shopId}` });
    }

    // Create appointment (either authenticated user or guest with name/phone)
    const appointment = await prisma.appointment.create({
      data: {
        userId: userId || null,
        shopId: parseInt(shopId),
        serviceId: parseInt(serviceId),
        dateTime: new Date(dateTime),
        notes: notes || "",
        status: "Pending",
        customerName: userName || null,
        customerPhone: userPhone || null,
      },
      include: { shop: true, service: true, user: true },
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error("Appointment creation error:", error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/appointments/:id - Update appointment status (shop owner only)
router.patch("/:id", authMiddleware, roleMiddleware(["shopOwner"]), async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { shop: true },
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Verify ownership
    if (appointment.shop.ownerId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
      include: { shop: true, service: true, user: true },
    });

    res.json(updatedAppointment);
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/appointments/:id - Delete appointment
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { shop: true },
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Verify access (user who created or shop owner)
    if (
      req.user.role === "user" && appointment.userId !== req.user.id ||
      req.user.role === "shopOwner" && appointment.shop.ownerId !== req.user.id
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await prisma.appointment.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
