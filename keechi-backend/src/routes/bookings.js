// src/routes/bookings.js - Booking management routes
import express from "express";
import { PrismaClient } from "@prisma/client";
import { verifyAdminToken } from "../utils/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// GET all bookings (admin only)
router.get("/", verifyAdminToken, async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { salon: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new booking (public)
router.post("/", async (req, res) => {
  try {
    const { name, phone, service, dateTime, note, salonId } = req.body;

    if (!name || !phone || !service || !dateTime || !salonId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Verify salon exists
    const salon = await prisma.salon.findUnique({
      where: { id: parseInt(salonId) },
    });

    if (!salon) {
      return res.status(404).json({ error: "Salon not found" });
    }

    const booking = await prisma.booking.create({
      data: {
        name,
        phone,
        service,
        dateTime,
        note,
        salonId: parseInt(salonId),
        status: "Pending",
      },
      include: { salon: true },
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH update booking status (admin only)
router.patch("/:id", verifyAdminToken, async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ["Pending", "Confirmed", "Completed", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const booking = await prisma.booking.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
      include: { salon: true },
    });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE booking (admin only)
router.delete("/:id", verifyAdminToken, async (req, res) => {
  try {
    await prisma.booking.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
