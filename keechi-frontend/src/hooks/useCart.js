"use client";

import { useState, useEffect } from "react";

export function useCart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("bookingCart");
      if (saved) {
        try {
          setCartItems(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to load cart", e);
        }
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("bookingCart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // Add service to cart
  const addToCart = (service, shopId) => {
    const newItem = {
      id: `${shopId}-${service.id}`,
      shopId,
      serviceId: service.id,
      serviceName: service.name,
      servicePrice: service.price,
      serviceDuration: service.duration,
      quantity: 1,
      addedAt: new Date().toISOString(),
    };

    setCartItems([...cartItems, newItem]);
  };

  // Remove service from cart
  const removeFromCart = (itemId) => {
    const filtered = cartItems.filter((item) => item.id !== itemId);
    setCartItems(filtered);
  };

  // Update quantity
  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    }
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Get cart total
  const getTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.servicePrice * item.quantity, 0);
  };

  // Get cart item count
  const getItemCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
    loading,
  };
}
