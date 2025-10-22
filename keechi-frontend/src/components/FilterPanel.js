// src/components/FilterPanel.js - Salon Filter Component
"use client";

import { ChevronDown, X } from "lucide-react";
import { useState } from "react";

const AREAS = [
  "Banani",
  "Dhanmondi",
  "Uttara",
  "Gulshan",
  "Motijheel",
  "Baridhara",
  "Mirpur",
  "Mohakhali",
  "Tejgaon",
];

const CATEGORIES = [
  { id: "hair", name: "Hair", emoji: "✂️" },
  { id: "makeup", name: "Makeup", emoji: "💄" },
  { id: "skin", name: "Skin Care", emoji: "💆" },
  { id: "spa", name: "Spa", emoji: "🧖" },
];

const RATINGS = [
  { value: "5", label: "5 Stars" },
  { value: "4", label: "4+ Stars" },
  { value: "3", label: "3+ Stars" },
];

export default function FilterPanel({
  onFilterChange,
  defaultFilters = {},
}) {
  const [filters, setFilters] = useState({
    area: defaultFilters.area || "",
    category: defaultFilters.category || "",
    rating: defaultFilters.rating || "",
    priceRange: defaultFilters.priceRange || "all",
    open_now: defaultFilters.open_now || false,
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const emptyFilters = {
      area: "",
      category: "",
      rating: "",
      priceRange: "all",
      open_now: false,
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some(v => v && v !== "all" && v !== false);

  return (
    <div className="bg-white rounded-2xl border border-charcoal-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-charcoal-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-sm text-gold-600 hover:text-gold-700 font-semibold flex items-center gap-1"
          >
            <X size={16} />
            Clear
          </button>
        )}
      </div>

      {/* Mobile Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="md:hidden w-full py-2 px-4 bg-gold-50 text-gold-700 rounded-lg font-semibold flex items-center justify-between mb-4"
      >
        Show Filters
        <ChevronDown
          size={20}
          className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>

      {/* Filters - Desktop always visible, Mobile toggleable */}
      <div className={`space-y-6 ${!isExpanded && "hidden md:block"}`}>
        {/* Area */}
        <div>
          <label className="block text-sm font-semibold text-charcoal-800 mb-3">
            Area
          </label>
          <select
            value={filters.area}
            onChange={(e) => handleFilterChange("area", e.target.value)}
            className="input-field w-full"
          >
            <option value="">All Areas</option>
            {AREAS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-charcoal-800 mb-3">
            Service Type
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="category"
                value=""
                checked={filters.category === ""}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-charcoal-700">All Services</span>
            </label>
            {CATEGORIES.map((cat) => (
              <label key={cat.id} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value={cat.id}
                  checked={filters.category === cat.id}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-lg">{cat.emoji}</span>
                <span className="text-charcoal-700">{cat.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-semibold text-charcoal-800 mb-3">
            Minimum Rating
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="rating"
                value=""
                checked={filters.rating === ""}
                onChange={(e) => handleFilterChange("rating", e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-charcoal-700">All Ratings</span>
            </label>
            {RATINGS.map((rating) => (
              <label key={rating.value} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  value={rating.value}
                  checked={filters.rating === rating.value}
                  onChange={(e) => handleFilterChange("rating", e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-charcoal-700">{rating.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.open_now}
              onChange={(e) => handleFilterChange("open_now", e.target.checked)}
              className="w-4 h-4 rounded accent-gold-400"
            />
            <span className="text-charcoal-700 font-medium">Open Now</span>
          </label>
        </div>
      </div>
    </div>
  );
}
