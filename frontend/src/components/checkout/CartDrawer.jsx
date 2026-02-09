import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ArrowRight, ShoppingBag, Trash2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
  // 1. Destructure ALL actions and state clearly
  const { 
    cart, 
    isCartOpen, 
    closeCartDrawer, 
    removeFromCart, 
    updateQuantity 
  } = useStore();

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
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] cursor-pointer"
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
            <div className="flex items-center justify-between p-6 border-b border-border bg-white z-10">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} />
                <h2 className="font-serif text-xl">Shopping Bag ({cart.length})</h2>
              </div>
              <button 
                onClick={closeCartDrawer} 
                className="p-2 hover:bg-secondary rounded-full transition-colors cursor-pointer group"
              >
                <X size={24} strokeWidth={1.5} className="group-hover:text-accent" />
              </button>
            </div>

            {/* Cart Items (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-muted">
                    <ShoppingBag size={32} strokeWidth={1} />
                  </div>
                  <p className="text-muted font-light">Your bag is currently empty.</p>
                  <button 
                    onClick={closeCartDrawer}
                    className="mt-4 text-primary border-b border-primary pb-1 hover:text-accent hover:border-accent transition-colors cursor-pointer uppercase text-xs tracking-widest"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={`${item.id}-${item.variant.id}`} className="flex gap-4 group">
                    {/* Image */}
                    <Link 
                      to={`/product/${item.id}`} 
                      onClick={closeCartDrawer}
                      className="w-24 h-32 bg-secondary flex-shrink-0 overflow-hidden relative cursor-pointer"
                    >
                      <img src={item.variant.image} alt={item.name} className="w-full h-full object-cover" />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <Link 
                            to={`/product/${item.id}`}
                            onClick={closeCartDrawer} 
                            className="font-serif text-base leading-tight pr-4 hover:text-accent transition-colors"
                          >
                            {item.name}
                          </Link>
                          <p className="font-medium text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        
                        {/* VARIANT DETAILS (Size & Color) */}
                        <div className="text-xs text-muted mt-2 space-y-1">
                          <p className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: item.variant.colorName === 'Emerald' ? '#046c4e' : '#C15B28' }}></span>
                            {item.variant.colorName}
                          </p>
                          <p className="uppercase tracking-wide font-medium">
                            Size: <span className="text-primary">{item.variant.size}</span>
                          </p>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex justify-between items-center mt-4">
                        {/* Quantity Selector */}
                        <div className="flex items-center border border-border rounded-sm">
                          <button 
                            onClick={() => updateQuantity(item.id, item.variant.id, -1)}
                            className="p-2 hover:bg-secondary hover:text-accent transition-colors cursor-pointer disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-medium select-none">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.variant.id, 1)}
                            className="p-2 hover:bg-secondary hover:text-accent transition-colors cursor-pointer"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button 
                          onClick={() => removeFromCart(item.id, item.variant.id)}
                          className="text-muted hover:text-red-500 transition-colors text-xs flex items-center gap-1 cursor-pointer group"
                        >
                          <Trash2 size={14} className="group-hover:stroke-red-500" /> Remove
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
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium uppercase tracking-wider text-muted">Subtotal</span>
                  <span className="text-xl font-serif">${subtotal.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted mb-6 text-center italic">Shipping & taxes calculated at checkout.</p>
                
                <Link 
                  to="/checkout"
                  onClick={closeCartDrawer}
                  className="w-full bg-primary text-white py-4 flex items-center justify-center gap-3 uppercase tracking-widest text-sm hover:bg-accent hover:gap-4 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
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