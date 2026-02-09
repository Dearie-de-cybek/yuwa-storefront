import { useState, useMemo, useEffect } from 'react';
import ProductCard from '../../components/product/ProductCard';
import { Filter, ChevronDown, LayoutGrid, Grid2x2, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- ROBUST MOCK DATA ---
const PRODUCTS = [
  {
    id: 1,
    name: "The Zaria Silk Bubu",
    category: "Luxury Bubu",
    fabric: "Silk",
    price: 180,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Emerald", "Clay"],
    tag: "Best Seller",
    variants: [
      { id: 'v1', colorName: "Emerald", type: 'color', value: '#046c4e', image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=1000&auto=format&fit=crop', hoverImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop' },
      { id: 'v2', colorName: "Clay", type: 'color', value: '#C15B28', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop' }
    ]
  },
  {
    id: 2,
    name: "Lagos City Midi",
    category: "Ready-to-Wear",
    fabric: "Cotton",
    price: 120,
    sizes: ["XS", "S", "M"],
    colors: ["Ankara Print", "Noir"],
    tag: "New",
    variants: [
      { id: 'v1', colorName: "Ankara Print", type: 'pattern', swatchImage: 'https://images.unsplash.com/photo-1605763240004-7e93b172d754?q=80&w=100', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000', hoverImage: 'https://images.unsplash.com/photo-1572804013427-4d7ca2736179?q=80&w=1000' },
      { id: 'v2', colorName: "Noir", type: 'color', value: '#000000', image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1000' }
    ]
  },
  {
    id: 3,
    name: "Adire Wrap Set",
    category: "Co-ords",
    fabric: "Adire",
    price: 155,
    sizes: ["M", "L", "XL"],
    colors: ["Indigo"],
    tag: null,
    variants: [
      { id: 'v1', colorName: "Indigo", type: 'color', value: '#4B0082', image: 'https://images.unsplash.com/photo-1589451397839-49774a3838dc?q=80&w=1000' }
    ]
  },
  {
    id: 4,
    name: "Othello Maxi",
    category: "Luxury Bubu",
    fabric: "Chiffon",
    price: 210,
    sizes: ["L", "XL", "XXL"],
    colors: ["Gold"],
    tag: "Limited",
    variants: [
      { id: 'v1', colorName: "Gold", type: 'color', value: '#D4AF37', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000' } 
    ]
  }
];

// --- FILTER CONFIGURATION ---
const AVAILABLE_FILTERS = {
  categories: ["Luxury Bubu", "Ready-to-Wear", "Co-ords"],
  sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  fabrics: ["Silk", "Cotton", "Adire", "Chiffon"],
  colors: [
    { name: "Emerald", value: "#046c4e" },
    { name: "Clay", value: "#C15B28" },
    { name: "Noir", value: "#000000" },
    { name: "Indigo", value: "#4B0082" },
    { name: "Gold", value: "#D4AF37" }
  ],
  priceRanges: [
    { label: "Under $150", min: 0, max: 150 },
    { label: "$150 - $200", min: 150, max: 200 },
    { label: "$200+", min: 200, max: 10000 }
  ]
};

export default function Shop() {
  const [gridCols, setGridCols] = useState(4);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState('newest');

  // STATE: Multi-Select Filters
  const [filters, setFilters] = useState({
    categories: [],
    sizes: [],
    fabrics: [],
    colors: [],
    priceRange: null // Single select for simplicity, or could be multi
  });

  // LOGIC: Filter & Sort
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // 1. Categories
    if (filters.categories.length > 0) {
      result = result.filter(p => filters.categories.includes(p.category));
    }
    // 2. Sizes (Product must have AT LEAST one of the selected sizes)
    if (filters.sizes.length > 0) {
      result = result.filter(p => p.sizes.some(s => filters.sizes.includes(s)));
    }
    // 3. Fabrics
    if (filters.fabrics.length > 0) {
      result = result.filter(p => filters.fabrics.includes(p.fabric));
    }
    // 4. Colors
    if (filters.colors.length > 0) {
      result = result.filter(p => p.colors.some(c => filters.colors.includes(c)));
    }
    // 5. Price
    if (filters.priceRange) {
      const range = AVAILABLE_FILTERS.priceRanges.find(r => r.label === filters.priceRange);
      if (range) {
        result = result.filter(p => p.price >= range.min && p.price <= range.max);
      }
    }

    // 6. Sort
    if (sortOption === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sortOption === 'price-desc') result.sort((a, b) => b.price - a.price);
    else result.sort((a, b) => b.id - a.id); // Newest

    return result;
  }, [filters, sortOption]);

  // Handler: Toggle Array Filters
  const toggleFilter = (type, value) => {
    setFilters(prev => {
      const current = prev[type];
      const isSelected = current.includes(value);
      return {
        ...prev,
        [type]: isSelected ? current.filter(item => item !== value) : [...current, value]
      };
    });
  };

  const clearFilters = () => {
    setFilters({ categories: [], sizes: [], fabrics: [], colors: [], priceRange: null });
  };

  const getGridClass = () => {
    if (gridCols === 2) return "grid-cols-2 gap-x-4 gap-y-10";
    return "grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12";
  };

  // Helper: Count Active Filters
  const activeCount = Object.values(filters).flat().length + (filters.priceRange ? 1 : 0);

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 bg-white">
      
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col mb-8 max-w-[1440px] mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif mb-2">Ready to Wear</h1>
        <p className="text-muted text-sm mb-6">Everyday luxury for the modern woman.</p>

        {/* TOOLBAR */}
        <div className="flex flex-wrap items-center justify-between border-y border-border py-4 sticky top-20 bg-white/95 backdrop-blur z-30">
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 text-xs uppercase tracking-widest hover:text-accent transition-colors"
            >
              Filter {activeCount > 0 && <span className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-[10px]">{activeCount}</span>}
              <Filter size={14} />
            </button>
            
            {/* Sort Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 text-xs uppercase tracking-widest hover:text-accent transition-colors">
                Sort: {sortOption.replace('-', ' ')} <ChevronDown size={14} />
              </button>
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-40">
                <div className="bg-white border border-border shadow-lg w-40 flex flex-col">
                  {[{label:'Newest',v:'newest'},{label:'Price: Low to High',v:'price-asc'},{label:'Price: High to Low',v:'price-desc'}].map(o => (
                    <button key={o.v} onClick={() => setSortOption(o.v)} className="text-left px-4 py-3 text-sm hover:bg-secondary hover:text-accent">{o.label}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4 text-muted">
            <button onClick={() => setGridCols(2)} className={`hover:text-primary ${gridCols === 2 ? 'text-primary' : ''}`}><Grid2x2 size={20} strokeWidth={1.5}/></button>
            <button onClick={() => setGridCols(4)} className={`hover:text-primary ${gridCols === 4 ? 'text-primary' : ''}`}><LayoutGrid size={20} strokeWidth={1.5}/></button>
          </div>
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className={`grid ${getGridClass()} max-w-[1440px] mx-auto transition-all duration-500`}>
        {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
      </div>

      {/* EMPTY STATE */}
      {filteredProducts.length === 0 && (
        <div className="py-32 text-center text-muted">
          <p className="text-lg font-serif mb-2">No products match your filters.</p>
          <button onClick={clearFilters} className="text-accent underline text-sm">Clear all filters</button>
        </div>
      )}


      {/* --- FILTER DRAWER (THE ELEGANT UPGRADE) --- */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.4, ease: "circOut" }}
              className="fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white shadow-2xl z-[70] flex flex-col border-r border-border"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="font-serif text-2xl">Filter</h2>
                <button onClick={() => setIsFilterOpen(false)} className="hover:text-accent"><X size={24} /></button>
              </div>

              {/* Scrollable Filters */}
              <div className="flex-1 overflow-y-auto p-6 space-y-10">
                
                {/* 1. Category */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Category</h3>
                  <div className="space-y-3">
                    {AVAILABLE_FILTERS.categories.map(cat => (
                      <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${filters.categories.includes(cat) ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                          {filters.categories.includes(cat) && <Check size={10} className="text-white" />}
                        </div>
                        <input type="checkbox" className="hidden" onChange={() => toggleFilter('categories', cat)} checked={filters.categories.includes(cat)} />
                        <span className="text-sm text-gray-600 group-hover:text-primary">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 2. Price */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Price</h3>
                  <div className="space-y-3">
                    {AVAILABLE_FILTERS.priceRanges.map(range => (
                      <label key={range.label} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${filters.priceRange === range.label ? 'border-accent' : 'border-gray-300'}`}>
                          {filters.priceRange === range.label && <div className="w-2 h-2 bg-accent rounded-full" />}
                        </div>
                        <input type="radio" name="price" className="hidden" onChange={() => setFilters({...filters, priceRange: filters.priceRange === range.label ? null : range.label})} checked={filters.priceRange === range.label} />
                        <span className="text-sm text-gray-600 group-hover:text-primary">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 3. Sizes */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Size</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {AVAILABLE_FILTERS.sizes.map(size => (
                      <button 
                        key={size}
                        onClick={() => toggleFilter('sizes', size)}
                        className={`py-2 text-sm border transition-all ${filters.sizes.includes(size) ? 'bg-primary text-white border-primary' : 'border-border text-muted hover:border-primary'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Color Swatches */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Color</h3>
                  <div className="flex flex-wrap gap-3">
                    {AVAILABLE_FILTERS.colors.map(col => (
                      <button 
                        key={col.name}
                        onClick={() => toggleFilter('colors', col.name)}
                        className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${filters.colors.includes(col.name) ? 'border-primary scale-110' : 'border-transparent hover:border-gray-300'}`}
                      >
                        <div className="w-6 h-6 rounded-full border border-gray-100" style={{ backgroundColor: col.value }} />
                        {filters.colors.includes(col.name) && <Check size={12} className={`absolute ${col.name === 'Noir' ? 'text-white' : 'text-black'}`} />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-border bg-secondary/30 flex gap-4">
                <button 
                  onClick={clearFilters}
                  className="w-1/3 py-4 text-xs uppercase tracking-widest border border-primary hover:bg-white transition-colors"
                >
                  Clear
                </button>
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="w-2/3 py-4 bg-primary text-white text-xs uppercase tracking-widest hover:bg-accent transition-colors"
                >
                  Show {filteredProducts.length} Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}