// src/components/SalonDetails.js - Salon Details Component
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Clock,
  Star,
  Share2,
  Heart,
  ChevronRight,
} from "lucide-react";
import { Button, Card, Badge } from "@/components";

export default function SalonDetails({ salon = {} }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock data if not provided
  const defaultSalon = {
    name: "Glamour Dhaka",
    area: "Dhanmondi",
    rating: 4.8,
    reviews: 324,
    phone: "+880 1700 000000",
    hours: "09:00 AM - 06:00 PM",
    address: "123 Satmasjid Road, Dhanmondi, Dhaka",
    description:
      "Premium salon and parlour offering cutting-edge beauty services. Our expert stylists and therapists provide personalized care in a luxurious setting.",
    services: ["Haircut", "Hair Coloring", "Facial", "Massage", "Threading", "Bridal Makeup"],
    images: [
      "https://images.unsplash.com/photo-1633320945487-fd1d7c35df60?w=800",
      "https://images.unsplash.com/photo-1613208889335-c8c58b643070?w=800",
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800",
    ],
    price_range: "৳500 - ৳5000",
  };

  const data = { ...defaultSalon, ...salon };

  return (
    <div className="bg-white">
      {/* Image Gallery */}
      <div className="relative h-96 bg-charcoal-100 overflow-hidden">
        {data.images && data.images.length > 0 ? (
          <Image
            src={data.images[currentImageIndex]}
            alt={data.name}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            💇
          </div>
        )}

        {/* Image Navigation */}
        {data.images && data.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {data.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex
                    ? "bg-gold-400 w-8"
                    : "bg-white/50 hover:bg-white"
                }`}
              />
            ))}
          </div>
        )}

        {/* Action Buttons - Overlay */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
          >
            <Heart
              size={24}
              className={isFavorite ? "fill-red-500 text-red-500" : "text-charcoal-400"}
            />
          </button>
          <button className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all">
            <Share2 size={24} className="text-charcoal-400" />
          </button>
        </div>

        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <Link href="/salons">
            <button className="p-3 bg-white/90 backdrop-blur rounded-full shadow-lg hover:shadow-xl transition-all hover:bg-white">
              <ChevronRight size={24} className="text-charcoal-800 rotate-180" />
            </button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-charcoal-900 mb-2 font-display">
                    {data.name}
                  </h1>
                  <div className="flex items-center gap-2">
                    <Star size={20} className="fill-gold-400 text-gold-400" />
                    <span className="font-bold text-charcoal-900">{data.rating}</span>
                    <span className="text-charcoal-600">({data.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              <p className="text-charcoal-600 leading-relaxed">{data.description}</p>
            </div>

            {/* Info Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card elevated>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gold-50 rounded-lg">
                    <MapPin className="text-gold-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal-600 uppercase tracking-wide">
                      Location
                    </p>
                    <p className="font-semibold text-charcoal-900">{data.area}</p>
                    <p className="text-sm text-charcoal-600">{data.address}</p>
                  </div>
                </div>
              </Card>

              <Card elevated>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gold-50 rounded-lg">
                    <Phone className="text-gold-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal-600 uppercase tracking-wide">
                      Contact
                    </p>
                    <a
                      href={`tel:${data.phone}`}
                      className="font-semibold text-gold-600 hover:text-gold-700"
                    >
                      {data.phone}
                    </a>
                  </div>
                </div>
              </Card>

              <Card elevated>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gold-50 rounded-lg">
                    <Clock className="text-gold-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal-600 uppercase tracking-wide">
                      Hours
                    </p>
                    <p className="font-semibold text-charcoal-900">{data.hours}</p>
                    <Badge variant="success" className="mt-2">
                      Open Now
                    </Badge>
                  </div>
                </div>
              </Card>

              <Card elevated>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gold-50 rounded-lg">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal-600 uppercase tracking-wide">
                      Price Range
                    </p>
                    <p className="font-semibold text-charcoal-900">{data.price_range}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Services */}
            <div>
              <h2 className="text-2xl font-bold text-charcoal-900 mb-4 font-display">
                Services Available
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {data.services?.map((service, idx) => (
                  <Card key={idx} className="p-4 text-center hover:bg-gold-50 transition-colors cursor-pointer">
                    <p className="font-semibold text-charcoal-900">{service}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Reviews Preview */}
            <div>
              <h2 className="text-2xl font-bold text-charcoal-900 mb-4 font-display">
                Customer Reviews
              </h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} elevated className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-charcoal-900">Reviewer {i}</p>
                        <div className="flex gap-1 mt-1">
                          {[...Array(5)].map((_, j) => (
                            <Star
                              key={j}
                              size={16}
                              className="fill-gold-400 text-gold-400"
                            />
                          ))}
                        </div>
                      </div>
                      <Badge variant="gold">Verified</Badge>
                    </div>
                    <p className="text-charcoal-600">
                      Great salon with professional staff and clean environment. Highly recommended!
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Card
              elevated
              className="sticky top-24 p-8"
            >
              <h3 className="text-2xl font-bold text-charcoal-900 mb-2 font-display">
                Ready to Book?
              </h3>
              <p className="text-charcoal-600 mb-6">
                Reserve your appointment now. Confirmation via SMS.
              </p>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-gold-50 rounded-lg border border-gold-200">
                  <p className="text-sm font-semibold text-charcoal-600 uppercase">
                    Booking Details
                  </p>
                  <p className="text-charcoal-900 font-semibold">
                    Free consultation included
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-semibold text-charcoal-600 uppercase">
                    No Online Payment
                  </p>
                  <p className="text-charcoal-900">Pay at salon after service</p>
                </div>
              </div>

              <Link href={`/book/${salon.id || "1"}`} className="block mb-3">
                <Button variant="primary" fullWidth size="lg">
                  Book Appointment
                </Button>
              </Link>

              <Button variant="secondary" fullWidth>
                Share This Salon
              </Button>

              <p className="text-xs text-charcoal-600 mt-4 text-center">
                By booking, you agree to our terms and conditions
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
