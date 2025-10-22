// src/components/Footer.js - Modern Footer
import { Heart, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-charcoal-900 text-white py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-8 mt-12 sm:mt-16 md:mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Top Section */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12 mb-8 sm:mb-10 md:mb-12">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gold-400 rounded-lg flex items-center justify-center text-charcoal-900 font-bold text-xs sm:text-sm">
                💇
              </div>
              <h4 className="text-base sm:text-lg font-bold font-display">Keechi</h4>
            </div>
            <p className="text-charcoal-300 text-xs sm:text-sm leading-relaxed">
              Making salon booking easy, transparent, and delightful for Dhaka's salons and customers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-semibold text-white mb-3 sm:mb-4 font-display text-sm md:text-base">Explore</h5>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <a
                  href="/"
                  className="text-charcoal-300 hover:text-gold-400 transition-colors text-xs sm:text-sm"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/salons"
                  className="text-charcoal-300 hover:text-gold-400 transition-colors text-xs sm:text-sm"
                >
                  Salons
                </a>
              </li>
              <li>
                <a
                  href="/admin"
                  className="text-charcoal-300 hover:text-gold-400 transition-colors text-xs sm:text-sm"
                >
                  Admin
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h5 className="font-semibold text-white mb-3 sm:mb-4 font-display text-sm md:text-base">Support</h5>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <a
                  href="#"
                  className="text-charcoal-300 hover:text-gold-400 transition-colors text-xs sm:text-sm"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-charcoal-300 hover:text-gold-400 transition-colors text-xs sm:text-sm"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-charcoal-300 hover:text-gold-400 transition-colors text-xs sm:text-sm"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 sm:col-span-1">
            <h5 className="font-semibold text-white mb-3 sm:mb-4 font-display text-sm md:text-base">Get in Touch</h5>
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-start gap-2">
                <Mail size={14} className="text-gold-400 mt-0.5 flex-shrink-0 sm:w-4 sm:h-4" />
                <a href="mailto:hello@keechi.app" className="text-charcoal-300 hover:text-gold-400 transition-colors text-xs sm:text-sm break-all">
                  hello@keechi.app
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={14} className="text-gold-400 mt-0.5 flex-shrink-0 sm:w-4 sm:h-4" />
                <a href="tel:+880170000000" className="text-charcoal-300 hover:text-gold-400 transition-colors text-xs sm:text-sm">
                  +880 1700 000000
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-charcoal-700 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-charcoal-400 text-center sm:text-left">
              © 2025 Keechi. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-xs sm:text-sm text-charcoal-400 whitespace-nowrap">
              Made with
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 fill-red-500 text-red-500 mx-1" />
              in Dhaka
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
