"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Clock, Calendar } from "lucide-react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export function SlotPickerModal({ cartItems, shopId, onClose, onConfirm }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());

  // Initialize with today's date
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setSelectedDate(today);
    setCurrentWeekStart(today);
    fetchSlots(today);
  }, []);

  // Fetch available slots for selected date
  const fetchSlots = async (date) => {
    try {
      setLoading(true);
      setError(null);
      const dateStr = date.toISOString().split("T")[0];
      const firstItem = cartItems[0];
      
      const response = await api.get(
        `/availability?shopId=${shopId}&serviceId=${firstItem.serviceId}&date=${dateStr}`
      );
      setSlots(response.data.slots || []);
    } catch (err) {
      setError("Failed to load available slots");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    fetchSlots(date);
  };

  // Generate next 7 days from current week start
  const generateDays = () => {
    const days = [];
    const start = new Date(currentWeekStart);
    start.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  // Move to previous week
  const goToPreviousWeek = () => {
    const prev = new Date(currentWeekStart);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeekStart(prev);
  };

  // Move to next week
  const goToNextWeek = () => {
    const next = new Date(currentWeekStart);
    next.setDate(next.getDate() + 7);
    setCurrentWeekStart(next);
  };

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Check if date is selected
  const isDateSelected = (date) => {
    return (
      selectedDate &&
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Format date for display
  const formatDateDisplay = (date) => {
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  // Handle confirmation
  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) {
      setError("Please select both date and time");
      return;
    }

    // Create a proper ISO string: YYYY-MM-DDTHH:mm:ss
    // selectedTime is already in HH:mm format
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const dateTimeStr = `${year}-${month}-${day}T${selectedTime}:00`;

    onConfirm({
      dateTime: dateTimeStr,
      date: selectedDate,
      time: selectedTime,
    });
  };

  const days = generateDays();
  const availableSlots = slots.filter((s) => s.available);

  // Calculate total price and duration for all items in cart
  const totalPrice = cartItems.reduce((sum, item) => sum + item.servicePrice * item.quantity, 0);
  const totalDuration = cartItems.reduce((sum, item) => sum + item.serviceDuration * item.quantity, 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-charcoal-800 to-charcoal-900 p-6 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-white">{itemCount} Service(s) - Book Now</h3>
            <p className="text-charcoal-200 text-sm">
              {totalDuration} min • ৳{totalPrice.toFixed(0)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-charcoal-700 p-2 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Cart Items Summary */}
          <div className="bg-charcoal-50 rounded-lg p-4 space-y-2">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <span className="text-charcoal-700">
                  {item.serviceName} × {item.quantity}
                </span>
                <span className="font-semibold text-charcoal-900">
                  ৳{(item.servicePrice * item.quantity).toFixed(0)}
                </span>
              </div>
            ))}
          </div>

          {/* Date Picker */}
          <div>
            <h4 className="font-semibold text-charcoal-900 mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-gold-500" />
              Select Date
            </h4>

            {/* Week Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={goToPreviousWeek}
                className="p-2 hover:bg-charcoal-100 rounded-lg transition"
              >
                <ChevronLeft size={20} className="text-charcoal-600" />
              </button>

              <span className="text-sm font-semibold text-charcoal-700">
                {currentWeekStart.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>

              <button
                onClick={goToNextWeek}
                className="p-2 hover:bg-charcoal-100 rounded-lg transition"
              >
                <ChevronRight size={20} className="text-charcoal-600" />
              </button>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day) => (
                <button
                  key={day.toISOString()}
                  onClick={() => handleDateSelect(day)}
                  className={`py-2 px-3 rounded-lg font-medium text-sm transition ${
                    isDateSelected(day)
                      ? "bg-gold-500 text-white"
                      : isToday(day)
                      ? "bg-charcoal-100 text-charcoal-900 border-2 border-gold-400"
                      : "bg-charcoal-50 text-charcoal-700 hover:bg-charcoal-100"
                  }`}
                >
                  <div className="text-xs">
                    {day.toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                  <div>{day.getDate()}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Time Picker */}
          {selectedDate && (
            <div>
              <h4 className="font-semibold text-charcoal-900 mb-4 flex items-center gap-2">
                <Clock size={18} className="text-gold-500" />
                Select Time - {formatDateDisplay(selectedDate)}
              </h4>

              {loading ? (
                <div className="text-center py-8 text-charcoal-500">Loading available times...</div>
              ) : error ? (
                <div className="text-center py-8 text-red-600">{error}</div>
              ) : availableSlots.length === 0 ? (
                <div className="text-center py-8 text-charcoal-500">
                  No available slots for this date
                </div>
              ) : (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto">
                  {slots.map((slot, idx) => (
                    <button
                      key={idx}
                      onClick={() => slot.available && setSelectedTime(slot.timeString)}
                      disabled={!slot.available}
                      className={`py-2 px-2 rounded-lg font-medium text-sm transition ${
                        selectedTime === slot.timeString
                          ? "bg-gold-500 text-white"
                          : slot.available
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-charcoal-100 text-charcoal-400 cursor-not-allowed"
                      }`}
                    >
                      {slot.timeString}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Summary */}
          {selectedDate && selectedTime && (
            <div className="bg-gold-50 border border-gold-200 rounded-lg p-4">
              <p className="text-sm text-charcoal-700">
                <span className="font-semibold">Booking Summary:</span> {itemCount} service(s) on{" "}
                {formatDateDisplay(selectedDate)} at {selectedTime} ({totalDuration} min) •{" "}
                <span className="font-bold text-gold-600">৳{totalPrice.toFixed(0)}</span>
              </p>
            </div>
          )}

          {/* Error Display */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-charcoal-300 text-charcoal-700 rounded-lg font-semibold hover:bg-charcoal-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedDate || !selectedTime}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold text-white transition ${
                selectedDate && selectedTime
                  ? "bg-gold-500 hover:bg-gold-600"
                  : "bg-charcoal-300 cursor-not-allowed"
              }`}
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
