// src/app/page.js - Home page with role-based routing
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      // Redirect based on role
      if (user.role === "shopOwner") {
        router.push("/dashboard");
      } else if (user.role === "user") {
        // User is already on the home page, which is correct
        router.push("/salons");
      }
    }
  }, [user, loading, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500 mx-auto mb-4"></div>
          <p className="text-charcoal-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show home page for non-authenticated users or users who need to see the landing page
  return (
    <div>
      <HeroSection />
      <FeatureSection />
    </div>
  );
}
