import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// i am using 'persist' so the cart/wishlist is saved to LocalStorage automatically do not forget
export const useStore = create(
  persist(
    (set) => ({
      cart: [],
      wishlist: [], 
      isCartOpen: false,

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

      toggleWishlist: (productId) => set((state) => {
        const exists = state.wishlist.includes(productId);
        return {
          wishlist: exists 
            ? state.wishlist.filter((id) => id !== productId) 
            : [...state.wishlist, productId]
        };
      }),

      updateQuantity: (productId, variantId, delta) => set((state) => ({
  cart: state.cart.map(item => {
    if (item.id === productId && item.variant.id === variantId) {
      const newQuantity = item.quantity + delta;
      return { ...item, quantity: Math.max(1, newQuantity) }; 
    }
    return item;
  })
})),

      toggleCartDrawer: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
    }),
    {
      name: 'yuwa-storage', 
    }
  )
);