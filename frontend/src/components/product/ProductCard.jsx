import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Heart } from 'lucide-react';

export default function ProductCard({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. IMAGE CONTAINER (Editorial 3:4 Ratio) */}
      <div className="relative aspect-3/4 overflow-hidden bg-neutral-100 w-full">
        
        {/* The Image Switcher */}
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
          
          {selectedVariant.hoverImage && (
             <img 
               src={selectedVariant.hoverImage}
               alt=""
               className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
             />
          )}
        </Link>

        {/* African Pattern Overlay */}
        <div className="absolute top-0 right-0 w-1 h-0 bg-accent transition-all duration-300 group-hover:h-16" />
        
        {/* Quick Actions (Floating) */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
          <button className="bg-white p-2 rounded-full shadow-sm hover:bg-accent hover:text-white transition-colors">
            <Heart size={18} />
          </button>
          <button className="bg-white p-2 rounded-full shadow-sm hover:bg-accent hover:text-white transition-colors">
            <Plus size={18} />
          </button>
        </div>

        {/* Badge (e.g., "New Season") */}
        {product.tag && (
          <span className="absolute top-4 left-4 text-[10px] font-bold tracking-widest uppercase bg-white/90 px-2 py-1 text-primary">
            {product.tag}
          </span>
        )}
      </div>

      {/* 2. PRODUCT INFO */}
      <div className="mt-4 flex justify-between items-start">
        <div>
          <Link to={`/product/${product.id}`}>
            <h3 className="text-sm font-serif text-primary hover:text-accent transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-muted mt-1">{product.category}</p>
        </div>
        <p className="text-sm font-medium text-primary">
          ${product.price}
        </p>
      </div>

      {/* 3. COLOR/FABRIC SELECTOR*/}
      <div className="mt-3 flex gap-2">
        {product.variants.map((variant, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.preventDefault(); 
              setSelectedVariant(variant);
            }}
            className={`w-6 h-6 rounded-full border border-gray-200 p-0.5 transition-all
              ${selectedVariant.id === variant.id ? 'border-accent scale-110' : 'hover:border-gray-400'}
            `}
            title={variant.colorName}
          >
            {/* If it's a solid color */}
            {variant.type === 'color' && (
              <div 
                className="w-full h-full rounded-full" 
                style={{ backgroundColor: variant.value }} 
              />
            )}
            {/* If it's a fabric pattern */}
            {variant.type === 'pattern' && (
              <img 
                src={variant.swatchImage} 
                alt={variant.colorName}
                className="w-full h-full rounded-full object-cover" 
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}