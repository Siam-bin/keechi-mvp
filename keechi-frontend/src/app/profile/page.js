"use client";

import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";
import { Calendar, MapPin, User, Mail, Phone, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

function ProfileContent() {
  const { user, token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/appointments");
      setAppointments(response.data);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
      toast.error("Failed to load appointments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAppointments();
    }
  }, [token, refetchTrigger]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-charcoal-100 p-8 mb-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-charcoal-900 mb-2">My Profile</h1>
            <p className="text-charcoal-600">Manage your account and appointments</p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-500 rounded-2xl flex items-center justify-center text-white text-2xl">
            {user?.name?.charAt(0)}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="text-sm text-charcoal-600 font-medium">Full Name</label>
            <div className="flex items-center gap-3 mt-2">
              <User size={20} className="text-gold-500" />
              <p className="text-charcoal-900 font-semibold">{user?.name}</p>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-charcoal-600 font-medium">Email</label>
            <div className="flex items-center gap-3 mt-2">
              <Mail size={20} className="text-gold-500" />
              <p className="text-charcoal-900 font-semibold">{user?.email}</p>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-charcoal-600 font-medium">Phone</label>
            <div className="flex items-center gap-3 mt-2">
              <Phone size={20} className="text-gold-500" />
              <p className="text-charcoal-900 font-semibold">{user?.phone || "Not added"}</p>
            </div>
          </div>

          {/* Member Since */}
          <div>
            <label className="text-sm text-charcoal-600 font-medium">Member Since</label>
            <div className="flex items-center gap-3 mt-2">
              <Calendar size={20} className="text-gold-500" />
              <p className="text-charcoal-900 font-semibold">
                {new Date(user?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-charcoal-900">My Appointments</h2>
          <div className="flex gap-2">
            <button
              onClick={() => fetchAppointments()}
              className="px-4 py-2 border border-charcoal-300 text-charcoal-700 font-semibold rounded-lg hover:bg-charcoal-50 transition-colors flex items-center gap-2"
              disabled={isLoading}
            >
              <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
              Refresh
            </button>
            <Link
              href="/salons"
              className="px-4 py-2 bg-gold-500 text-white font-semibold rounded-lg hover:bg-gold-600 transition-colors"
            >
              Book New
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-gold-200 border-t-gold-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-charcoal-600">Loading appointments...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-charcoal-100 p-12 text-center">
            <Calendar size={48} className="mx-auto text-charcoal-300 mb-4" />
            <h3 className="text-xl font-semibold text-charcoal-900 mb-2">No Appointments Yet</h3>
            <p className="text-charcoal-600 mb-6">You haven't booked any appointments yet.</p>
            <Link
              href="/salons"
              className="inline-block px-6 py-3 bg-gold-500 text-white font-semibold rounded-lg hover:bg-gold-600 transition-colors"
            >
              Browse Salons
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-lg shadow-sm border border-charcoal-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-charcoal-600 font-medium">Shop</p>
                    <p className="text-lg font-semibold text-charcoal-900">
                      {appointment.shop?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-charcoal-600 font-medium">Service</p>
                    <p className="text-lg font-semibold text-charcoal-900">
                      {appointment.service?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-charcoal-600 font-medium">Date & Time</p>
                    <p className="text-lg font-semibold text-charcoal-900">
                      {new Date(appointment.dateTime).toLocaleDateString()}{" "}
                      {new Date(appointment.dateTime).toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-charcoal-600 font-medium">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        appointment.status === "Confirmed"
                          ? "bg-green-100 text-green-700"
                          : appointment.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : appointment.status === "Completed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute requiredRole="user">
      <ProfileContent />
    </ProtectedRoute>
  );
}
