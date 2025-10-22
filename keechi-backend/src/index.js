// src/index.js - Express server setup
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import salonRoutes from "./routes/salons.js";
import bookingRoutes from "./routes/bookings.js";
import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/auth.js";
import shopsRoutes from "./routes/shops.js";
import servicesRoutes from "./routes/services.js";
import appointmentsRoutes from "./routes/appointments.js";
import availabilityRoutes from "./routes/availability.js";
import reviewsRoutes from "./routes/reviews.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://keechi-mvp.vercel.app",
        "https://keechi.app",
        "https://www.keechi.app",
        process.env.FRONTEND_URL,
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// Suppress favicon 404s
app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "✅ Backend is running", timestamp: new Date() });
});

// Routes
app.use("/api/salons", salonRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/shops", shopsRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/reviews", reviewsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({ error: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`🚀 Keechi Backend running on http://localhost:${PORT}`);
  console.log(`📡 CORS enabled for: ${process.env.FRONTEND_URL}`);
});
