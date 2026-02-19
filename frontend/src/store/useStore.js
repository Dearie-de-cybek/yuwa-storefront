import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const useStore = create(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      isCartOpen: false,
      syncing: false,

      // ============================================================
      // HELPERS
      // ============================================================

      _getToken: () => localStorage.getItem('token'),

      _api: () => {
        const token = localStorage.getItem('token');
        return token
          ? axios.create({ baseURL: API_URL, headers: { Authorization: `Bearer ${token}` } })
          : null;
      },

      // ============================================================
      // CART ACTIONS — Local-first, then sync to backend
      // ============================================================

      addToCart: (product, variant) => {
        set((state) => {
          const existingItem = state.cart.find(
            (item) => item.id === product.id && item.variant.id === variant.id
          );

          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id && item.variant.id === variant.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
              isCartOpen: true,
            };
          }

          return {
            cart: [...state.cart, { ...product, variant, quantity: 1 }],
            isCartOpen: true,
          };
        });

        // Sync to backend (fire-and-forget)
        get()._syncItemToServer(variant.id, 1, 'add');
      },

      removeFromCart: (productId, variantId) => {
        // Find the cart item before removing (for backend sync)
        const item = get().cart.find(
          (i) => i.id === productId && i.variant.id === variantId
        );

        set((state) => ({
          cart: state.cart.filter(
            (i) => !(i.id === productId && i.variant.id === variantId)
          ),
        }));

        // Sync removal to backend
        if (item) get()._syncRemoveFromServer(variantId);
      },

      updateQuantity: (productId, variantId, delta) => {
        set((state) => ({
          cart: state.cart.map((item) => {
            if (item.id === productId && item.variant.id === variantId) {
              const newQuantity = item.quantity + delta;
              return { ...item, quantity: Math.max(1, newQuantity) };
            }
            return item;
          }),
        }));

        // Sync updated quantity to backend
        const updated = get().cart.find(
          (i) => i.id === productId && i.variant.id === variantId
        );
        if (updated) get()._syncQuantityToServer(variantId, updated.quantity);
      },

      clearCart: () => {
        set({ cart: [] });
        const api = get()._api();
        if (api) api.delete('/api/cart').catch(() => {});
      },

      // ============================================================
      // WISHLIST
      // ============================================================

      toggleWishlist: (productId) =>
        set((state) => {
          const exists = state.wishlist.includes(productId);
          return {
            wishlist: exists
              ? state.wishlist.filter((id) => id !== productId)
              : [...state.wishlist, productId],
          };
        }),

      // ============================================================
      // CART DRAWER
      // ============================================================

      toggleCartDrawer: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      closeCartDrawer: () => set({ isCartOpen: false }),

      // ============================================================
      // BACKEND SYNC — Fire-and-forget, never blocks UI
      // ============================================================

      /**
       * Push local cart to server. Called on login or when
       * user has items in localStorage from a guest session.
       */
      syncToServer: async () => {
        const api = get()._api();
        if (!api) return;

        const cart = get().cart;
        if (cart.length === 0) return;

        set({ syncing: true });
        try {
          // Add each local item to the server cart
          for (const item of cart) {
            await api.post('/api/cart/items', {
              variantId: item.variant.id,
              quantity: item.quantity,
            }).catch(() => {
              // Item might be invalid/out of stock — skip silently
            });
          }
        } catch (err) {
          console.error('Cart sync to server failed:', err);
        } finally {
          set({ syncing: false });
        }
      },

      /**
       * Pull server cart into local state. Called on login
       * to merge with any server-side cart data.
       */
      syncFromServer: async () => {
        const api = get()._api();
        if (!api) return;

        set({ syncing: true });
        try {
          const { data } = await api.get('/api/cart');
          if (data.items && data.items.length > 0) {
            // Map server cart items to local shape
            const serverItems = data.items.map((ci) => ({
              id: ci.product.id,
              name: ci.product.name,
              slug: ci.product.slug,
              price: ci.unitPrice,
              image: ci.product.image,
              variant: {
                id: ci.variant.id,
                sku: ci.variant.sku,
                color: ci.variant.color,
                size: ci.variant.size,
                stock: ci.variant.stock,
              },
              quantity: ci.quantity,
            }));

            // Merge: server items take priority, keep local items not on server
            const localCart = get().cart;
            const serverVariantIds = new Set(serverItems.map((i) => i.variant.id));

            const localOnly = localCart.filter((i) => !serverVariantIds.has(i.variant.id));
            set({ cart: [...serverItems, ...localOnly] });
          }
        } catch (err) {
          console.error('Cart sync from server failed:', err);
        } finally {
          set({ syncing: false });
        }
      },

      // ── Internal sync helpers (fire-and-forget) ──

      _syncItemToServer: async (variantId, quantity, action) => {
        const api = get()._api();
        if (!api) return;
        try {
          await api.post('/api/cart/items', { variantId, quantity });
        } catch (err) {
          // Silent fail — local cart is source of truth for UI
          console.warn('Background cart sync failed:', err.response?.data?.message);
        }
      },

      _syncRemoveFromServer: async (variantId) => {
        const api = get()._api();
        if (!api) return;
        try {
          // We need the cart item ID from the server — fetch cart first
          const { data } = await api.get('/api/cart');
          const serverItem = data.items?.find((i) => i.variant.id === variantId);
          if (serverItem) {
            await api.delete(`/api/cart/items/${serverItem.id}`);
          }
        } catch (err) {
          console.warn('Background cart remove failed:', err.response?.data?.message);
        }
      },

      _syncQuantityToServer: async (variantId, quantity) => {
        const api = get()._api();
        if (!api) return;
        try {
          const { data } = await api.get('/api/cart');
          const serverItem = data.items?.find((i) => i.variant.id === variantId);
          if (serverItem) {
            await api.put(`/api/cart/items/${serverItem.id}`, { quantity });
          }
        } catch (err) {
          console.warn('Background cart update failed:', err.response?.data?.message);
        }
      },
    }),
    {
      name: 'yuwa-storage',
      // Only persist cart, wishlist, and drawer state — not syncing flag
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
      }),
    }
  )
);