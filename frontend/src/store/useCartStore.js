// ============================================================
// CART STORE — Zustand + Backend API sync
// ============================================================
// Manages cart state locally for fast UI, syncs with backend
// for persistent server-side cart when user is logged in.
// ============================================================

import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const useCartStore = create((set, get) => ({
  items: [],
  subtotal: 0,
  itemCount: 0,
  loading: false,
  error: null,

  // ── Get auth header from localStorage ──
  _getHeaders: () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  _isLoggedIn: () => !!localStorage.getItem('token'),

  // ============================================================
  // FETCH CART FROM BACKEND
  // ============================================================
  fetchCart: async () => {
    if (!get()._isLoggedIn()) return;

    set({ loading: true, error: null });
    try {
      const { data } = await axios.get(`${API_URL}/api/cart`, {
        headers: get()._getHeaders(),
      });
      set({
        items: data.items || [],
        subtotal: data.subtotal || 0,
        itemCount: data.itemCount || 0,
        loading: false,
      });
    } catch (error) {
      console.error('Cart fetch failed:', error);
      set({ loading: false, error: 'Failed to load cart' });
    }
  },

  // ============================================================
  // ADD ITEM
  // ============================================================
  addItem: async (variantId, quantity = 1) => {
    if (!get()._isLoggedIn()) {
      set({ error: 'Please log in to add items to your bag' });
      return { error: 'not_logged_in' };
    }

    set({ loading: true, error: null });
    try {
      const { data } = await axios.post(
        `${API_URL}/api/cart/items`,
        { variantId, quantity },
        { headers: get()._getHeaders() }
      );
      set({
        items: data.items || [],
        subtotal: data.subtotal || 0,
        itemCount: data.itemCount || 0,
        loading: false,
      });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add item';
      set({ loading: false, error: message });
      return { error: message };
    }
  },

  // ============================================================
  // UPDATE QUANTITY
  // ============================================================
  updateQuantity: async (cartItemId, quantity) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.put(
        `${API_URL}/api/cart/items/${cartItemId}`,
        { quantity },
        { headers: get()._getHeaders() }
      );
      set({
        items: data.items || [],
        subtotal: data.subtotal || 0,
        itemCount: data.itemCount || 0,
        loading: false,
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update item';
      set({ loading: false, error: message });
    }
  },

  // ============================================================
  // REMOVE ITEM
  // ============================================================
  removeItem: async (cartItemId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.delete(
        `${API_URL}/api/cart/items/${cartItemId}`,
        { headers: get()._getHeaders() }
      );
      set({
        items: data.items || [],
        subtotal: data.subtotal || 0,
        itemCount: data.itemCount || 0,
        loading: false,
      });
    } catch (error) {
      set({ loading: false, error: 'Failed to remove item' });
    }
  },

  // ============================================================
  // CLEAR CART
  // ============================================================
  clearCart: async () => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${API_URL}/api/cart`, {
        headers: get()._getHeaders(),
      });
      set({ items: [], subtotal: 0, itemCount: 0, loading: false });
    } catch (error) {
      set({ loading: false, error: 'Failed to clear cart' });
    }
  },

  // ============================================================
  // RESET (on logout)
  // ============================================================
  reset: () => set({ items: [], subtotal: 0, itemCount: 0, loading: false, error: null }),
}));

export default useCartStore;