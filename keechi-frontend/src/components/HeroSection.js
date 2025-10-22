// src/components/HeroSection.js - Modern Hero with Search & Categories
"use client";

import Link from "next/link";
import { ArrowRight, MapPin, Sparkles, Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  { id: "hair", name: "Hair", emoji: "✂️", icon: "Hair" },
  { id: "makeup", name: "Makeup", emoji: "💄", icon: "Makeup" },
  { id: "skin", name: "Skin", emoji: "💆", icon: "Skin Care" },
  { id: "spa", name: "Spa", emoji: "🧖", icon: "Spa" },
];

const AREAS = [
  "Dhaka (All)",
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

export default function HeroSection() {
  const [searchArea, setSearchArea] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchArea) params.append("area", searchArea);
    if (searchCategory) params.append("category", searchCategory);
    router.push(`/salons?${params.toString()}`);
  };

  return (
    <div className="relative">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-gold-900/20 py-12 sm:py-16 md:py-20 lg:py-24 px-3 sm:px-4 overflow-hidden">
        {/* Decorative Gradient Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-gold-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-64 sm:w-80 h-64 sm:h-80 bg-gold-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 w-52 sm:w-72 h-52 sm:h-72 bg-gold-300/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Premium Badge */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-400/20 to-gold-300/10 backdrop-blur-lg px-3 sm:px-5 py-2 sm:py-3 rounded-full border border-gold-400/30 hover:border-gold-400/50 transition-all text-xs sm:text-sm">
              <Sparkles size={16} className="text-gold-400 flex-shrink-0" />
              <span className="text-gold-200 font-bold tracking-wide">
                ✨ Keechi: Dhaka's #1 Salon Booking Platform
              </span>
            </div>
          </div>

          {/* Main Heading */}
          <div className="text-center mb-8 sm:mb-10 md:mb-14">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white mb-3 sm:mb-4 md:mb-6 leading-tight tracking-tight">
              Your Beauty,
              <br />
              <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 bg-clip-text text-transparent animate-pulse">
                Your Schedule
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-2xl text-charcoal-200 mb-3 sm:mb-4 max-w-3xl mx-auto leading-relaxed font-light px-2">
              Discover the most trusted salons and parlours across Dhaka. Book instantly, pay at salon, get confirmed in seconds.
            </p>
            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-4 px-2">
              <span className="inline-block px-2.5 sm:px-4 py-1 sm:py-2 bg-green-500/20 border border-green-400/30 rounded-full text-green-300 text-xs sm:text-sm font-semibold">
                ✓ Verified Saloon & Parlor
              </span>
              <span className="inline-block px-2.5 sm:px-4 py-1 sm:py-2 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-xs sm:text-sm font-semibold">
                ⚡ Instant Booking
              </span>
              <span className="inline-block px-2.5 sm:px-4 py-1 sm:py-2 bg-purple-500/20 border border-purple-400/30 rounded-full text-purple-300 text-xs sm:text-sm font-semibold">
                💯 100% Transparent
              </span>
            </div>
          </div>

          {/* Search Bar - Enhanced for Mobile */}
          <div className="bg-white/95 backdrop-blur rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-7 mb-10 sm:mb-12 md:mb-16 border border-white/20 overflow-x-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
              {/* Location Search */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-charcoal-800 mb-2 sm:mb-3 uppercase tracking-wide">
                  📍 Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 sm:left-4 top-3 sm:top-4 text-gold-500 flex-shrink-0" size={18} />
                  <input
                    type="text"
                    placeholder="Enter your area..."
                    value={searchArea}
                    onChange={(e) => setSearchArea(e.target.value)}
                    list="areas"
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border-2 border-charcoal-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-200 transition-all font-medium text-sm"
                  />
                  <datalist id="areas">
                    {AREAS.map((area) => (
                      <option key={area} value={area} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Category Search */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-charcoal-800 mb-2 sm:mb-3 uppercase tracking-wide">
                  💇 Service Type
                </label>
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-charcoal-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-200 transition-all font-medium text-sm"
                >
                  <option value="">All Services</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.emoji} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  className="w-full px-4 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-bold rounded-lg sm:rounded-xl hover:from-gold-600 hover:to-gold-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
                >
                  <Search size={18} />
                  <span className="hidden sm:inline">Search Now</span>
                  <span className="sm:hidden">Search</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick CTA */}
          <div className="text-center space-y-3 sm:space-y-4 px-2">
            <Link
              href="/salons"
              className="inline-flex items-center gap-2 sm:gap-3 text-gold-300 hover:text-gold-200 font-bold text-sm sm:text-base md:text-lg transition-colors"
            >
              Browse all salons
              <ArrowRight size={18} className="sm:w-6 sm:h-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-gradient-to-b from-white to-charcoal-50 py-12 sm:py-16 md:py-20 lg:py-20 px-3 sm:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-14 md:mb-16">
            <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-gold-100 text-gold-700 rounded-full text-xs sm:text-sm font-bold mb-3 sm:mb-4">
              EXPLORE SERVICES
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-charcoal-900 mb-3 sm:mb-4 px-2">
              What Are You Looking For?
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-charcoal-600 max-w-2xl mx-auto px-2">
              From haircuts to spa treatments, find exactly what you need
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                href={`/salons?category=${category.id}`}
              >
                <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white border-2 border-charcoal-100 p-4 sm:p-6 md:p-8 text-center cursor-pointer hover:border-gold-500 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 h-full flex flex-col items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-400/0 to-gold-500/0 group-hover:from-gold-400/10 group-hover:to-gold-500/5 transition-all"></div>
                  <div className="relative">
                    <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-4 transform group-hover:scale-125 transition-transform duration-300">
                      {category.emoji}
                    </div>
                    <h3 className="font-black text-charcoal-900 mb-1 sm:mb-2 text-base sm:text-lg md:text-xl group-hover:text-gold-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-charcoal-500 font-semibold">
                      {category.icon}
                    </p>
                    <div className="mt-2 sm:mt-4 opacity-0 group-hover:opacity-100 transition-all">
                      <ArrowRight className="mx-auto text-gold-500 animate-pulse" size={18} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Business Model Section */}
      <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-20 px-3 sm:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-14 md:mb-16">
            <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-gold-100 text-gold-700 rounded-full text-xs sm:text-sm font-bold mb-3 sm:mb-4">
              HOW KEECHI WORKS
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-charcoal-900 mb-3 sm:mb-4 px-2">
              For Customers
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-charcoal-600 max-w-2xl mx-auto px-2">
              Three simple steps to your perfect salon experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-12 md:mb-16">
            {/* Step 1 */}
            <div className="relative">
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gold-500 text-white rounded-full font-black text-lg sm:text-2xl mb-4 sm:mb-6 mx-auto">
                1
              </div>
              <div className="text-center">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-charcoal-900 mb-2 sm:mb-3">Search & Discover</h3>
                <p className="text-sm sm:text-base text-charcoal-600 leading-relaxed">
                  Find salons by location, service type, or ratings. Browse verified reviews from real customers.
                </p>
              </div>
              <div className="hidden md:block absolute top-16 right-0 w-1/2 h-1 bg-gradient-to-r from-gold-400 to-transparent transform translate-x-full"></div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gold-500 text-white rounded-full font-black text-lg sm:text-2xl mb-4 sm:mb-6 mx-auto">
                2
              </div>
              <div className="text-center">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-charcoal-900 mb-2 sm:mb-3">Book Instantly</h3>
                <p className="text-sm sm:text-base text-charcoal-600 leading-relaxed">
                  Choose your service, date & time. Get instant confirmation. No waiting, no hassle.
                </p>
              </div>
              <div className="hidden md:block absolute top-16 right-0 w-1/2 h-1 bg-gradient-to-r from-gold-400 to-transparent transform translate-x-full"></div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gold-500 text-white rounded-full font-black text-lg sm:text-2xl mb-4 sm:mb-6 mx-auto">
                3
              </div>
              <div className="text-center">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-charcoal-900 mb-2 sm:mb-3">Pay at Salon</h3>
                <p className="text-sm sm:text-base text-charcoal-600 leading-relaxed">
                  Arrive for your appointment. Pay directly at the salon. Transparent pricing, no surprises.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Salon Owners Section */}
      <section className="bg-charcoal-900 py-12 sm:py-16 md:py-20 lg:py-20 px-3 sm:px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-5 sm:top-10 right-5 sm:right-10 w-52 sm:w-72 h-52 sm:h-72 bg-gold-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Content */}
            <div className="px-2">
              <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-gold-500/20 text-gold-300 rounded-full text-xs sm:text-sm font-bold mb-3 sm:mb-4 border border-gold-500/30">
                FOR SALON OWNERS
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6">
                Grow Your Salon Business
              </h2>
              <p className="text-base sm:text-lg text-charcoal-200 mb-6 sm:mb-8 leading-relaxed">
                Reach more customers, manage appointments effortlessly, and grow your revenue with Keechi's salon management platform.
              </p>

              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <li className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-gold-500 text-white rounded-full font-bold flex-shrink-0 text-sm">✓</span>
                  <span className="text-sm sm:text-base text-charcoal-100 font-semibold">Access to 10,000+ customers</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-gold-500 text-white rounded-full font-bold flex-shrink-0 text-sm">✓</span>
                  <span className="text-sm sm:text-base text-charcoal-100 font-semibold">Automated appointment management</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-gold-500 text-white rounded-full font-bold flex-shrink-0 text-sm">✓</span>
                  <span className="text-sm sm:text-base text-charcoal-100 font-semibold">Build your reputation with reviews</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-gold-500 text-white rounded-full font-bold flex-shrink-0 text-sm">✓</span>
                  <span className="text-sm sm:text-base text-charcoal-100 font-semibold">Zero commission on first month</span>
                </li>
              </ul>

              <Link
                href="/login-shop"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-bold rounded-lg sm:rounded-xl hover:from-gold-600 hover:to-gold-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
              >
                Join as Salon Owner
                <ArrowRight size={18} className="sm:w-5 sm:h-5" />
              </Link>
            </div>

            {/* Right Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 hover:bg-white/15 transition-all">
                <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">📊</div>
                <h4 className="text-white font-bold mb-1 sm:mb-2 text-xs sm:text-sm md:text-base">Analytics</h4>
                <p className="text-charcoal-300 text-xs sm:text-xs md:text-sm">Track bookings, revenue, and customer insights</p>
              </div>

              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 hover:bg-white/15 transition-all">
                <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">📅</div>
                <h4 className="text-white font-bold mb-1 sm:mb-2 text-xs sm:text-sm md:text-base">Easy Scheduling</h4>
                <p className="text-charcoal-300 text-xs sm:text-xs md:text-sm">Manage services, availability, and staff</p>
              </div>

              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 hover:bg-white/15 transition-all">
                <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">⭐</div>
                <h4 className="text-white font-bold mb-1 sm:mb-2 text-xs sm:text-sm md:text-base">Customer Reviews</h4>
                <p className="text-charcoal-300 text-xs sm:text-xs md:text-sm">Build trust with verified customer reviews</p>
              </div>

              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 hover:bg-white/15 transition-all">
                <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">🎯</div>
                <h4 className="text-white font-bold mb-1 sm:mb-2 text-xs sm:text-sm md:text-base">Marketing Tools</h4>
                <p className="text-charcoal-300 text-xs sm:text-xs md:text-sm">Showcase your salon to more customers</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
