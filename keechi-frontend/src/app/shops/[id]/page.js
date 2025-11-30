"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { HeroShopHeader } from "@/components/HeroShopHeader";
import { ServicesList } from "@/components/ServicesList";
import { CartSidebar } from "@/components/CartSidebar";
import { SlotPickerModal } from "@/components/SlotPickerModal";
import { Gallery } from "@/components/Gallery";
import { ReviewsSection } from "@/components/ReviewsSection";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";

export default function ShopPage() {
  const params = useParams();
  const router = useRouter();
  const shopId = params.id;
  const { user: authUser, loading: authLoading } = useAuth();
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getItemCount } = useCart();

  const [shop, setShop] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  const [showSlotPicker, setShowSlotPicker] = useState(false);

  // Redirect shop owners to dashboard
  useEffect(() => {
    if (!authLoading && authUser?.role === "shopOwner") {
      router.push("/dashboard");
    }
  }, [authUser, authLoading, router]);

  // Get current user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse stored user", err);
      }
    }
  }, []);

  // Fetch shop and services
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [shopRes, servicesRes] = await Promise.all([
          api.get(`/shops/${shopId}`),
          api.get(`/services?shopId=${shopId}`),
        ]);

        setShop(shopRes.data);
        const servicesList = Array.isArray(servicesRes.data) ? servicesRes.data : (servicesRes.data.services || []);
        setServices(servicesList);
      } catch (err) {
        console.error("Error fetching shop:", err);
        toast.error("Failed to load shop details");
      } finally {
        setLoading(false);
      }
    };

    if (shopId) {
      fetchData();
    }
  }, [shopId]);

  // Handle adding to cart
  const handleAddToCart = (service, sId) => {
    addToCart(service, sId);
  };

  // Handle removing from cart
  const handleRemoveFromCart = (itemId) => {
    if (itemId === "all") {
      clearCart();
      toast.success("Cart cleared");
    } else {
      removeFromCart(itemId);
      toast.success("Item removed from cart");
    }
  };

  // Handle proceeding to booking
  const handleProceedToBooking = () => {
    if (!user) {
      toast.error("Please sign in to book");
      return;
    }

    if (user?.role !== "user") {
      toast.error("Only customers can book appointments");
      return;
    }

    setShowCartSidebar(false);
    setShowSlotPicker(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500 mx-auto mb-4"></div>
          <p className="text-charcoal-600">Loading shop details...</p>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-charcoal-900 mb-2">Shop not found</h1>
          <p className="text-charcoal-600">Sorry, we couldn't find this shop.</p>
        </div>
      </div>
    );
  }

  const itemCount = getItemCount();

  return (
    <div className="min-h-screen bg-white">
      {/* Cart Button (Floating) */}
      <button
        onClick={() => setShowCartSidebar(true)}
        className={`fixed bottom-8 right-8 z-40 rounded-full shadow-2xl transition-all flex items-center justify-center gap-2 px-6 py-3 ${itemCount > 0
            ? "bg-gradient-to-r from-gold-400 to-gold-500 text-white hover:shadow-xl"
            : "bg-charcoal-300 text-charcoal-600"
          }`}
      >
        <ShoppingCart size={20} />
        <span className="font-bold">{itemCount}</span>
      </button>

      {/* Hero Header */}
      <HeroShopHeader shop={shop} />

      {/* Services List */}
      {services.length > 0 ? (
        <ServicesList services={services} shopId={shopId} onAddToCart={handleAddToCart} />
      ) : !loading ? (
        <div className="py-12 px-4 bg-charcoal-50">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-charcoal-600">No services available for this shop yet.</p>
          </div>
        </div>
      ) : null}

      {/* Gallery */}
      {shop.galleryImages && shop.galleryImages.length > 0 && (
        <Gallery images={shop.galleryImages} />
      )}

      {/* Reviews */}
      <ReviewsSection shopId={shopId} userId={user?.id} />

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={showCartSidebar}
        cartItems={cartItems}
        onClose={() => setShowCartSidebar(false)}
        onRemove={handleRemoveFromCart}
        onUpdateQuantity={updateQuantity}
        onProceedToBooking={handleProceedToBooking}
      />

      {/* Slot Picker Modal for Cart */}
      {showSlotPicker && cartItems.length > 0 && (
        <SlotPickerModal
          cartItems={cartItems}
          shopId={shopId}
          onClose={() => setShowSlotPicker(false)}
          onConfirm={async (bookingData) => {
            try {
              // Create multiple appointments for each cart item
              const appointments = [];
              for (const item of cartItems) {
                for (let i = 0; i < item.quantity; i++) {
                  const response = await api.post("/appointments", {
                    shopId: parseInt(shopId),
                    serviceId: item.serviceId,
                    dateTime: bookingData.dateTime,
                    notes: "",
                    teamMemberId: bookingData.teamMemberId,
                  });
                  appointments.push(response.data);
                }
              }

              toast.success("All bookings confirmed!");
              setShowSlotPicker(false);
              clearCart();

              // Redirect to booking confirmation page with first appointment
              setTimeout(() => {
                window.location.href = `/booking-confirmation?id=${appointments[0].id}`;
              }, 1500);
            } catch (err) {
              console.error("Booking error:", err);
              toast.error(err.response?.data?.message || "Failed to create bookings");
            }
          }}
        />
      )}
    </div>
  );
}
