import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
  const { cart, isCartOpen, closeCartDrawer, removeFromCart, updateQuantity } = useStore();

  // Calculate Subtotal
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Disable body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* 1. Backdrop (Click to close) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCartDrawer}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
          />

          {/* 2. The Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "tween", duration: 0.4, ease: "circOut" }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col border-l border-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-serif text-2xl">Shopping Bag ({cart.length})</h2>
              <button onClick={closeCartDrawer} className="hover:text-accent transition-colors">
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Cart Items (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {cart.length === 0 ? (
                <div className="text-center mt-20 text-muted">
                  <p>Your bag is empty.</p>
                  <button 
                    onClick={closeCartDrawer}
                    className="mt-4 text-accent border-b border-accent text-sm"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={`${item.id}-${item.variant.id}`} className="flex gap-4">
                    {/* Image */}
                    <div className="w-24 h-32 bg-secondary flex-shrink-0 overflow-hidden">
                      <img src={item.variant.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-serif text-lg leading-tight">{item.name}</h3>
                          <p className="font-medium">${item.price * item.quantity}</p>
                        </div>
                        <p className="text-xs text-muted mt-1 uppercase tracking-wide">
                          {item.variant.colorName}
                        </p>
                      </div>

                      {/* Controls */}
                      <div className="flex justify-between items-end">
                        <div className="flex items-center border border-border">
                          <button 
                            onClick={() => updateQuantity(item.id, item.variant.id, -1)}
                            className="p-2 hover:bg-secondary transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.variant.id, 1)}
                            className="p-2 hover:bg-secondary transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button 
                          onClick={() => removeFromCart(item.id, item.variant.id)}
                          className="text-muted hover:text-red-500 transition-colors text-xs underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer (Checkout) */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-border bg-secondary/30">
                <div className="flex justify-between items-center mb-4 text-lg font-medium">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted mb-6">Shipping & taxes calculated at checkout.</p>
                
                <Link 
                  to="/checkout"
                  onClick={closeCartDrawer}
                  className="w-full bg-primary text-white py-4 flex items-center justify-center gap-3 uppercase tracking-widest text-sm hover:bg-accent transition-colors duration-300"
                >
                  Checkout <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}