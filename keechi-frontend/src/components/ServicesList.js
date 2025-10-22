"use client";

import { ServiceCard } from "./ServiceCard";
import { useState } from "react";

export function ServicesList({ services, shopId, onAddToCart }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Get unique categories
  const categories = ["all", ...new Set(services.map((s) => s.category).filter(Boolean))];

  // Filter services by category
  const filteredServices =
    selectedCategory === "all" ? services : services.filter((s) => s.category === selectedCategory);

  return (
    <div className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-charcoal-900 mb-2">Our Services</h2>
        <p className="text-charcoal-600 mb-8">Add services to cart and book your appointment</p>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? "bg-gold-500 text-white"
                    : "bg-charcoal-100 text-charcoal-700 hover:bg-charcoal-200"
                }`}
              >
                {category === "all" ? "All Services" : category}
              </button>
            ))}
          </div>
        )}

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-12 bg-charcoal-50 rounded-lg">
            <p className="text-charcoal-600">No services available in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                shopId={shopId}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
