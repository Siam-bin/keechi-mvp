// src/components/Header.js - Main Header Component with Role-Based Rendering
"use client";

import { useAuth } from "@/hooks/useAuth";
import UserHeader from "./UserHeader";
import ShopOwnerHeader from "./ShopOwnerHeader";
import GuestHeader from "./GuestHeader";
import { Loader } from "lucide-react";

export default function Header() {
  const { user, isAuthenticated, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-charcoal-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-center">
          <Loader className="animate-spin w-5 h-5 text-gold-500" />
          <span className="ml-2 text-sm text-charcoal-600">Loading...</span>
        </div>
      </header>
    );
  }

  // Render appropriate header based on role
  if (isAuthenticated) {
    if (user?.role === "user") {
      return <UserHeader />;
    } else if (user?.role === "shopOwner") {
      return <ShopOwnerHeader />;
    }
  }

  // Render guest header if not authenticated
  return <GuestHeader />;
}
