"use client";

import { X, Trash2, Minus, Plus, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";

export function CartSidebar({ isOpen, cartItems, onClose, onRemove, onUpdateQuantity, onProceedToBooking }) {
  const total = cartItems.reduce((sum, item) => sum + item.servicePrice * item.quantity, 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleProceed = () => {
    if (cartItems.length === 0) {
      toast.error("Add services to cart first");
      return;
    }
    onProceedToBooking();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-screen w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-charcoal-800 to-charcoal-900 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShoppingCart size={24} />
              Cart
            </h2>
            <p className="text-charcoal-200 text-sm">{itemCount} items</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-charcoal-700 p-2 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart size={48} className="mx-auto text-charcoal-300 mb-4" />
              <p className="text-charcoal-600">Your cart is empty</p>
              <p className="text-charcoal-500 text-sm mt-2">Add services to get started</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-charcoal-50 rounded-lg p-4 border border-charcoal-200"
              >
                {/* Item Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-charcoal-900">{item.serviceName}</h4>
                    <p className="text-sm text-charcoal-600">
                      ৳{item.servicePrice} × {item.quantity}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onRemove(item.id);
                      toast.success("Item removed");
                    }}
                    className="text-red-600 hover:bg-red-50 p-2 rounded transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="p-1 hover:bg-charcoal-200 rounded transition"
                  >
                    <Minus size={16} className="text-charcoal-700" />
                  </button>
                  <span className="flex-1 text-center font-semibold text-charcoal-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="p-1 hover:bg-charcoal-200 rounded transition"
                  >
                    <Plus size={16} className="text-charcoal-700" />
                  </button>
                </div>

                {/* Duration */}
                <p className="text-xs text-charcoal-600 mt-2">
                  Duration: {item.serviceDuration} min
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer - Sticky */}
        {cartItems.length > 0 && (
          <div className="sticky bottom-0 bg-white border-t border-charcoal-200 p-6 space-y-4">
            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-charcoal-900">Total:</span>
              <span className="text-2xl font-bold text-gold-600">৳{total.toFixed(0)}</span>
            </div>

            {/* Proceed Button */}
            <button
              onClick={handleProceed}
              className="w-full px-4 py-3 bg-gradient-to-r from-gold-400 to-gold-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              Proceed to Booking
            </button>

            {/* Clear Cart Button */}
            <button
              onClick={() => {
                const confirmed = window.confirm("Clear all items from cart?");
                if (confirmed) {
                  onRemove("all");
                  toast.success("Cart cleared");
                }
              }}
              className="w-full px-4 py-2 border border-charcoal-300 text-charcoal-700 font-semibold rounded-lg hover:bg-charcoal-50 transition"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
