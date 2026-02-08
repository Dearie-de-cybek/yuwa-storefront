import { useState, useMemo } from 'react';
import ProductCard from '../../components/product/ProductCard';
import { Filter, ChevronDown, LayoutGrid, Grid2x2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATA ---
const PRODUCTS = [
  {
    id: 1,
    name: "The Zaria Silk Bubu",
    category: "Luxury Bubu",
    price: 180,
    tag: "Best Seller",
    variants: [
      { 
        id: 'v1', 
        colorName: "Emerald", 
        type: 'color', 
        value: '#046c4e', 
        image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=1000&auto=format&fit=crop',
        hoverImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop'
      },
      { 
        id: 'v2', 
        colorName: "Clay", 
        type: 'color', 
        value: '#C15B28', 
        image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop' 
      }
    ]
  },
  {
    id: 2,
    name: "Lagos City Midi",
    category: "Ready-to-Wear",
    price: 120,
    tag: "New",
    variants: [
      { 
        id: 'v1', 
        colorName: "Ankara Print", 
        type: 'pattern', 
        swatchImage: 'https://images.unsplash.com/photo-1605763240004-7e93b172d754?q=80&w=100&auto=format&fit=crop', 
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop',
        hoverImage: 'https://images.unsplash.com/photo-1572804013427-4d7ca2736179?q=80&w=1000&auto=format&fit=crop'
      },
      { 
        id: 'v2', 
        colorName: "Noir", 
        type: 'color', 
        value: '#000000', 
        image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1000&auto=format&fit=crop' 
      }
    ]
  },
  {
    id: 3,
    name: "Adire Wrap Set",
    category: "Co-ords",
    price: 155,
    tag: null,
    variants: [
      { 
        id: 'v1', 
        colorName: "Indigo", 
        type: 'color', 
        value: '#4B0082', 
        image: 'https://images.unsplash.com/photo-1589451397839-49774a3838dc?q=80&w=1000&auto=format&fit=crop' 
      }
    ]
  }
];

export default function Shop() {
  // State for Layout & Filtering
  const [gridCols, setGridCols] = useState(4); // 2 or 4
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState('newest'); // 'newest', 'price-asc', 'price-desc'
  const [activeFilters, setActiveFilters] = useState({
    priceRange: null, // 'under-150', 'over-150'
  });

  // LOGIC: Filter & Sort Products
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // 1. Filter
    if (activeFilters.priceRange === 'under-150') {
      result = result.filter(p => p.price < 150);
    } else if (activeFilters.priceRange === 'over-150') {
      result = result.filter(p => p.price >= 150);
    }

    // 2. Sort
    if (sortOption === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else {
      // 'newest' (assuming ID indicates newness for now, or just default order)
      result.sort((a, b) => b.id - a.id); 
    }

    return result;
  }, [sortOption, activeFilters]);

  // Determine Grid Class
  const getGridClass = () => {
    if (gridCols === 2) return "grid-cols-2 gap-x-4 gap-y-10";
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12";
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 bg-white">
      
      {/* 1. HEADER & CONTROLS */}
      <div className="flex flex-col mb-8 max-w-[1440px] mx-auto">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif mb-2">Ready to Wear</h1>
            <p className="text-muted text-sm">Everyday luxury for the modern woman.</p>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="flex flex-wrap items-center justify-between border-y border-border py-4 sticky top-20 bg-white/95 backdrop-blur z-30">
          
          {/* Left: Filter & Sort */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 text-xs uppercase tracking-widest hover:text-accent transition-colors ${isFilterOpen ? 'text-accent' : ''}`}
            >
              Filter <Filter size={14} />
            </button>
            
            <div className="relative group">
              <button className="flex items-center gap-2 text-xs uppercase tracking-widest hover:text-accent transition-colors">
                Sort: {sortOption.replace('-', ' ')} <ChevronDown size={14} />
              </button>
              {/* Sort Dropdown */}
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-40">
                <div className="bg-white border border-border shadow-lg w-40 flex flex-col">
                  {[
                    { label: 'Newest', val: 'newest' },
                    { label: 'Price: Low to High', val: 'price-asc' },
                    { label: 'Price: High to Low', val: 'price-desc' }
                  ].map(opt => (
                    <button 
                      key={opt.val}
                      onClick={() => setSortOption(opt.val)}
                      className="text-left px-4 py-3 text-sm hover:bg-secondary hover:text-accent"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Grid Toggles (Desktop Only) */}
          <div className="hidden lg:flex items-center gap-4 text-muted">
            <button 
              onClick={() => setGridCols(2)}
              className={`hover:text-primary transition-colors ${gridCols === 2 ? 'text-primary' : ''}`}
            >
              <Grid2x2 size={20} strokeWidth={1.5} />
            </button>
            <button 
              onClick={() => setGridCols(4)}
              className={`hover:text-primary transition-colors ${gridCols === 4 ? 'text-primary' : ''}`}
            >
              <LayoutGrid size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* EXPANDABLE FILTER PANEL */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-secondary"
            >
              <div className="py-8 px-4 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1440px] mx-auto">
                <div>
                  <h4 className="font-serif mb-4">Price Range</h4>
                  <div className="space-y-2 text-sm text-muted">
                    <button 
                      onClick={() => setActiveFilters({...activeFilters, priceRange: null})}
                      className={`block hover:text-accent ${!activeFilters.priceRange ? 'text-accent font-medium' : ''}`}
                    >
                      All Prices
                    </button>
                    <button 
                      onClick={() => setActiveFilters({...activeFilters, priceRange: 'under-150'})}
                      className={`block hover:text-accent ${activeFilters.priceRange === 'under-150' ? 'text-accent font-medium' : ''}`}
                    >
                      Under $150
                    </button>
                    <button 
                      onClick={() => setActiveFilters({...activeFilters, priceRange: 'over-150'})}
                      className={`block hover:text-accent ${activeFilters.priceRange === 'over-150' ? 'text-accent font-medium' : ''}`}
                    >
                      $150 +
                    </button>
                  </div>
                </div>
                {/* Add more filter categories here (Color, Size) later */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. THE GRID */}
      <div className={`grid ${getGridClass()} max-w-[1440px] mx-auto transition-all duration-500 ease-in-out`}>
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="py-20 text-center text-muted">
          <p>No products match your filters.</p>
          <button 
            onClick={() => setActiveFilters({ priceRange: null })}
            className="mt-4 text-accent border-b border-accent"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* 3. LOAD MORE */}
      {filteredProducts.length > 0 && (
        <div className="mt-20 text-center">
          <button className="border border-primary px-10 py-3 text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-300">
            Load More
          </button>
        </div>
      )}

    </div>
  );
}