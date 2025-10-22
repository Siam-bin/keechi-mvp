"use client";

import Link from "next/link";
import { Star, MapPin, Clock, Phone } from "lucide-react";

export function HeroShopHeader({ shop, onBookClick }) {
  return (
    <div className="bg-charcoal-900 text-white">
      {/* Banner/Cover Image */}
      <div className="relative h-64 md:h-80 overflow-hidden bg-gradient-to-r from-gold-400 to-gold-500">
        {shop.coverImage ? (
          <img
            src={shop.coverImage}
            alt={shop.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gold-400 to-gold-600">
            <span className="text-6xl">🏪</span>
          </div>
        )}

        {/* Overlay with info */}
        <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-6 md:p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{shop.name}</h1>

              {/* Key Info */}
              <div className="space-y-2 text-sm md:text-base">
                {/* Location */}
                {shop.address && (
                  <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    <span>{shop.address}</span>
                  </div>
                )}

                {/* Rating */}
                {shop.rating > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star size={18} className="fill-gold-400 text-gold-400" />
                      <span className="font-semibold">{shop.rating}</span>
                      <span className="text-white/70">({shop.reviewCount} reviews)</span>
                    </div>
                  </div>
                )}

                {/* Phone */}
                {shop.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={18} />
                    <span>{shop.phone}</span>
                  </div>
                )}

                {/* Hours */}
                {shop.openHours && (
                  <div className="flex items-center gap-2">
                    <Clock size={18} />
                    <span>Open now</span>
                  </div>
                )}
              </div>
            </div>

            {/* Book Now Button */}
            <button
              onClick={onBookClick}
              className="px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-lg transition-colors shadow-lg"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
