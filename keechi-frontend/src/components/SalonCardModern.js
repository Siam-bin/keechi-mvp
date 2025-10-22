// src/components/SalonCardModern.js - Three Modern Premium Salon Card Variations
import Link from "next/link";
import { MapPin, Star, ArrowRight, Clock, MapPinIcon, Badge } from "lucide-react";
import Image from "next/image";

/**
 * COMPACT STYLE - Minimal, clean, focus on essentials
 * Perfect for gallery/grid layouts
 */
export function SalonCardCompact({ salon, featured = false }) {
  const isOpen = true; // You can replace with actual business hours logic
  const servicesList = salon.servicesTagline 
    ? salon.servicesTagline 
    : (Array.isArray(salon.services)
      ? salon.services.map(s => typeof s === 'string' ? s : s.name).join(" • ")
      : salon.services || "Beauty Services");

  return (
    <Link href={`/shops/${salon.id}`}>
      <div className={`group overflow-hidden rounded-3xl sm:rounded-4xl transition-all duration-300 h-full cursor-pointer transform hover:scale-[1.02] ${
        featured ? "ring-2 ring-gold-400 shadow-2xl" : "shadow-lg hover:shadow-2xl"
      }`}>
        {/* Image Container */}
        <div className="relative w-full aspect-square sm:aspect-video overflow-hidden bg-gradient-to-br from-gold-100 to-gold-50">
          {salon.imageUrl ? (
            <Image
              src={salon.imageUrl}
              alt={salon.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              unoptimized
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gold-200 to-gold-100">
              <span className="text-4xl sm:text-6xl">💅</span>
            </div>
          )}

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Featured Badge */}
          {featured && (
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-gold-400 text-charcoal-900 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-1.5 shadow-lg font-bold text-xs sm:text-sm">
              <Badge size={14} className="sm:w-5 sm:h-5" />
              Featured
            </div>
          )}

          {/* Rating Badge - Floating */}
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white/95 backdrop-blur-sm px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full flex items-center gap-1.5 shadow-lg hover:bg-white transition-colors">
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-gold-400 text-gold-400" />
            <span className="text-xs sm:text-sm font-bold text-charcoal-900">{salon.rating || 4.8}</span>
          </div>

          {/* Status Badge */}
          <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
            <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={isOpen ? 'text-green-700' : 'text-red-700'}>{isOpen ? 'Open Now' : 'Closed'}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 md:p-5 bg-white">
          {/* Salon Name */}
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-charcoal-900 mb-1 line-clamp-1 group-hover:text-gold-600 transition-colors">
            {salon.name}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-charcoal-600 mb-2.5 text-xs sm:text-sm">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-500 flex-shrink-0" />
            <span className="truncate">{salon.area}</span>
          </div>

          {/* Services Tags */}
          <div className="mb-3 sm:mb-4 line-clamp-2">
            <p className="text-xs font-medium text-gold-600 uppercase tracking-wide line-clamp-2">
              {servicesList}
            </p>
          </div>

          {/* Book Button */}
          <button className="w-full bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-charcoal-900 font-bold py-2 sm:py-2.5 rounded-xl sm:rounded-2xl transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg active:scale-95 text-xs sm:text-sm min-h-[44px] touch-target">
            Book Now
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </Link>
  );
}

/**
 * OVERLAY STYLE - Premium overlay design with content on top of image
 * Like Fresha/StyleSeat - best for hero/featured cards
 */
export function SalonCardOverlay({ salon, featured = true }) {
  const isOpen = true;
  const servicesList = salon.servicesTagline 
    ? salon.servicesTagline 
    : (Array.isArray(salon.services)
      ? salon.services.map(s => typeof s === 'string' ? s : s.name).join(" • ")
      : salon.services || "Beauty Services");

  return (
    <Link href={`/shops/${salon.id}`}>
      <div className="group overflow-hidden rounded-3xl sm:rounded-4xl cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300 h-full ring-2 ring-gold-400 ring-offset-2 ring-offset-white transform hover:scale-[1.02]">
        <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-gold-100 to-gold-50">
          {/* Background Image */}
          {salon.imageUrl ? (
            <Image
              src={salon.imageUrl}
              alt={salon.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              unoptimized
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gold-300 to-gold-200">
              <span className="text-5xl sm:text-7xl">💅</span>
            </div>
          )}

          {/* Gradient Overlay - Dark at bottom for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

          {/* Featured Badge - Top Left */}
          {featured && (
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-gold-400 text-charcoal-900 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-1.5 shadow-xl font-bold text-xs sm:text-sm backdrop-blur-sm">
              <Badge size={14} className="sm:w-5 sm:h-5" />
              Featured
            </div>
          )}

          {/* Rating Badge - Top Right */}
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white text-charcoal-900 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-1.5 shadow-lg font-bold text-xs sm:text-sm hover:bg-gold-100 transition-colors">
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-gold-400 text-gold-400" />
            {salon.rating || 4.8}
          </div>

          {/* Content at Bottom */}
          <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 md:p-5 text-white">
            {/* Salon Name */}
            <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 line-clamp-1">
              {salon.name}
            </h3>

            {/* Location with icon */}
            <div className="flex items-center gap-1.5 mb-2.5 text-xs sm:text-sm">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate opacity-95">{salon.area}</span>
            </div>

            {/* Services */}
            <p className="text-xs sm:text-sm mb-3 opacity-90 line-clamp-1">
              {servicesList}
            </p>

            {/* Status & Button Row */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2.5 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold">
                <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-400' : 'bg-red-400'}`}></div>
                {isOpen ? 'Open' : 'Closed'}
              </div>
              <button className="flex-1 bg-gold-400 hover:bg-gold-500 text-charcoal-900 font-bold py-2 sm:py-2.5 rounded-xl sm:rounded-2xl transition-all duration-300 flex items-center justify-center gap-1 text-xs sm:text-sm min-h-[44px] touch-target active:scale-95">
                Book
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * SPLIT STYLE - Modern split design with image and content side-by-side
 * Great for list/detail views and larger cards
 */
export function SalonCardSplit({ salon, featured = false }) {
  const isOpen = true;
  const servicesList = salon.servicesTagline 
    ? salon.servicesTagline 
    : (Array.isArray(salon.services)
      ? salon.services.map(s => typeof s === 'string' ? s : s.name).slice(0, 3).join(" • ")
      : salon.services || "Beauty Services");

  return (
    <Link href={`/shops/${salon.id}`}>
      <div className={`group overflow-hidden rounded-2xl sm:rounded-3xl cursor-pointer transition-all duration-300 flex flex-col sm:flex-row ${
        featured ? 'ring-2 ring-gold-400 shadow-2xl' : 'shadow-lg hover:shadow-xl'
      }`}>
        {/* Image - Left side */}
        <div className="relative w-full sm:w-2/5 aspect-square sm:aspect-auto bg-gradient-to-br from-gold-100 to-gold-50 overflow-hidden">
          {salon.imageUrl ? (
            <Image
              src={salon.imageUrl}
              alt={salon.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              unoptimized
              sizes="(max-width: 640px) 100vw, 40vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gold-200 to-gold-100">
              <span className="text-4xl sm:text-5xl">💅</span>
            </div>
          )}

          {/* Rating Badge - Floating on image */}
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white/95 backdrop-blur-sm px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center gap-1 shadow-md">
            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-gold-400 text-gold-400" />
            <span className="text-xs sm:text-sm font-bold text-charcoal-900">{salon.rating || 4.8}</span>
          </div>
        </div>

        {/* Content - Right side */}
        <div className="p-3 sm:p-4 md:p-5 flex-1 bg-white flex flex-col justify-between">
          {/* Header */}
          <div>
            {/* Name */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-charcoal-900 line-clamp-2 group-hover:text-gold-600 transition-colors flex-1">
                {salon.name}
              </h3>
              {featured && (
                <Badge className="w-5 h-5 text-gold-500 flex-shrink-0" />
              )}
            </div>

            {/* Location */}
            <div className="flex items-center gap-1.5 text-charcoal-600 mb-3 text-xs sm:text-sm">
              <MapPin className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
              <span className="line-clamp-1">{salon.area}</span>
            </div>

            {/* Services */}
            <p className="text-xs sm:text-sm text-charcoal-600 mb-3 line-clamp-2">
              {servicesList}
            </p>
          </div>

          {/* Footer - Status and Button */}
          <div className="flex items-center gap-2 sm:gap-3 pt-3 border-t border-charcoal-100">
            {/* Status */}
            <div className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 ${
              isOpen 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
              {isOpen ? 'Open' : 'Closed'}
            </div>

            {/* Book Button */}
            <button className="flex-1 bg-gold-400 hover:bg-gold-500 text-charcoal-900 font-bold py-2 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center gap-1 text-xs sm:text-sm min-h-[44px] touch-target active:scale-95">
              Book
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * Default Export - Compact style (most commonly used)
 */
export default SalonCardCompact;
