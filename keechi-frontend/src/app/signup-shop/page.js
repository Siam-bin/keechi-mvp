"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { ArrowLeft, User, Mail, Lock, Phone, MapPin, FileText, Image } from "lucide-react";

export default function SignupShopPage() {
  const router = useRouter();
  const { signupShop, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    shopName: "",
    shopAddress: "",
    shopDescription: "",
    shopImage: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.shopName ||
      !formData.shopAddress
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const result = await signupShop(
      formData.name,
      formData.email,
      formData.password,
      formData.phone,
      formData.shopName,
      formData.shopAddress,
      formData.shopDescription,
      formData.shopImage
    );

    if (result.success) {
      toast.success("Shop registered successfully!");
      setTimeout(() => router.push("/dashboard"), 1000);
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-20">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-charcoal-600 hover:text-charcoal-900 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-charcoal-900 mb-2">Register Your Shop</h1>
          <p className="text-charcoal-600">Join Keechi and start accepting bookings today.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-charcoal-100">
          <div className="grid md:grid-cols-2 gap-6">
            {/* ===== Owner Details ===== */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-charcoal-900 mb-4">Your Information</h3>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-charcoal-400" size={20} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-charcoal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-charcoal-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-charcoal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                  placeholder="shop@example.com"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-charcoal-400" size={20} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-charcoal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                  placeholder="+880 1234567890"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-charcoal-400" size={20} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-charcoal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              <p className="text-xs text-charcoal-500 mt-1">Minimum 6 characters</p>
            </div>

            {/* ===== Shop Details ===== */}
            <div className="md:col-span-2 mt-6">
              <h3 className="text-lg font-semibold text-charcoal-900 mb-4">Shop Information</h3>
            </div>

            {/* Shop Name */}
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">
                Shop Name *
              </label>
              <input
                type="text"
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-charcoal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                placeholder="Beauty Parlour Elite"
              />
            </div>

            {/* Shop Address */}
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">
                Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-charcoal-400" size={20} />
                <input
                  type="text"
                  name="shopAddress"
                  value={formData.shopAddress}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-charcoal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                  placeholder="123 Dhaka Road, Dhanmondi"
                />
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-charcoal-700 mb-2">
                Description
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-charcoal-400" size={20} />
                <textarea
                  name="shopDescription"
                  value={formData.shopDescription}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-charcoal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                  placeholder="Tell customers about your shop..."
                  rows="3"
                />
              </div>
            </div>

            {/* Image URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-charcoal-700 mb-2">
                Shop Image URL
              </label>
              <div className="relative">
                <Image className="absolute left-3 top-3 text-charcoal-400" size={20} />
                <input
                  type="url"
                  name="shopImage"
                  value={formData.shopImage}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-charcoal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-gold-400 to-gold-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {loading ? "Registering..." : "Register Shop"}
              </button>
            </div>
          </div>
        </form>

        {/* Login Link */}
        <p className="text-center text-charcoal-600 mt-6">
          Already registered?{" "}
          <Link href="/login-shop" className="text-gold-500 font-semibold hover:text-gold-600">
            Sign in
          </Link>
        </p>

        {/* Customer Link */}
        <div className="mt-8 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <p className="text-sm text-charcoal-700">
            Looking to book appointments?{" "}
            <Link href="/signup-user" className="text-emerald-600 font-semibold hover:text-emerald-700">
              Sign up as customer
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
