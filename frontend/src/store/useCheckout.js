// ============================================================
// useCheckout — Manages checkout flow against backend API
// ============================================================

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import useCartStore from '../../store/useCartStore';

const API_URL = import.meta.env.VITE_API_URL;

export default function useCheckout() {
  const { token, user } = useAuth();
  const clearCart = useCartStore((s) => s.clearCart);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);

  const api = axios.create({
    baseURL: API_URL,
    headers: { Authorization: `Bearer ${token}` },
  });

  /**
   * Place order via backend checkout endpoint.
   * @param {Object} params
   * @param {Object} params.shippingAddress - { firstName, lastName, street, city, state, zip, country, phone }
   * @param {string} params.shippingMethod  - 'Standard' | 'Express' | 'Same Day'
   * @param {string} params.customerPhone
   * @param {string} params.promotionCode   - Optional promo code
   */
  const placeOrder = async ({ shippingAddress, shippingMethod, customerPhone, promotionCode }) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.post('/api/orders/checkout', {
        shippingAddress,
        shippingMethod: shippingMethod || 'Standard',
        customerPhone: customerPhone || null,
        promotionCode: promotionCode || null,
      });

      setOrder(data);

      // Cart is cleared on the backend, sync local state
      useCartStore.getState().reset();

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

  /**
   * Validate a promo code before placing order.
   */
  const validatePromo = async (code, subtotal) => {
    // For now, we'll validate at checkout time.
    // The backend validates promo during the checkout call.
    // This is a placeholder if you want pre-validation later.
    return { valid: true, code };
  };

  return {
    loading,
    error,
    order,
    placeOrder,
    validatePromo,
  };
}