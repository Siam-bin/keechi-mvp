// availability.js - Get available time slots for a service
import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/availability?shopId=1&serviceId=1&date=2025-10-25
// Returns available time slots for a service on a given date
router.get("/", async (req, res) => {
  try {
    const { shopId, serviceId, date } = req.query;

    if (!shopId || !serviceId || !date) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    // Get service details (including duration)
    const service = await prisma.service.findUnique({
      where: { id: parseInt(serviceId) },
    });

    if (!service || service.shopId !== parseInt(shopId)) {
      return res.status(404).json({ error: "Service not found" });
    }

    // Define working hours (9 AM to 6 PM, 30-min slots)
    const WORK_START = 9; // 9 AM
    const WORK_END = 18; // 6 PM
    const SLOT_INTERVAL = 30; // minutes

    // Generate all possible slots for the day
    const allSlots = [];
    const baseDate = new Date(date);
    baseDate.setHours(0, 0, 0, 0);

    for (let hour = WORK_START; hour < WORK_END; hour++) {
      for (let min = 0; min < 60; min += SLOT_INTERVAL) {
        const slotTime = new Date(baseDate);
        slotTime.setHours(hour, min, 0, 0);

        // Only add if appointment would end before work hours end
        const endTime = new Date(slotTime);
        endTime.setMinutes(endTime.getMinutes() + service.duration);
        if (endTime.getHours() < WORK_END || (endTime.getHours() === WORK_END && endTime.getMinutes() === 0)) {
          allSlots.push(slotTime);
        }
      }
    }

    // Get booked appointments for this service on this date
    const dayStart = new Date(baseDate);
    const dayEnd = new Date(baseDate);
    dayEnd.setHours(23, 59, 59, 999);

    const bookedAppointments = await prisma.appointment.findMany({
      where: {
        shopId: parseInt(shopId),
        serviceId: parseInt(serviceId),
        dateTime: {
          gte: dayStart,
          lte: dayEnd,
        },
        status: { not: "Cancelled" }, // Exclude cancelled appointments
      },
    });

    // Mark slots as available or booked
    const slots = allSlots.map((slotTime) => {
      const isBooked = bookedAppointments.some((apt) => {
        const aptStart = new Date(apt.dateTime);
        const aptEnd = new Date(aptStart);
        aptEnd.setMinutes(aptEnd.getMinutes() + service.duration);

        // Check if slot overlaps with any booked appointment
        return slotTime >= aptStart && slotTime < aptEnd;
      });

      return {
        time: slotTime.toISOString(),
        timeString: slotTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        available: !isBooked,
      };
    });

    res.json({
      date,
      serviceDuration: service.duration,
      slots,
      availableCount: slots.filter((s) => s.available).length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
