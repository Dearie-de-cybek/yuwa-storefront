// ============================================================
// useCheckout — Manages checkout against backend API
// Updated to send cart items directly to match orderService.js
// ============================================================

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../store/useStore';

const API_URL = import.meta.env.VITE_API_URL;

export default function useCheckout() {
  const { token } = useAuth();
  const clearCart = useStore((s) => s.clearCart);
  // Grab the current local cart items from the store
  const cart = useStore((s) => s.cart);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);

  // Setup axios instance with auth
  const api = axios.create({
    baseURL: API_URL,
    headers: { Authorization: `Bearer ${token}` },
  });

  /**
   * Place order via checkout endpoint.
   * Note: We send the 'cart' items directly in the body as 
   * 'items' to match the logic in backend/services/orderService.js
   */
  const placeOrder = async ({ shippingAddress, shippingMethod, customerPhone, promotionCode }) => {
    if (cart.length === 0) {
      setError("Your bag is empty.");
      return { success: false, error: "Empty Bag" };
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Sync to server (Optional but good for persistent history)
      // We don't await/block on this because we are sending items in the payload
      useStore.getState().syncToServer().catch(e => console.warn("Background sync failed", e));

      // 2. Trigger the checkout with the DIRECT payload
      // Your orderService.js expects { items, shippingAddress, ... }
      const { data } = await api.post('/api/orders/checkout', {
        items: cart, // This satisfies: const { items } = data; in orderService
        shippingAddress,
        shippingMethod: shippingMethod || 'Standard',
        customerPhone: customerPhone || null,
        promotionCode: promotionCode || null,
      });

      // 3. Success handling
      setOrder(data);
      
      // Clear the local Zustand store and localStorage
      clearCart();

      return { success: true, order: data };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Checkout failed';
      console.error("❌ Checkout Error:", message);
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    order,
    placeOrder,
  };
}