"use client";

// Force rebuild - fixing layout
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ShopEditForm } from "@/components/ShopEditForm";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { NextAppointmentCard } from "@/components/dashboard/NextAppointmentCard";
import { RepeatCustomersCard } from "@/components/dashboard/RepeatCustomersCard";
import { TeamMemberManager } from "@/components/dashboard/TeamMemberManager";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Calendar, Package, Settings, BarChart3, Plus, Check, X, Users, DollarSign, Clock, TrendingUp } from "lucide-react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

function DashboardContent() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Data States
  const [dashboardData, setDashboardData] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [shop, setShop] = useState(null);

  // Loading States
  const [loading, setLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(false);

  // Service Form State
  const [showAddService, setShowAddService] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
  });

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashboardRes, revenueRes, appointmentsRes, shopRes] = await Promise.all([
          api.get("/analytics/dashboard"),
          api.get("/analytics/revenue"),
          api.get("/appointments"),
          api.get("/shops/owner/me")
        ]);

        setDashboardData(dashboardRes.data);
        setRevenueData(revenueRes.data);
        setAppointments(appointmentsRes.data);
        setShop(shopRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  // Fetch services when tab changes
  useEffect(() => {
    if (activeTab === "services" && services.length === 0) {
      const fetchServices = async () => {
        try {
          setServicesLoading(true);
          const response = await api.get("/services/owner/my-services");
          setServices(response.data);
        } catch (error) {
          console.error("Failed to fetch services:", error);
        } finally {
          setServicesLoading(false);
        }
      };
      fetchServices();
    }
  }, [activeTab, token]);

  // --- Service Management Handlers ---

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!serviceForm.name || !serviceForm.price || !serviceForm.duration) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      if (editingServiceId) {
        const response = await api.patch(`/services/${editingServiceId}`, {
          name: serviceForm.name,
          description: serviceForm.description,
          price: parseFloat(serviceForm.price),
          duration: parseInt(serviceForm.duration),
        });
        setServices(services.map((s) => (s.id === editingServiceId ? response.data : s)));
        toast.success("Service updated successfully!");
        setEditingServiceId(null);
      } else {
        const response = await api.post("/services", {
          name: serviceForm.name,
          description: serviceForm.description,
          price: parseFloat(serviceForm.price),
          duration: parseInt(serviceForm.duration),
        });
        setServices([...services, response.data]);
        toast.success("Service added successfully!");
      }
      setServiceForm({ name: "", description: "", price: "", duration: "" });
      setShowAddService(false);
    } catch (error) {
      toast.error(editingServiceId ? "Failed to update service" : "Failed to add service");
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await api.delete(`/services/${serviceId}`);
      setServices(services.filter((s) => s.id !== serviceId));
      toast.success("Service deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete service");
    }
  };

  // --- Appointment Handlers ---

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/appointments/${id}`, { status });
      setAppointments(appointments.map(a => a.id === id ? { ...a, status } : a));
      toast.success(`Appointment ${status}`);

      // Refresh dashboard stats
      const dashboardRes = await api.get("/analytics/dashboard");
      setDashboardData(dashboardRes.data);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal-50 pb-20 sm:pb-10 mb-10">
      {/* Mobile Header */}
      <div className="bg-white sticky top-0 z-20 px-4 py-3 shadow-sm sm:hidden flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center text-white font-bold">K</div>
          <span className="font-bold text-charcoal-900">Dashboard</span>
        </div>
        <div className="w-8 h-8 bg-charcoal-100 rounded-full flex items-center justify-center">
          <Users size={16} className="text-charcoal-600" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Desktop Header */}
        <div className="hidden sm:flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-charcoal-900">Dashboard</h1>
            <p className="text-charcoal-600 mt-1">Welcome back, {user?.name} 👋</p>
          </div>
          <div className="flex gap-3">
            <Link href="/shops/owner/me" className="px-4 py-2 bg-white border border-charcoal-200 rounded-lg text-charcoal-700 font-medium hover:bg-charcoal-50 transition">
              View Shop Page
            </Link>
            <button className="px-4 py-2 bg-gold-500 text-white rounded-lg font-medium hover:bg-gold-600 transition shadow-lg shadow-gold-500/30">
              + New Booking
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Scrollable on Mobile) */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "appointments", label: "Appointments", icon: Calendar },
            { id: "services", label: "Services", icon: Package },
            { id: "team", label: "Team", icon: Users },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${activeTab === tab.id
                ? "bg-charcoal-900 text-white shadow-lg"
                : "bg-white text-charcoal-600 hover:bg-charcoal-100"
                }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- OVERVIEW TAB --- */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Top Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                title="Today's Bookings"
                value={dashboardData?.today?.total || 0}
                icon={Calendar}
                color="blue"
                trend="up"
                trendValue="12%"
              />
              <StatsCard
                title="Revenue (Month)"
                value={`৳${dashboardData?.performance?.monthlyRevenue || 0}`}
                icon={DollarSign}
                color="gold"
                trend="up"
                trendValue="8%"
              />
              <StatsCard
                title="Completed"
                value={dashboardData?.today?.completed || 0}
                icon={Check}
                color="teal"
              />
              <StatsCard
                title="Cancelled"
                value={dashboardData?.today?.cancelled || 0}
                icon={X}
                color="purple"
              />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Chart Section */}
              <div className="lg:col-span-2 space-y-6">

                {/* Recent Activity / Appointments List - MOVED UP */}
                <div className="bg-white rounded-2xl shadow-sm border border-charcoal-100 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-charcoal-900">Recent Appointments</h3>
                    <button onClick={() => setActiveTab("appointments")} className="text-gold-500 text-sm font-semibold hover:underline">View All</button>
                  </div>
                  <div className="space-y-4">
                    {appointments.slice(0, 5).map((apt) => (
                      <div key={apt.id} className="flex items-center justify-between p-4 bg-charcoal-50 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg">
                            👤
                          </div>
                          <div>
                            <p className="font-bold text-charcoal-900">{apt.user?.name || apt.customerName || "Guest"}</p>
                            <p className="text-xs text-charcoal-500">{apt.service?.name} • {new Date(apt.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${apt.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                          apt.status === "Confirmed" ? "bg-green-100 text-green-700" :
                            apt.status === "Completed" ? "bg-blue-100 text-blue-700" :
                              "bg-red-100 text-red-700"
                          }`}>
                          {apt.status}
                        </span>
                      </div>
                    ))}
                    {appointments.length === 0 && (
                      <p className="text-center text-charcoal-500 py-4">No appointments found.</p>
                    )}
                  </div>
                </div>

                <RevenueChart data={revenueData} />
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                <RepeatCustomersCard data={dashboardData?.repeatCustomers} />

                <NextAppointmentCard appointment={dashboardData?.nextAppointment} />

                {/* Quick Actions or Mini Stats */}
                <div className="bg-white rounded-2xl shadow-sm border border-charcoal-100 p-6">
                  <h3 className="text-lg font-bold text-charcoal-900 mb-4">Shop Performance</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-charcoal-600">Rating</span>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-charcoal-900">{dashboardData?.performance?.rating}</span>
                        <span className="text-gold-500">★</span>
                      </div>
                    </div>
                    <div className="w-full bg-charcoal-100 rounded-full h-2">
                      <div className="bg-gold-500 h-2 rounded-full" style={{ width: `${(dashboardData?.performance?.rating / 5) * 100}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-charcoal-500">
                      <span>Based on {dashboardData?.performance?.reviewCount} reviews</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- APPOINTMENTS TAB --- */}
        {activeTab === "appointments" && (
          <div className="bg-white rounded-2xl shadow-sm border border-charcoal-100 overflow-hidden">
            <div className="p-6 border-b border-charcoal-100">
              <h2 className="text-xl font-bold text-charcoal-900">All Appointments</h2>
            </div>
            <div className="divide-y divide-charcoal-100">
              {appointments.map((apt) => (
                <div key={apt.id} className="p-4 sm:p-6 hover:bg-charcoal-50 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 font-bold text-lg">
                        {new Date(apt.dateTime).getDate()}
                      </div>
                      <div>
                        <h3 className="font-bold text-charcoal-900">{apt.service?.name}</h3>
                        <p className="text-sm text-charcoal-600">
                          {new Date(apt.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {apt.user?.name || apt.customerName || "Guest"}
                        </p>
                        {apt.notes && <p className="text-xs text-charcoal-400 mt-1">"{apt.notes}"</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${apt.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                        apt.status === "Confirmed" ? "bg-green-100 text-green-700" :
                          apt.status === "Completed" ? "bg-blue-100 text-blue-700" :
                            "bg-red-100 text-red-700"
                        }`}>
                        {apt.status}
                      </span>

                      {apt.status === "Pending" && (
                        <>
                          <button onClick={() => handleUpdateStatus(apt.id, "Confirmed")} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"><Check size={18} /></button>
                          <button onClick={() => handleUpdateStatus(apt.id, "Cancelled")} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"><X size={18} /></button>
                        </>
                      )}
                      {apt.status === "Confirmed" && (
                        <button onClick={() => handleUpdateStatus(apt.id, "Completed")} className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-200">Complete</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {appointments.length === 0 && (
                <div className="p-8 text-center text-charcoal-500">No appointments found.</div>
              )}
            </div>
          </div>
        )}

        {/* --- SERVICES TAB --- */}
        {activeTab === "services" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-charcoal-900">Service Menu</h2>
              <button
                onClick={() => {
                  setEditingServiceId(null);
                  setServiceForm({ name: "", description: "", price: "", duration: "" });
                  setShowAddService(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-white rounded-lg font-semibold hover:bg-gold-600 transition"
              >
                <Plus size={18} /> Add Service
              </button>
            </div>

            {showAddService && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gold-100 animate-in fade-in slide-in-from-top-4">
                <h3 className="font-bold text-lg mb-4">{editingServiceId ? "Edit Service" : "New Service"}</h3>
                <form onSubmit={handleAddService} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input
                      placeholder="Service Name"
                      value={serviceForm.name}
                      onChange={e => setServiceForm({ ...serviceForm, name: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
                    />
                    <input
                      placeholder="Price (৳)"
                      type="number"
                      value={serviceForm.price}
                      onChange={e => setServiceForm({ ...serviceForm, price: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
                    />
                    <input
                      placeholder="Duration (min)"
                      type="number"
                      value={serviceForm.duration}
                      onChange={e => setServiceForm({ ...serviceForm, duration: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
                    />
                  </div>
                  <textarea
                    placeholder="Description"
                    value={serviceForm.description}
                    onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
                    rows="2"
                  />
                  <div className="flex gap-3 justify-end">
                    <button type="button" onClick={() => setShowAddService(false)} className="px-4 py-2 text-charcoal-600 hover:bg-charcoal-50 rounded-lg">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-gold-500 text-white rounded-lg font-bold hover:bg-gold-600">Save</button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <div key={service.id} className="bg-white p-6 rounded-2xl shadow-sm border border-charcoal-100 hover:shadow-md transition group">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-charcoal-900">{service.name}</h3>
                    <span className="font-bold text-gold-600">৳{service.price}</span>
                  </div>
                  <p className="text-sm text-charcoal-600 mb-4 line-clamp-2">{service.description}</p>
                  <div className="flex items-center justify-between text-sm text-charcoal-500">
                    <div className="flex items-center gap-1"><Clock size={14} /> {service.duration} min</div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => {
                        setServiceForm({ name: service.name, description: service.description, price: service.price, duration: service.duration });
                        setEditingServiceId(service.id);
                        setShowAddService(true);
                      }} className="text-blue-600 hover:underline">Edit</button>
                      <button onClick={() => handleDeleteService(service.id)} className="text-red-600 hover:underline">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TEAM TAB --- */}
        {activeTab === "team" && (
          <TeamMemberManager />
        )}

        {/* --- SETTINGS TAB --- */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-2xl shadow-sm border border-charcoal-100 p-6">
            <h2 className="text-xl font-bold text-charcoal-900 mb-6">Shop Settings</h2>
            {shop ? (
              <ShopEditForm
                shopId={shop.id}
                onSave={(updatedShop) => {
                  setShop(updatedShop);
                  toast.success("Shop settings updated!");
                }}
              />
            ) : (
              <p>Loading shop details...</p>
            )}
          </div>
        )}

        {/* Bottom Spacer for Mobile */}
        <div className="h-40 sm:h-20"></div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute requiredRole="shopOwner">
      <DashboardContent />
    </ProtectedRoute>
  );
}
