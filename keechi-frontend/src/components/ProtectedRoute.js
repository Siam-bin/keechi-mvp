// ProtectedRoute.js - Component to protect routes based on authentication and role
"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

export function ProtectedRoute({ children, requiredRole = null }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, loading } = useAuth();
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (loading) return;

    // Redirect if not authenticated
    if (!isAuthenticated) {
      // Only show error once per redirect
      if (!toastShownRef.current) {
        toast.error("Please login to access this page");
        toastShownRef.current = true;
      }
      router.push("/login-user");
      return;
    }

    // Check role-based access
    if (requiredRole && user?.role !== requiredRole) {
      if (!toastShownRef.current) {
        toast.error(`This page is for ${requiredRole === "shopOwner" ? "shop owners" : "customers"} only`);
        toastShownRef.current = true;
      }
      router.push("/");
      return;
    }

    // Reset ref when successfully authenticated
    toastShownRef.current = false;
  }, [isAuthenticated, user, loading, requiredRole, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold-200 border-t-gold-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-charcoal-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return null;
  }

  return children;
}
