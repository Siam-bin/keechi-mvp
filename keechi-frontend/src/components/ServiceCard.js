"use client";

import { Clock, DollarSign, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";

export function ServiceCard({ service, shopId, onAddToCart }) {
  const handleAddToCart = () => {
    onAddToCart(service, shopId);
    toast.success(`${service.name} added to cart!`);
  };

  return (
    <div className="bg-white border border-charcoal-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* Service Image (optional) */}
      {service.imageUrl && (
        <div className="h-40 bg-charcoal-100 overflow-hidden">
          <img
            src={service.imageUrl}
            alt={service.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Service Info */}
      <div className="p-5">
        {/* Category Badge */}
        {service.category && (
          <div className="inline-block px-3 py-1 bg-gold-100 text-gold-700 text-xs font-semibold rounded-full mb-3">
            {service.category}
          </div>
        )}

        {/* Service Name */}
        <h3 className="text-lg font-bold text-charcoal-900 mb-2">{service.name}</h3>

        {/* Description */}
        {service.description && (
          <p className="text-sm text-charcoal-600 mb-4 line-clamp-2">{service.description}</p>
        )}

        {/* Duration & Price */}
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-charcoal-100">
          <div className="flex items-center gap-2 text-charcoal-700">
            <Clock size={16} className="text-gold-500" />
            <span className="text-sm font-medium">{service.duration} min</span>
          </div>
          <div className="flex items-center gap-2 text-charcoal-900">
            <DollarSign size={16} className="text-gold-500" />
            <span className="text-lg font-bold">৳{service.price.toFixed(0)}</span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full px-4 py-2.5 bg-gradient-to-r from-gold-400 to-gold-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
        >
          <ShoppingCart size={18} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
