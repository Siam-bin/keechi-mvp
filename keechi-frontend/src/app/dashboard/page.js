"use client";

import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ShopEditForm } from "@/components/ShopEditForm";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Calendar, Package, Settings, BarChart3, Plus, Check, X } from "lucide-react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

function DashboardContent() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddService, setShowAddService] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [shop, setShop] = useState(null);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [shopLoading, setShopLoading] = useState(true);
  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
  });

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get("/appointments");
        setAppointments(response.data);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setAppointmentsLoading(false);
      }
    };

    if (token) {
      fetchAppointments();
    }
  }, [token]);

  // Fetch shop details
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const response = await api.get("/shops/owner/me");
        setShop(response.data);
      } catch (error) {
        console.error("Failed to fetch shop:", error);
      } finally {
        setShopLoading(false);
      }
    };

    if (token) {
      fetchShop();
    }
  }, [token]);

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/services/owner/my-services");
        setServices(response.data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setServicesLoading(false);
      }
    };

    if (token) {
      fetchServices();
    }
  }, [token]);

  const handleAddService = async (e) => {
    e.preventDefault();

    if (!serviceForm.name || !serviceForm.price || !serviceForm.duration) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      if (editingServiceId) {
        // Update existing service
        const response = await api.patch(
          `/services/${editingServiceId}`,
          {
            name: serviceForm.name,
            description: serviceForm.description,
            price: parseFloat(serviceForm.price),
            duration: parseInt(serviceForm.duration),
          }
        );
        
        // Update in local state
        setServices(
          services.map((s) => (s.id === editingServiceId ? response.data : s))
        );
        toast.success("Service updated successfully!");
        setEditingServiceId(null);
      } else {
        // Create new service
        const response = await api.post(
          "/services",
          {
            name: serviceForm.name,
            description: serviceForm.description,
            price: parseFloat(serviceForm.price),
            duration: parseInt(serviceForm.duration),
          }
        );
        setServices([...services, response.data]);
        toast.success("Service added successfully!");
      }
      
      setServiceForm({ name: "", description: "", price: "", duration: "" });
      setShowAddService(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error(editingServiceId ? "Failed to update service" : "Failed to add service");
    }
  };

  const handleEditService = (service) => {
    setServiceForm({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
    });
    setEditingServiceId(service.id);
    setShowAddService(true);
  };

  const handleDeleteService = async (serviceId) => {
    if (!confirm("Are you sure you want to delete this service?")) {
      return;
    }

    try {
      await api.delete(`/services/${serviceId}`);
      setServices(services.filter((s) => s.id !== serviceId));
      toast.success("Service deleted successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete service");
    }
  };

  const handleCancelEdit = () => {
    setShowAddService(false);
    setEditingServiceId(null);
    setServiceForm({ name: "", description: "", price: "", duration: "" });
  };

  // Handle appointment confirmation
  const handleConfirmAppointment = async (appointmentId) => {
    try {
      await api.patch(`/appointments/${appointmentId}`, { status: "Confirmed" });
      
      // Update local state
      setAppointments(
        appointments.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: "Confirmed" } : apt
        )
      );
      
      toast.success("Appointment confirmed!");
    } catch (error) {
      console.error("Failed to confirm appointment:", error);
      toast.error("Failed to confirm appointment");
    }
  };

  // Handle appointment cancellation
  const handleCancelAppointment = async (appointmentId) => {
    try {
      await api.patch(`/appointments/${appointmentId}`, { status: "Cancelled" });
      
      // Update local state
      setAppointments(
        appointments.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: "Cancelled" } : apt
        )
      );
      
      toast.success("Appointment cancelled!");
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
      toast.error("Failed to cancel appointment");
    }
  };

  const stats = [
    {
      label: "Total Appointments",
      value: appointments.length,
      icon: Calendar,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Pending",
      value: appointments.filter((a) => a.status === "Pending").length,
      icon: Calendar,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "Confirmed",
      value: appointments.filter((a) => a.status === "Confirmed").length,
      icon: Calendar,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Services",
      value: services.length,
      icon: Package,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-charcoal-50 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-900 mb-1 sm:mb-2">Dashboard</h1>
          <p className="text-sm sm:text-base text-charcoal-600">Welcome back, {user?.name}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-lg shadow-sm border border-charcoal-100 p-3 sm:p-6"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <p className="text-xs sm:text-sm text-charcoal-600 font-medium">{stat.label}</p>
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon size={16} className="sm:w-5 sm:h-5" />
                </div>
              </div>
              <p className="text-xl sm:text-3xl font-bold text-charcoal-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 sm:gap-4 mb-6 border-b border-charcoal-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 sm:px-4 py-2 sm:py-3 font-semibold text-xs sm:text-base transition-colors whitespace-nowrap ${
              activeTab === "overview"
                ? "text-gold-500 border-b-2 border-gold-500"
                : "text-charcoal-600 hover:text-charcoal-900"
            }`}
          >
            <BarChart3 className="inline mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Overview</span>
            <span className="sm:hidden">Over</span>
          </button>
          <button
            onClick={() => setActiveTab("appointments")}
            className={`px-3 sm:px-4 py-2 sm:py-3 font-semibold text-xs sm:text-base transition-colors whitespace-nowrap ${
              activeTab === "appointments"
                ? "text-gold-500 border-b-2 border-gold-500"
                : "text-charcoal-600 hover:text-charcoal-900"
            }`}
          >
            <Calendar className="inline mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Appointments</span>
            <span className="sm:hidden">Appt</span>
          </button>
          <button
            onClick={() => setActiveTab("services")}
            className={`px-3 sm:px-4 py-2 sm:py-3 font-semibold text-xs sm:text-base transition-colors whitespace-nowrap ${
              activeTab === "services"
                ? "text-gold-500 border-b-2 border-gold-500"
                : "text-charcoal-600 hover:text-charcoal-900"
            }`}
          >
            <Package className="inline mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Services</span>
            <span className="sm:hidden">Serv</span>
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-3 sm:px-4 py-2 sm:py-3 font-semibold text-xs sm:text-base transition-colors whitespace-nowrap ${
              activeTab === "settings"
                ? "text-gold-500 border-b-2 border-gold-500"
                : "text-charcoal-600 hover:text-charcoal-900"
            }`}
          >
            <Settings className="inline mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Settings</span>
            <span className="sm:hidden">Set</span>
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-charcoal-100 p-6">
              <h2 className="text-xl font-bold text-charcoal-900 mb-4">Recent Appointments</h2>
              {appointmentsLoading ? (
                <p className="text-charcoal-600">Loading...</p>
              ) : appointments.length === 0 ? (
                <p className="text-charcoal-600">No appointments yet</p>
              ) : (
                <div className="space-y-3">
                  {appointments.slice(0, 5).map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between p-4 bg-charcoal-50 rounded-lg border border-charcoal-100"
                    >
                      <div>
                        <p className="font-semibold text-charcoal-900">{apt.service?.name}</p>
                        <p className="text-sm text-charcoal-600">{new Date(apt.dateTime).toLocaleString()}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          apt.status === "Pending" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === "appointments" && (
          <div className="bg-white rounded-lg shadow-sm border border-charcoal-100 p-3 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-charcoal-900 mb-4">All Appointments</h2>
            {appointmentsLoading ? (
              <p className="text-charcoal-600">Loading...</p>
            ) : appointments.length === 0 ? (
              <p className="text-charcoal-600">No appointments booked yet</p>
            ) : (
              <>
                {/* Mobile Card View */}
                <div className="sm:hidden space-y-3">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="border border-charcoal-200 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <p className="font-semibold text-charcoal-900 text-sm">{apt.service?.name}</p>
                          <p className="text-xs text-charcoal-600">{apt.user?.name || apt.customerName || "Guest"}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                          apt.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                          apt.status === "Confirmed" ? "bg-green-100 text-green-700" :
                          apt.status === "Completed" ? "bg-blue-100 text-blue-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                      <p className="text-xs text-charcoal-600">{new Date(apt.dateTime).toLocaleString()}</p>
                      <div className="flex gap-2 pt-2 border-t border-charcoal-100">
                        {apt.status === "Pending" && (
                          <>
                            <button
                              onClick={() => handleConfirmAppointment(apt.id)}
                              className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-green-500 text-white rounded text-xs font-semibold hover:bg-green-600 transition"
                            >
                              <Check size={12} />
                              Confirm
                            </button>
                            <button
                              onClick={() => handleCancelAppointment(apt.id)}
                              className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-red-500 text-white rounded text-xs font-semibold hover:bg-red-600 transition"
                            >
                              <X size={12} />
                              Cancel
                            </button>
                          </>
                        )}
                        {apt.status === "Confirmed" && (
                          <button
                            onClick={() => handleCancelAppointment(apt.id)}
                            className="w-full flex items-center justify-center gap-1 px-2 py-2 bg-red-500 text-white rounded text-xs font-semibold hover:bg-red-600 transition"
                          >
                            <X size={12} />
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-charcoal-200">
                        <th className="px-4 py-3 text-left font-semibold text-charcoal-700">Customer</th>
                        <th className="px-4 py-3 text-left font-semibold text-charcoal-700">Service</th>
                        <th className="px-4 py-3 text-left font-semibold text-charcoal-700">Date & Time</th>
                        <th className="px-4 py-3 text-left font-semibold text-charcoal-700">Status</th>
                        <th className="px-4 py-3 text-left font-semibold text-charcoal-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((apt) => (
                        <tr key={apt.id} className="border-b border-charcoal-100 hover:bg-charcoal-50">
                          <td className="px-4 py-3">{apt.user?.name || apt.customerName || "Guest"}</td>
                          <td className="px-4 py-3">{apt.service?.name}</td>
                          <td className="px-4 py-3">{new Date(apt.dateTime).toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              apt.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                              apt.status === "Confirmed" ? "bg-green-100 text-green-700" :
                              apt.status === "Completed" ? "bg-blue-100 text-blue-700" :
                              "bg-red-100 text-red-700"
                            }`}>
                              {apt.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              {apt.status === "Pending" && (
                                <>
                                  <button
                                    onClick={() => handleConfirmAppointment(apt.id)}
                                    className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded text-xs font-semibold hover:bg-green-600 transition"
                                  >
                                    <Check size={14} />
                                    Confirm
                                  </button>
                                  <button
                                    onClick={() => handleCancelAppointment(apt.id)}
                                    className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded text-xs font-semibold hover:bg-red-600 transition"
                                  >
                                    <X size={14} />
                                    Cancel
                                  </button>
                                </>
                              )}
                              {apt.status === "Confirmed" && (
                                <button
                                  onClick={() => handleCancelAppointment(apt.id)}
                                  className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded text-xs font-semibold hover:bg-red-600 transition"
                                >
                                  <X size={14} />
                                  Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-lg sm:text-xl font-bold text-charcoal-900">Your Services</h2>
              {!showAddService && (
                <button
                  onClick={() => {
                    setEditingServiceId(null);
                    setServiceForm({ name: "", description: "", price: "", duration: "" });
                    setShowAddService(true);
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gold-500 text-white font-semibold rounded-lg hover:bg-gold-600 transition-colors text-sm"
                >
                  <Plus size={18} />
                  Add Service
                </button>
              )}
            </div>

            {showAddService && (
              <form onSubmit={handleAddService} className="bg-white rounded-lg shadow-sm border border-charcoal-100 p-3 sm:p-6 space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-charcoal-900">
                  {editingServiceId ? "Edit Service" : "Add New Service"}
                </h3>
                <input
                  type="text"
                  placeholder="Service Name"
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 text-sm border border-charcoal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
                <textarea
                  placeholder="Description"
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 text-sm border border-charcoal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400"
                  rows="3"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={serviceForm.price}
                  onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 text-sm border border-charcoal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400"
                  step="0.01"
                />
                <input
                  type="number"
                  placeholder="Duration (minutes)"
                  value={serviceForm.duration}
                  onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 text-sm border border-charcoal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    type="submit"
                    className="flex-1 px-3 sm:px-4 py-2 bg-gold-500 text-white font-semibold rounded-lg hover:bg-gold-600 transition-colors text-sm"
                  >
                    {editingServiceId ? "Update Service" : "Add Service"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 px-3 sm:px-4 py-2 bg-charcoal-200 text-charcoal-900 font-semibold rounded-lg hover:bg-charcoal-300 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {servicesLoading ? (
              <p className="text-charcoal-600 text-sm">Loading...</p>
            ) : services.length === 0 ? (
              <p className="text-charcoal-600 text-sm">No services added yet</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="bg-white rounded-lg shadow-sm border border-charcoal-100 p-3 sm:p-6 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-bold text-charcoal-900 mb-2 text-sm sm:text-base">{service.name}</h3>
                    <p className="text-charcoal-600 text-xs sm:text-sm mb-3 sm:mb-4">{service.description}</p>
                    <div className="flex justify-between items-center mb-3 sm:mb-4">
                      <div>
                        <p className="text-base sm:text-lg font-bold text-gold-500">৳{parseFloat(service.price).toFixed(2)}</p>
                        <p className="text-xs sm:text-sm text-charcoal-600">{service.duration} min</p>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-3 sm:pt-4 border-t border-charcoal-100">
                      <button
                        onClick={() => handleEditService(service)}
                        className="flex-1 px-2 sm:px-3 py-1 sm:py-2 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition-colors text-xs sm:text-sm"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="flex-1 px-2 sm:px-3 py-1 sm:py-2 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition-colors text-xs sm:text-sm"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div>
            {shopLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
              </div>
            ) : shop ? (
              <ShopEditForm 
                shopId={shop.id} 
                onSave={(updatedShop) => {
                  setShop(updatedShop);
                  toast.success("Shop settings updated!");
                }}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-charcoal-100 p-6 text-center">
                <p className="text-charcoal-600 mb-4">No shop found. Please create a shop first.</p>
                <Link href="/shops/create" className="text-gold-500 hover:text-gold-600 font-semibold">
                  Create Shop →
                </Link>
              </div>
            )}
          </div>
        )}
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
