// src/components/GuestHeader.js - Header for Non-Authenticated Users
"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Montserrat_Alternates } from "next/font/google";

const montserratAlt = Montserrat_Alternates({
  subsets: ["latin"],
  weight: ["700"],
});

export default function GuestHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-charcoal-100">
      <nav className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-opacity flex-shrink-0">
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
                💇
              </div>
            )}
          </div>
          <span className={`text-xl sm:text-2xl font-bold text-charcoal-900 ${montserratAlt.className}`}>Keechi</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-4 lg:gap-8 items-center">
          <Link
            href="/"
            className="text-charcoal-700 hover:text-gold-500 font-medium transition-colors text-sm lg:text-base"
          >
            Home
          </Link>
          <Link
            href="/salons"
            className="text-charcoal-700 hover:text-gold-500 font-medium transition-colors text-sm lg:text-base"
          >
            Salons
          </Link>

          {/* Auth Buttons */}
          <div className="flex gap-2 lg:gap-3 items-center">
            <Link
              href="/login-user"
              className="px-3 lg:px-4 py-2 text-charcoal-700 hover:text-gold-500 font-medium transition-colors border border-charcoal-200 rounded-lg hover:border-gold-400 text-xs lg:text-sm touch-target"
            >
              Login
            </Link>
            <Link
              href="/signup-user"
              className="px-3 lg:px-4 py-2 rounded-lg font-semibold text-white bg-gold-500 hover:bg-gold-600 transition-colors text-xs lg:text-sm touch-target"
            >
              Sign Up
            </Link>
            <div className="h-6 w-px bg-charcoal-200"></div>
            <Link
              href="/login-shop"
              className="px-3 lg:px-4 py-2 text-charcoal-700 hover:text-gold-500 font-medium transition-colors border border-charcoal-200 rounded-lg hover:border-gold-400 text-xs lg:text-sm touch-target"
            >
              For Shops
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 hover:bg-charcoal-50 rounded-lg transition-colors touch-target"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-charcoal-100 max-h-[calc(100vh-70px)] overflow-y-auto">
          <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-2 sm:space-y-3">
            <Link
              href="/"
              className="block px-3 sm:px-4 py-2 sm:py-3 text-charcoal-700 hover:text-gold-500 font-medium rounded-lg hover:bg-gold-50 transition-colors text-sm"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/salons"
              className="block px-3 sm:px-4 py-2 sm:py-3 text-charcoal-700 hover:text-gold-500 font-medium rounded-lg hover:bg-gold-50 transition-colors text-sm"
              onClick={() => setIsOpen(false)}
            >
              Salons
            </Link>

            <div className="border-t border-charcoal-100 my-2 sm:my-3"></div>

            <Link
              href="/login-user"
              className="block px-3 sm:px-4 py-2 sm:py-3 text-charcoal-700 font-medium rounded-lg hover:bg-gold-50 transition-colors text-sm"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/signup-user"
              className="block px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold text-white bg-gold-500 text-center hover:bg-gold-600 transition-colors text-sm"
              onClick={() => setIsOpen(false)}
            >
              Sign Up
            </Link>

            <div className="border-t border-charcoal-100 my-2 sm:my-3"></div>

            <Link
              href="/login-shop"
              className="block px-3 sm:px-4 py-2 sm:py-3 text-charcoal-700 font-medium rounded-lg hover:bg-blue-50 transition-colors text-sm"
              onClick={() => setIsOpen(false)}
            >
              For Shop Owners
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
