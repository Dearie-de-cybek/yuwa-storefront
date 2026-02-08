import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      cart: [],
      wishlist: [],
      isCartOpen: false,

      // ACTIONS
      addToCart: (product, variant) => set((state) => {
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
            isCartOpen: true 
          };
        }

        return {
          cart: [...state.cart, { ...product, variant, quantity: 1 }],
          isCartOpen: true
        };
      }),

      removeFromCart: (productId, variantId) => set((state) => ({
        cart: state.cart.filter(
          (item) => !(item.id === productId && item.variant.id === variantId)
        )
      })),

      updateQuantity: (productId, variantId, delta) => set((state) => ({
        cart: state.cart.map(item => {
          if (item.id === productId && item.variant.id === variantId) {
            const newQuantity = item.quantity + delta;
            return { ...item, quantity: Math.max(1, newQuantity) };
          }
          return item;
        })
      })),

      toggleWishlist: (productId) => set((state) => {
        const exists = state.wishlist.includes(productId);
        return {
          wishlist: exists 
            ? state.wishlist.filter((id) => id !== productId)
            : [...state.wishlist, productId]
        };
      }),

      toggleCartDrawer: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      closeCartDrawer: () => set({ isCartOpen: false }), 
      // ----------------------------------------
    }),
    {
      name: 'yuwa-storage',
    }
  )
);