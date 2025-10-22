"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CheckCircle, Clock, MapPin, DollarSign, Phone, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const appointmentId = searchParams.get("id");
  const { user: authUser, loading: authLoading } = useAuth();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect shop owners to dashboard
  useEffect(() => {
    if (!authLoading && authUser?.role === "shopOwner") {
      router.push("/dashboard");
    }
  }, [authUser, authLoading, router]);

  useEffect(() => {
    if (!appointmentId) {
      setError("No booking ID provided");
      setLoading(false);
      return;
    }

    const fetchAppointment = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/appointments/${appointmentId}`);
        setAppointment(response.data);
      } catch (err) {
        setError("Failed to load booking details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gold-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500 mx-auto mb-4"></div>
          <p className="text-charcoal-600">Loading your booking...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gold-50 to-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-red-50 rounded-lg p-6 mb-6 border border-red-200">
            <p className="text-red-700 font-semibold mb-2">Unable to Load Booking</p>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <Link
              href="/profile"
              className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Back to Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gold-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-charcoal-600">Booking not found</p>
        </div>
      </div>
    );
  }

  const appointmentDate = new Date(appointment.dateTime);
  const confirmationNumber = `KEECHI-${appointment.id.toString().padStart(6, "0")}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gold-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <CheckCircle size={80} className="text-green-500 animate-bounce" />
          </div>
          <h1 className="text-4xl font-bold text-charcoal-900 mb-3">Booking Confirmed! 🎉</h1>
          <p className="text-charcoal-600 text-lg">Your appointment has been successfully booked</p>
        </div>

        {/* Confirmation Number */}
        <div className="bg-gold-100 border-2 border-gold-500 rounded-lg p-6 mb-8 text-center">
          <p className="text-charcoal-600 text-sm mb-2">Confirmation Number</p>
          <p className="text-3xl font-bold text-gold-600 font-mono">{confirmationNumber}</p>
          <p className="text-charcoal-600 text-xs mt-2">Save this for your records</p>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-lg shadow-lg border border-charcoal-200 overflow-hidden mb-8">
          {/* Shop Info */}
          <div className="bg-gradient-to-r from-gold-500 to-gold-600 p-6 text-charcoal-900">
            <h2 className="text-2xl font-bold mb-2">{appointment.shop?.name || "Salon"}</h2>
            <div className="flex items-center gap-2 text-charcoal-800">
              <MapPin size={18} />
              <p>{appointment.shop?.address || "Address not available"}</p>
            </div>
            <div className="flex items-center gap-2 text-charcoal-800 mt-2">
              <Phone size={18} />
              <p>{appointment.shop?.phone || "Contact not available"}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Service */}
              <div className="border-l-4 border-gold-500 pl-6">
                <p className="text-charcoal-600 text-sm font-semibold mb-1">Service</p>
                <p className="text-2xl font-bold text-charcoal-900">{appointment.service?.name}</p>
                {appointment.service?.description && (
                  <p className="text-charcoal-600 text-sm mt-2">{appointment.service.description}</p>
                )}
              </div>

              {/* Date & Time */}
              <div className="border-l-4 border-gold-500 pl-6">
                <p className="text-charcoal-600 text-sm font-semibold mb-2">Date & Time</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-gold-500" />
                    <span className="text-lg font-semibold text-charcoal-900">
                      {appointmentDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-gold-500" />
                    <span className="text-lg font-semibold text-charcoal-900">
                      {appointmentDate.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div className="border-l-4 border-gold-500 pl-6">
                <p className="text-charcoal-600 text-sm font-semibold mb-1">Duration</p>
                <p className="text-2xl font-bold text-charcoal-900">
                  {appointment.service?.duration} min
                </p>
              </div>

              {/* Price */}
              <div className="border-l-4 border-gold-500 pl-6">
                <p className="text-charcoal-600 text-sm font-semibold mb-1">Total Price</p>
                <div className="flex items-center gap-2">
                  <DollarSign size={24} className="text-gold-500" />
                  <p className="text-3xl font-bold text-gold-600">
                    ৳{appointment.service?.price}
                  </p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800">
                <span className="font-semibold">Status:</span> Your appointment is confirmed and
                the salon has been notified.
              </p>
            </div>

            {/* Notes */}
            {appointment.notes && (
              <div className="bg-charcoal-50 border border-charcoal-200 rounded-lg p-4">
                <p className="text-charcoal-700 text-sm">
                  <span className="font-semibold">Your Notes:</span> {appointment.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* What to Expect */}
        <div className="bg-white rounded-lg shadow-lg border border-charcoal-200 p-8 mb-8">
          <h3 className="text-xl font-bold text-charcoal-900 mb-6">What to Expect</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-gold-500 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <p className="font-semibold text-charcoal-900">Confirmation Message</p>
                <p className="text-charcoal-600 text-sm">
                  You'll receive an SMS/email confirmation with your booking details
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-gold-500 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <p className="font-semibold text-charcoal-900">Arrive 5-10 Minutes Early</p>
                <p className="text-charcoal-600 text-sm">
                  Please arrive a few minutes before your appointment time
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-gold-500 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <p className="font-semibold text-charcoal-900">Payment at Salon</p>
                <p className="text-charcoal-600 text-sm">
                  Payment will be collected at the salon on the day of your appointment
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/profile"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gold-500 text-white rounded-lg font-semibold hover:bg-gold-600 transition"
          >
            View My Bookings
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/salons"
            className="flex items-center justify-center text-center px-6 py-3 border-2 border-charcoal-300 text-charcoal-700 rounded-lg font-semibold hover:bg-charcoal-50 transition"
          >
            Browse More Salons
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-12 text-center text-charcoal-600">
          <p className="mb-2">Need to make changes?</p>
          <p className="text-sm">
            Contact the salon directly or visit your profile to manage your booking
          </p>
        </div>
      </div>
    </div>
  );
}
