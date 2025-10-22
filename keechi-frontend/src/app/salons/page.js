// src/app/salons/page.js - Professional Salon Listing Page
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SalonCardCompact } from "@/components/SalonCardModern";
import FilterPanel from "@/components/FilterPanel";
import { useSalons } from "@/hooks";
import { useAuth } from "@/hooks/useAuth";
import { Loader, AlertCircle } from "lucide-react";

export default function SalonsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [filters, setFilters] = useState({});
  
  // Redirect shop owners to their dashboard
  useEffect(() => {
    if (!authLoading && user?.role === "shopOwner") {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  // Fetch salons from backend API
  const { data: allSalons = [], isLoading, error } = useSalons(filters.area);

  // Client-side filtering by category (since backend doesn't support multi-filter yet)
  let filteredSalons = allSalons;

  if (filters.category) {
    filteredSalons = filteredSalons.filter((salon) =>
      salon.services.some(service =>
        service.toLowerCase().includes(filters.category.toLowerCase())
      )
    );
  }

  if (filters.minRating) {
    filteredSalons = filteredSalons.filter(
      (salon) => (salon.rating || 0) >= filters.minRating
    );
  }

  // Show loading state if auth is still loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500 mx-auto mb-4"></div>
          <p className="text-charcoal-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal-900 mb-2 sm:mb-3 font-display px-1">
            Discover Salons in Dhaka
          </h1>
          <p className="text-charcoal-600 text-sm sm:text-base md:text-lg max-w-2xl px-1">
            Browse our curated collection of professional salons. Filter by location or service type to find your perfect salon.
          </p>
        </div>

        {/* Layout: Filter Panel + Salon Grid */}
        <div className="grid lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {/* Sidebar Filters - Hidden on mobile, shown on lg+ */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
              <FilterPanel
                onFilterChange={setFilters}
                defaultFilters={filters}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Error State */}
            {error && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 sm:gap-3">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-900 font-medium text-sm sm:text-base">Error loading salons</p>
                  <p className="text-red-700 text-xs sm:text-sm">{error.message}</p>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center py-12 sm:py-16">
                <div className="text-center">
                  <Loader className="animate-spin w-6 h-6 sm:w-8 sm:h-8 text-gold-500 mx-auto mb-2 sm:mb-3" />
                  <p className="text-charcoal-600 text-sm sm:text-base">Loading salons...</p>
                </div>
              </div>
            )}

            {/* Results Header */}
            {!isLoading && (
              <div className="mb-4 sm:mb-6 px-1">
                <p className="text-charcoal-600 text-sm sm:text-base">
                  Showing <span className="font-bold text-charcoal-900">{filteredSalons.length}</span> {filteredSalons.length === 1 ? "salon" : "salons"}
                </p>
              </div>
            )}

            {/* Salon Grid */}
            {!isLoading && filteredSalons.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                {filteredSalons.map((salon) => (
                  <SalonCardCompact key={salon.id} salon={salon} />
                ))}
              </div>
            ) : !isLoading && !error ? (
              <div className="text-center py-12 sm:py-16 bg-charcoal-50 rounded-lg sm:rounded-2xl">
                <p className="text-charcoal-600 text-base sm:text-lg font-medium px-3">
                  No salons found matching your filters
                </p>
                <p className="text-charcoal-500 mt-1 sm:mt-2 text-sm sm:text-base px-3">
                  Try adjusting your search criteria
                </p>
              </div>
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
}
