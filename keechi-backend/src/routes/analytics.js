import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, roleMiddleware } from "../utils/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/analytics/dashboard - Get dashboard summary stats
router.get("/dashboard", authMiddleware, roleMiddleware(["shopOwner"]), async (req, res) => {
  try {
    const shop = await prisma.shop.findUnique({
      where: { ownerId: req.user.id },
    });

    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 1. Today's Stats
    const todaysAppointments = await prisma.appointment.findMany({
      where: {
        shopId: shop.id,
        dateTime: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const totalBookingsToday = todaysAppointments.length;
    const completedServicesToday = todaysAppointments.filter(a => a.status === 'Completed').length;
    const upcomingToday = todaysAppointments.filter(a => a.status === 'Confirmed' || a.status === 'Pending').length;
    const cancelledToday = todaysAppointments.filter(a => a.status === 'Cancelled').length;

    // 2. Next Appointment
    const nextAppointment = await prisma.appointment.findFirst({
      where: {
        shopId: shop.id,
        dateTime: {
          gte: new Date(),
        },
        status: {
          in: ['Confirmed', 'Pending']
        }
      },
      orderBy: {
        dateTime: 'asc',
      },
      include: {
        user: { select: { name: true, phone: true } },
        service: { select: { name: true, duration: true, price: true } }
      }
    });

    // 3. Repeated Customers (Users with > 1 completed appointment)
    // Get all completed appointments for this shop
    const allCompleted = await prisma.appointment.findMany({
      where: {
        shopId: shop.id,
        status: 'Completed',
        userId: { not: null } // Only registered users
      },
      select: { userId: true, user: { select: { name: true, phone: true } }, dateTime: true }
    });

    const userCounts = {};
    allCompleted.forEach(appt => {
      if (appt.userId) {
        userCounts[appt.userId] = (userCounts[appt.userId] || 0) + 1;
      }
    });

    const repeatCustomerIds = Object.keys(userCounts).filter(id => userCounts[id] > 1);
    const repeatCount = repeatCustomerIds.length;

    // Get details of top 3 repeat customers
    const topRepeatCustomers = Object.entries(userCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([userId, count]) => {
        const customer = allCompleted.find(a => a.userId === parseInt(userId))?.user;
        return {
          name: customer?.name || "Unknown",
          bookings: count,
          lastVisit: allCompleted.filter(a => a.userId === parseInt(userId)).sort((a, b) => b.dateTime - a.dateTime)[0]?.dateTime
        };
      });

    // 4. Revenue Stats (Monthly)
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlyAppointments = await prisma.appointment.findMany({
      where: {
        shopId: shop.id,
        dateTime: {
          gte: firstDayOfMonth,
        },
        status: 'Completed',
      },
      include: {
        service: { select: { price: true } }
      }
    });

    const monthlyRevenue = monthlyAppointments.reduce((sum, appt) => sum + appt.service.price, 0);

    // 5. Rating
    const rating = shop.rating || 0;
    const reviewCount = shop.reviewCount || 0;

    res.json({
      today: {
        total: totalBookingsToday,
        completed: completedServicesToday,
        upcoming: upcomingToday,
        cancelled: cancelledToday
      },
      nextAppointment,
      repeatCustomers: {
        count: repeatCount,
        top: topRepeatCustomers
      },
      performance: {
        monthlyRevenue,
        rating,
        reviewCount
      }
    });

  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/analytics/revenue - Get revenue data for charts (Last 7 days)
router.get("/revenue", authMiddleware, roleMiddleware(["shopOwner"]), async (req, res) => {
  try {
    const shop = await prisma.shop.findUnique({
      where: { ownerId: req.user.id },
    });

    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6); // Last 7 days
    startDate.setHours(0, 0, 0, 0);

    const appointments = await prisma.appointment.findMany({
      where: {
        shopId: shop.id,
        dateTime: {
          gte: startDate,
          lte: endDate,
        },
        status: 'Completed',
      },
      include: {
        service: { select: { price: true } }
      }
    });

    // Group by date
    const dailyRevenue = {};
    // Initialize all 7 days with 0
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      dailyRevenue[dateStr] = 0;
    }

    appointments.forEach(appt => {
      const dateStr = appt.dateTime.toISOString().split('T')[0];
      if (dailyRevenue[dateStr] !== undefined) {
        dailyRevenue[dateStr] += appt.service.price;
      }
    });

    // Format for frontend chart
    const chartData = Object.keys(dailyRevenue).map(date => ({
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }), // Mon, Tue
      revenue: dailyRevenue[date]
    }));

    res.json(chartData);

  } catch (error) {
    console.error("Revenue Analytics Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
