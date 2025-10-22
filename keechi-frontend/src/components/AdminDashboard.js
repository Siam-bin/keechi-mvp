// src/components/AdminDashboard.js - Professional Admin Interface
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminBookingsList from "./AdminBookingsList";
import AdminSalonsList from "./AdminSalonsList";
import { useAdmin } from "@/context/AdminContext";
import { LogOut, BarChart3, Store, TrendingUp } from "lucide-react";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AdminDashboard() {
  const router = useRouter();
  const { admin, logout, getAuthHeaders } = useAdmin();
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();
      
      const bookingsRes = await axios.get(`${API_BASE}/bookings`, {
        headers,
      });
      const salonsRes = await axios.get(`${API_BASE}/salons`, {
        headers,
      });

      const bookings = bookingsRes.data || [];
      const salons = salonsRes.data || [];

      setDashboardStats({
        totalBookings: bookings.length,
        confirmedBookings: bookings.filter((b) => b.status === "confirmed").length,
        pendingBookings: bookings.filter((b) => b.status === "pending").length,
        cancelledBookings: bookings.filter((b) => b.status === "cancelled").length,
        totalSalons: salons.length,
        activeSalons: salons.filter((s) => s.active).length,
        inactiveSalons: salons.length - (salons.filter((s) => s.active).length || 0),
      });
    } catch (err) {
      if (err.response?.status === 401) {
        // Token expired or invalid
        logout();
        router.push("/admin");
      }
      console.error("Error fetching dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-pink-900">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Top Bar with Logout */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">🎀 Keechi Admin</h1>
            <p className="text-purple-200 mt-1">Manage your salon booking platform</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-2 w-fit">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
              activeTab === "overview"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
              activeTab === "bookings"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Bookings
          </button>
          <button
            onClick={() => setActiveTab("salons")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
              activeTab === "salons"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <Store className="w-5 h-5" />
            Salons
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>

              {/* Main Stats Grid */}
              {!loading && dashboardStats && (
                <div className="space-y-6">
                  {/* Bookings Section */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Bookings Analytics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <StatCard
                        title="Total Bookings"
                        value={dashboardStats.totalBookings}
                        color="from-blue-500 to-blue-600"
                        icon="📊"
                      />
                      <StatCard
                        title="Confirmed"
                        value={dashboardStats.confirmedBookings}
                        color="from-green-500 to-green-600"
                        icon="✅"
                      />
                      <StatCard
                        title="Pending"
                        value={dashboardStats.pendingBookings}
                        color="from-yellow-500 to-yellow-600"
                        icon="⏳"
                      />
                      <StatCard
                        title="Cancelled"
                        value={dashboardStats.cancelledBookings}
                        color="from-red-500 to-red-600"
                        icon="❌"
                      />
                    </div>
                  </div>

                  {/* Salons Section */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Salons Analytics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <StatCard
                        title="Total Salons"
                        value={dashboardStats.totalSalons}
                        color="from-indigo-500 to-indigo-600"
                        icon="🏪"
                      />
                      <StatCard
                        title="Active Salons"
                        value={dashboardStats.activeSalons}
                        color="from-emerald-500 to-emerald-600"
                        icon="🟢"
                      />
                      <StatCard
                        title="Inactive Salons"
                        value={dashboardStats.inactiveSalons}
                        color="from-gray-500 to-gray-600"
                        icon="⚪"
                      />
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-700 font-medium">Confirmation Rate</p>
                          <p className="text-3xl font-bold text-purple-900 mt-2">
                            {dashboardStats.totalBookings > 0
                              ? Math.round(
                                  (dashboardStats.confirmedBookings /
                                    dashboardStats.totalBookings) *
                                    100
                                )
                              : 0}
                            %
                          </p>
                        </div>
                        <span className="text-4xl">📈</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-6 border border-cyan-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-cyan-700 font-medium">Platform Activity</p>
                          <p className="text-3xl font-bold text-cyan-900 mt-2">
                            {dashboardStats.totalBookings + dashboardStats.totalSalons}
                          </p>
                          <p className="text-sm text-cyan-600 mt-1">Total Items</p>
                        </div>
                        <span className="text-4xl">⚡</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === "bookings" && <AdminBookingsList />}

          {/* Salons Tab */}
          {activeTab === "salons" && <AdminSalonsList />}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color, icon }) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white text-sm font-semibold opacity-95">{title}</p>
          <p className="text-4xl font-bold mt-2 text-white">{value}</p>
        </div>
        <span className="text-5xl opacity-30">{icon}</span>
      </div>
    </div>
  );
}
