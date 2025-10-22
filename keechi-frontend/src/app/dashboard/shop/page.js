"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ShopEditForm } from "@/components/ShopEditForm";
import { api } from "@/lib/api";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

function ShopEditPageContent() {
  const router = useRouter();
  const [shopId, setShopId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get shop owner's shop ID
  useEffect(() => {
    const fetchShopId = async () => {
      try {
        setLoading(true);
        const response = await api.get("/shops/owner/me");
        setShopId(response.data.id);
      } catch (err) {
        console.error("Failed to fetch shop:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShopId();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500 mx-auto mb-4"></div>
          <p className="text-charcoal-600">Loading your shop...</p>
        </div>
      </div>
    );
  }

  if (!shopId) {
    return (
      <div className="min-h-screen bg-charcoal-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-charcoal-900 mb-2">Shop Not Found</h1>
          <p className="text-charcoal-600 mb-6">You haven't created a shop yet.</p>
          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 bg-gold-500 text-white rounded-lg font-semibold hover:bg-gold-600 transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-charcoal-200 rounded-lg transition"
          >
            <ArrowLeft size={24} className="text-charcoal-900" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-charcoal-900">Edit Shop Details</h1>
            <p className="text-charcoal-600">Update your salon information and images</p>
          </div>
        </div>

        {/* Form */}
        <ShopEditForm
          shopId={shopId}
          onSave={(updatedShop) => {
            // Navigate back to dashboard after save
            setTimeout(() => {
              router.push("/dashboard?tab=settings");
            }, 1500);
          }}
        />
      </div>
    </div>
  );
}

export default function ShopEditPage() {
  return (
    <ProtectedRoute requiredRole="shopOwner">
      <ShopEditPageContent />
    </ProtectedRoute>
  );
}
