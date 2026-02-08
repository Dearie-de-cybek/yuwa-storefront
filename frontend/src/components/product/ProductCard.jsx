import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Heart, Check } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function ProductCard({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Connect to Store
  const { wishlist, toggleWishlist, addToCart } = useStore();
  
  const isWishlisted = wishlist.includes(product.id);

  const handleQuickAdd = (e) => {
    e.preventDefault(); // Stop navigation
    addToCart(product, selectedVariant);
    
    // Show "Check" icon briefly
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product.id);
  };

  return (
    <div 
      className="group relative flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. IMAGE CONTAINER */}
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 w-full">
        <Link to={`/product/${product.id}`} className="block h-full w-full">
          <AnimatePresence mode='wait'>
            <motion.img
              key={selectedVariant.image}
              src={selectedVariant.image}
              alt={product.name}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.8 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
          </AnimatePresence>
        </Link>

        {/* Floating Actions */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
          
          {/* Wishlist Button */}
          <button 
            onClick={handleWishlist}
            className={`p-2 rounded-full shadow-sm transition-colors duration-300 ${
              isWishlisted ? 'bg-accent text-white' : 'bg-white hover:bg-accent hover:text-white'
            }`}
          >
            <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
          </button>

          {/* Quick Add Button */}
          <button 
            onClick={handleQuickAdd}
            className={`p-2 rounded-full shadow-sm transition-colors duration-300 ${
              justAdded ? 'bg-green-600 text-white' : 'bg-white hover:bg-primary hover:text-white'
            }`}
            disabled={justAdded}
          >
            {justAdded ? <Check size={18} /> : <Plus size={18} />}
          </button>
        </div>

        {/* Badge */}
        {product.tag && (
          <span className="absolute top-4 left-4 text-[10px] font-bold tracking-widest uppercase bg-white/90 px-2 py-1 text-primary">
            {product.tag}
          </span>
        )}
      </div>

      {/* 2. INFO & VARIANTS */}
      <div className="mt-4 flex justify-between items-start">
        <div>
          <h3 className="text-sm font-serif text-primary">{product.name}</h3>
          <p className="text-xs text-muted mt-1">{product.category}</p>
        </div>
        <p className="text-sm font-medium">${product.price}</p>
      </div>

      <div className="mt-3 flex gap-2">
        {product.variants.map((variant, idx) => (
          <button
            key={idx}
            onClick={(e) => { e.preventDefault(); setSelectedVariant(variant); }}
            className={`w-6 h-6 rounded-full border border-gray-200 p-[2px] transition-all
              ${selectedVariant.id === variant.id ? 'border-accent scale-110' : 'hover:border-gray-400'}
            `}
          >
            {variant.type === 'color' && (
              <div className="w-full h-full rounded-full" style={{ backgroundColor: variant.value }} />
            )}
            {variant.type === 'pattern' && (
              <img src={variant.swatchImage} alt="" className="w-full h-full rounded-full object-cover" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}