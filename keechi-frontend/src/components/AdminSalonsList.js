// src/components/AdminSalonsList.js - Salons Management
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/context/AdminContext";
import axios from "axios";
import { Loader, Search, MapPin, Phone, Clock, Users } from "lucide-react";
import toast from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AdminSalonsList() {
  const router = useRouter();
  const { getAuthHeaders, logout } = useAdmin();
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSalons();
  }, []);

  const fetchSalons = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();
      
      const response = await axios.get(`${API_BASE}/salons`, {
        headers,
      });
      setSalons(response.data || []);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        logout();
        router.push("/admin");
      } else {
        setError("Failed to load salons");
        toast.error("Failed to load salons");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSalons = salons.filter((salon) =>
    salon.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    salon.area?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: salons.length,
    active: salons.filter((s) => s.active).length,
    reviews: salons.reduce((sum, s) => sum + (s.reviews?.length || 0), 0),
    avgRating:
      salons.length > 0
        ? (
            salons.reduce((sum, s) => sum + (s.rating || 0), 0) / salons.length
          ).toFixed(1)
        : "N/A",
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="w-8 h-8 animate-spin text-[#2B7A78]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
          <div className="text-3xl font-bold text-indigo-600">{stats.total}</div>
          <p className="text-indigo-700 text-sm font-medium mt-1">Total Salons</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
          <div className="text-3xl font-bold text-emerald-600">{stats.active}</div>
          <p className="text-emerald-700 text-sm font-medium mt-1">Active</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="text-3xl font-bold text-purple-600">{stats.reviews}</div>
          <p className="text-purple-700 text-sm font-medium mt-1">Total Reviews</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
          <div className="text-3xl font-bold text-orange-600">{stats.avgRating}</div>
          <p className="text-orange-700 text-sm font-medium mt-1">Avg Rating</p>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by salon name or area..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2B7A78]"
        />
      </div>

      {/* Salons Grid */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {filteredSalons.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No salons found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSalons.map((salon) => (
            <div
              key={salon.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
            >
              {/* Salon Image */}
              {salon.coverImage && (
                <div className="relative h-40 bg-gray-200">
                  <img
                    src={salon.coverImage}
                    alt={salon.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        salon.active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {salon.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              )}

              {/* Salon Info */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {salon.name}
                </h3>

                {/* Rating */}
                {salon.rating && (
                  <div className="flex items-center gap-1 mb-3">
                    <span className="text-sm font-semibold text-gray-700">
                      ⭐ {salon.rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({salon.reviews?.length || 0} reviews)
                    </span>
                  </div>
                )}

                {/* Details */}
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  {salon.area && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#2B7A78]" />
                      <span>{salon.area}</span>
                    </div>
                  )}
                  {salon.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#2B7A78]" />
                      <span>{salon.phone}</span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <button className="w-full py-2 bg-[#2B7A78] hover:bg-[#1f5a57] text-white rounded-lg font-medium transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
