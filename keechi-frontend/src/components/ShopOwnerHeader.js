// src/components/ShopOwnerHeader.js - Header for Shop Owners
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, LogOut, User, ChevronDown, BarChart3, Settings } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Montserrat_Alternates } from "next/font/google";

const montserratAlt = Montserrat_Alternates({
  subsets: ["latin"],
  weight: ["700"],
});

export default function ShopOwnerHeader() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  const handleLogout = () => {
    logout();
    setShowProfile(false);
    setIsOpen(false);
    router.push("/");
  };

  return (
    <header
      className="sticky top-0 z-50 bg-gradient-to-r from-purple-600 to-pink-600 shadow-md"
    >
      <nav className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-opacity flex-shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 bg-white border-2 border-gold-400 rounded-2xl sm:rounded-3xl overflow-hidden">
            {!logoFailed ? (
              <img 
                src="/logo/keechi-logo.svg" 
                alt="Keechi Logo"
                className="w-full h-full object-contain"
                onError={() => setLogoFailed(true)}
                onLoad={() => setLogoFailed(false)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                💼
              </div>
            )}
          </div>
          <span className={`text-xl sm:text-2xl font-bold text-white ${montserratAlt.className}`}>Keechi Pro</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-2 lg:gap-6 items-center">
          <Link
            href="/dashboard"
            className="text-white hover:text-gold-200 font-medium transition-colors text-sm lg:text-base flex items-center gap-1.5"
          >
            <BarChart3 size={18} />
            Dashboard
          </Link>

          <Link
            href="/dashboard/shop"
            className="text-white hover:text-gold-200 font-medium transition-colors text-sm lg:text-base flex items-center gap-1.5"
          >
            <Settings size={18} />
            Shop Settings
          </Link>

          {/* Owner Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors touch-target"
            >
              <User size={18} className="text-white lg:w-5 lg:h-5" />
              <span className="text-white font-medium text-xs lg:text-sm line-clamp-1">{user?.name}</span>
              <ChevronDown size={16} className="text-white/80 lg:w-5 lg:h-5" />
            </button>

            {/* Profile Dropdown */}
            {showProfile && (
              <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-xs sm:text-sm text-charcoal-600 line-clamp-1">{user?.email}</p>
                  <p className="text-xs text-charcoal-500 mt-1">🏪 Shop Owner</p>
                </div>

                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-charcoal-700 hover:bg-purple-50 transition-colors text-sm"
                  onClick={() => setShowProfile(false)}
                >
                  📊 Dashboard
                </Link>

                <Link
                  href="/dashboard/shop"
                  className="block px-4 py-2 text-charcoal-700 hover:bg-purple-50 transition-colors text-sm"
                  onClick={() => setShowProfile(false)}
                >
                  ⚙️ Shop Settings
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 text-sm"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 hover:bg-white/20 rounded-lg transition-colors touch-target"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X size={24} className="text-white" />
          ) : (
            <Menu size={24} className="text-white" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gradient-to-b from-purple-600 to-pink-600 border-t border-purple-700 max-h-[calc(100vh-70px)] overflow-y-auto">
          <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-2 sm:space-y-3">
            <Link
              href="/dashboard"
              className="block px-3 sm:px-4 py-2 sm:py-3 text-white hover:text-gold-200 font-medium rounded-lg hover:bg-white/10 transition-colors text-sm"
              onClick={() => setIsOpen(false)}
            >
              📊 Dashboard
            </Link>

            <Link
              href="/dashboard/shop"
              className="block px-3 sm:px-4 py-2 sm:py-3 text-white hover:text-gold-200 font-medium rounded-lg hover:bg-white/10 transition-colors text-sm"
              onClick={() => setIsOpen(false)}
            >
              ⚙️ Shop Settings
            </Link>

            <div className="border-t border-purple-500 my-2 sm:my-3"></div>
            
            <div className="px-3 sm:px-4 py-2 sm:py-3">
              <p className="text-xs sm:text-sm text-white font-medium line-clamp-1">{user?.name}</p>
              <p className="text-xs text-white/80">🏪 Shop Owner</p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-white hover:bg-red-500/30 transition-colors text-sm rounded-lg flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
