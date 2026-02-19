// ============================================================
// useCheckout — Manages checkout against backend API
// Works with the existing useStore for cart data
// ============================================================

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../store/useStore';

const API_URL = import.meta.env.VITE_API_URL;

export default function useCheckout() {
  const { token } = useAuth();
  const clearCart = useStore((s) => s.clearCart);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);

  const api = axios.create({
    baseURL: API_URL,
    headers: { Authorization: `Bearer ${token}` },
  });

  /**
   * Sync local cart to server, then place order via checkout endpoint.
   *
   * We sync first because the backend checkout reads from the
   * server-side cart (not the request body). This ensures
   * whatever is in localStorage ends up on the server before
   * the order is created.
   */
  const placeOrder = async ({ shippingAddress, shippingMethod, customerPhone, promotionCode }) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Ensure local cart is synced to server
      await useStore.getState().syncToServer();

      // 2. Place order (backend reads from server cart)
      const { data } = await api.post('/api/orders/checkout', {
        shippingAddress,
        shippingMethod: shippingMethod || 'Standard',
        customerPhone: customerPhone || null,
        promotionCode: promotionCode || null,
      });

      setOrder(data);

      // 3. Clear local cart (server cart already cleared by backend)
      clearCart();

      return { success: true, order: data };
    } catch (err) {
      const message = err.response?.data?.message || 'Checkout failed';
      const details = err.response?.data?.details || null;
      setError(message);
      return { success: false, error: message, details };
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