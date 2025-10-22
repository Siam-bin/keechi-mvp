// src/lib/api.js
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token to requests (for admin operations)
api.interceptors.request.use(
  (config) => {
    // Only in browser environment
    if (typeof window !== "undefined") {
      // Try to get user auth token first, then admin token
      const userToken = localStorage.getItem("authToken");
      const adminToken = localStorage.getItem("adminToken");
      const token = userToken || adminToken;
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Improved error handling with consistent error objects
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorData = {
      message: error.response?.data?.message || error.message || "Unknown error",
      status: error.response?.status,
      data: error.response?.data,
    };

    // Log for debugging
    if (process.env.NODE_ENV === "development") {
      console.error("API Error:", errorData);
    }

    return Promise.reject(errorData);
  }
);

// ============================================
// SALON ENDPOINTS
// ============================================
export const salonService = {
  // Get all salons or filter by area
  getSalons: (area) => {
    const params = area ? { area } : {};
    return api.get("/salons", { params }).then((res) => res.data);
  },

  // Get single salon with bookings
  getSalon: (id) => {
    return api.get(`/salons/${id}`).then((res) => res.data);
  },

  // Create new salon (admin)
  createSalon: (salonData) => {
    return api.post("/salons", salonData).then((res) => res.data);
  },

  // Update salon (admin)
  updateSalon: (id, salonData) => {
    return api.patch(`/salons/${id}`, salonData).then((res) => res.data);
  },

  // Delete salon (admin)
  deleteSalon: (id) => {
    return api.delete(`/salons/${id}`).then((res) => res.data);
  },
};

// ============================================
// BOOKING ENDPOINTS
// ============================================
export const bookingService = {
  // Get all bookings
  getBookings: () => {
    return api.get("/bookings").then((res) => res.data);
  },

  // Create new booking
  createBooking: (bookingData) => {
    return api.post("/bookings", bookingData).then((res) => res.data);
  },

  // Update booking status (admin)
  updateBookingStatus: (id, status) => {
    return api.patch(`/bookings/${id}`, { status }).then((res) => res.data);
  },

  // Delete booking (admin)
  deleteBooking: (id) => {
    return api.delete(`/bookings/${id}`).then((res) => res.data);
  },
};

// ============================================
// ADMIN ENDPOINTS
// ============================================
export const adminService = {
  // Login with password
  login: (password) => {
    return api.post("/admin/login", { password }).then((res) => res.data);
  },

  // Logout (client-side only)
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("adminToken");
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("adminToken");
  },

  // Get token
  getToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("adminToken");
  },

  // Set token
  setToken: (token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("adminToken", token);
    }
  },
};
