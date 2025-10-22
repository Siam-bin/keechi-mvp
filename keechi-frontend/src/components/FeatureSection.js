// src/components/FeatureSection.js - Features Showcase
import { MapPin, Clock, Award, Smartphone, Zap, DollarSign, TrendingUp, Shield, Users } from "lucide-react";

export default function FeatureSection() {
  const features = [
    {
      icon: MapPin,
      title: "Salons Near You",
      description: "Discover handpicked salons and parlours in your area with real-time availability",
      emoji: "📍",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: Clock,
      title: "Instant Booking",
      description: "Reserve your preferred time slot in seconds with instant confirmation",
      emoji: "⏱️",
      color: "bg-purple-50 text-purple-600"
    },
    {
      icon: Award,
      title: "Verified Salons",
      description: "Trusted professionals with verified ratings and real customer reviews",
      emoji: "⭐",
      color: "bg-yellow-50 text-yellow-600"
    },
    {
      icon: DollarSign,
      title: "Pay at Salon",
      description: "No online payment needed - transparent pricing with no hidden charges",
      emoji: "💰",
      color: "bg-green-50 text-green-600"
    },
    {
      icon: Smartphone,
      title: "SMS Confirmation",
      description: "Get booking confirmation, appointment reminders via SMS",
      emoji: "📱",
      color: "bg-indigo-50 text-indigo-600"
    },
    {
      icon: Zap,
      title: "Fast & Easy",
      description: "Simple 3-step process from discovery to booking - no complications",
      emoji: "⚡",
      color: "bg-orange-50 text-orange-600"
    },
  ];

  const stats = [
    { number: "Unlimited", label: "Saloon and Parlor", icon: "🏪" },
    { number: "Unlimited", label: "Happy Customers", icon: "😊" },
    { number: "Unlimited", label: "Bookings Completed", icon: "✅" },
    { number: "Unlimited", label: "Customer Support", icon: "☎️" },
  ];

  return (
    <div className="bg-gradient-to-b from-charcoal-50 to-white">
      {/* Why Choose Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-3 sm:px-4 bg-white">
        <div className="section-container">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-gold-100 text-gold-700 rounded-full text-xs sm:text-sm font-bold mb-3 sm:mb-4">
              WHY KEECHI
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-charcoal-900 mb-3 sm:mb-4 md:mb-6 px-2">
              Experience Seamless Salon Booking
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-charcoal-600 max-w-3xl mx-auto leading-relaxed px-2">
              Transparency, ease, and professional service - all in one platform designed for you
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white border-2 border-charcoal-100 hover:border-gold-400 p-5 sm:p-6 md:p-8 transition-all duration-300 hover:shadow-2xl"
                >
                  {/* Gradient Background on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-50/0 to-gold-100/0 group-hover:from-gold-50/50 group-hover:to-gold-100/30 transition-all duration-300"></div>

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 ${feature.color} rounded-lg sm:rounded-2xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={24} className="sm:w-7 sm:h-7 md:w-8 md:h-8" />
                    </div>

                    {/* Emoji */}
                    <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 opacity-60 group-hover:opacity-100 transition-opacity">
                      {feature.emoji}
                    </div>

                    {/* Content */}
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black text-charcoal-900 mb-2 sm:mb-3 group-hover:text-gold-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-charcoal-600 leading-relaxed font-medium">
                      {feature.description}
                    </p>

                    {/* Arrow */}
                    <div className="mt-4 sm:mt-6 opacity-0 group-hover:opacity-100 transition-all translate-x-0 group-hover:translate-x-2">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-20 px-3 sm:px-4 bg-charcoal-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-5 sm:right-20 w-60 sm:w-96 h-60 sm:h-96 bg-gold-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="section-container relative z-10">
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 md:gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <Shield size={40} className="text-gold-400 mx-auto mb-3 sm:mb-4 sm:w-12 sm:h-12" />
              <h3 className="text-white font-black text-lg sm:text-xl mb-2 sm:mb-3">100% Secure</h3>
              <p className="text-charcoal-300 text-sm sm:text-base">Your data is encrypted and protected with industry-standard security</p>
            </div>

            <div className="text-center">
              <Users size={40} className="text-gold-400 mx-auto mb-3 sm:mb-4 sm:w-12 sm:h-12" />
              <h3 className="text-white font-black text-lg sm:text-xl mb-2 sm:mb-3">Trusted Community</h3>
              <p className="text-charcoal-300 text-sm sm:text-base">Verified customers and salons creating a reliable ecosystem</p>
            </div>

            <div className="text-center">
              <TrendingUp size={40} className="text-gold-400 mx-auto mb-3 sm:mb-4 sm:w-12 sm:h-12" />
              <h3 className="text-white font-black text-lg sm:text-xl mb-2 sm:mb-3">Growing Daily</h3>
              <p className="text-charcoal-300 text-sm sm:text-base">New salons and customers joining every day</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-20 px-3 sm:px-4 bg-gradient-to-r from-gold-50 to-gold-100">
        <div className="section-container text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-charcoal-900 mb-4 sm:mb-6 px-2">
            Ready for Your Best Salon Experience?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-charcoal-700 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            Join thousands of happy customers who trust Keechi for their salon bookings
          </p>
          <a
            href="/salons"
            className="inline-flex items-center gap-2 px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-black rounded-lg sm:rounded-xl hover:from-gold-600 hover:to-gold-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base md:text-lg"
          >
            Explore Salons Now
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}
