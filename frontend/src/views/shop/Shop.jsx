import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../../components/product/ProductCard';
import { Filter, ChevronDown, LayoutGrid, Grid2x2, X, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- FILTER CONFIGURATION ---
const AVAILABLE_FILTERS = {
  categories: ["Luxury Bubu", "Ready-to-Wear", "Co-ords", "Uncategorized"],
  sizes: ["XS", "S", "M", "L", "XL", "XXL", "3XL", "One Size", "Custom"],
  fabrics: ["Silk", "Cotton", "Adire", "Chiffon", "Aso-Oke"],
  colors: [
    { name: "Emerald", value: "#50C878" },
    { name: "Indigo", value: "#3F51B5" },
    { name: "Gold", value: "#D4A017" },
    { name: "Ivory", value: "#FFFFF0" },
    { name: "Burgundy", value: "#800020" },
    { name: "Royal Blue", value: "#4169E1" },
    { name: "Coral", value: "#FF7F50" },
    { name: "Champagne", value: "#F7E7CE" },
    { name: "Black", value: "#1A1A1A" },
    { name: "White", value: "#FFFFFF" },
    { name: "Teal", value: "#008080" },
    { name: "Plum", value: "#8E4585" }
  ],
  priceRanges: [
    { label: "Under ₦100,000", min: 0, max: 100000 },
    { label: "₦100,000 - ₦200,000", min: 100000, max: 200000 },
    { label: "₦200,000+", min: 200000, max: 10000000 }
  ]
};

// Helper to get hex code for swatches
const getColorHex = (colorName) => {
  const found = AVAILABLE_FILTERS.colors.find(c => c.name.toLowerCase() === colorName?.toLowerCase());
  return found ? found.value : '#cccccc';
};

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [gridCols, setGridCols] = useState(4);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState('newest');

  // STATE: Multi-Select Filters
  const [filters, setFilters] = useState({
    categories: [],
    sizes: [],
    fabrics: [],
    colors: [],
    priceRange: null
  });

  // --- 1. FETCH PRODUCTS FROM BACKEND ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch only ACTIVE products
        const res = await axios.get('http://localhost:5001/api/products?status=ACTIVE&limit=100');
        
        // Transform backend data to match what the frontend UI expects
        const formattedProducts = res.data.products.map(p => {
          const rawVariants = p.variants || [];
          
          // Extract unique sizes and colors from variants
          const sizes = [...new Set(rawVariants.map(v => v.size).filter(Boolean))];
          const colors = [...new Set(rawVariants.map(v => v.color).filter(Boolean))];

          // Format variants for the color swatches on the ProductCard
          const formattedVariants = colors.map(color => {
            const v = rawVariants.find(variant => variant.color === color);
            return {
              id: v?.id || color,
              colorName: color,
              type: 'color',
              value: getColorHex(color),
              image: p.image // Fallback to main product image for the swatch hover
            };
          });

          return {
            id: p.id,
            name: p.name,
            slug: p.slug,
            category: p.category?.name || 'Uncategorized',
            fabric: p.material || 'Mixed', 
            price: p.price,
            compareAt: p.compareAt,
            sizes: sizes,
            colors: colors,
            tag: p.featured ? 'Featured' : (p.compareAt ? 'Sale' : null),
            variants: formattedVariants,
            image: p.image || 'https://via.placeholder.com/600x800?text=No+Image'
          };
        });

        setProducts(formattedProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // --- 2. LOGIC: Filter & Sort ---
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Categories
    if (filters.categories.length > 0) {
      result = result.filter(p => filters.categories.includes(p.category));
    }
    // Sizes
    if (filters.sizes.length > 0) {
      result = result.filter(p => p.sizes.some(s => filters.sizes.includes(s)));
    }
    // Fabrics
    if (filters.fabrics.length > 0) {
      result = result.filter(p => filters.fabrics.includes(p.fabric));
    }
    // Colors
    if (filters.colors.length > 0) {
      result = result.filter(p => p.colors.some(c => filters.colors.includes(c)));
    }
    // Price
    if (filters.priceRange) {
      const range = AVAILABLE_FILTERS.priceRanges.find(r => r.label === filters.priceRange);
      if (range) {
        result = result.filter(p => p.price >= range.min && p.price <= range.max);
      }
    }

    // Sort
    if (sortOption === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sortOption === 'price-desc') result.sort((a, b) => b.price - a.price);
    else result.sort((a, b) => b.id > a.id ? -1 : 1); // Newest fallback

    return result;
  }, [products, filters, sortOption]);

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

  const activeCount = Object.values(filters).flat().length + (filters.priceRange ? 1 : 0);

  // --- RENDER LOADING STATE ---
  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-gray-300 mb-4" size={32} />
        <p className="font-serif text-sm tracking-[0.2em] uppercase text-gray-400">Curating Collection</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 bg-white selection:bg-black selection:text-white">
      
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col mb-8 max-w-[1440px] mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif mb-2">The Collection</h1>
        <p className="text-gray-500 text-sm mb-6">Everyday luxury for the modern woman.</p>

        {/* TOOLBAR */}
        <div className="flex flex-wrap items-center justify-between border-y border-gray-200 py-4 sticky top-[72px] md:top-[88px] bg-white/95 backdrop-blur z-30">
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 text-xs uppercase tracking-widest hover:text-gray-600 transition-colors"
            >
              Filter {activeCount > 0 && <span className="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-[10px]">{activeCount}</span>}
              <Filter size={14} />
            </button>
            
            {/* Sort Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 text-xs uppercase tracking-widest hover:text-gray-600 transition-colors">
                Sort: {sortOption.replace('-', ' ')} <ChevronDown size={14} />
              </button>
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-40">
                <div className="bg-white border border-gray-200 shadow-xl w-48 flex flex-col">
                  {[{label:'Newest Arrivals',v:'newest'},{label:'Price: Low to High',v:'price-asc'},{label:'Price: High to Low',v:'price-desc'}].map(o => (
                    <button key={o.v} onClick={() => setSortOption(o.v)} className="text-left px-5 py-3 text-xs uppercase tracking-widest hover:bg-gray-50 hover:text-amber-700">{o.label}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4 text-gray-400">
            <button onClick={() => setGridCols(2)} className={`hover:text-black transition-colors ${gridCols === 2 ? 'text-black' : ''}`}><Grid2x2 size={20} strokeWidth={1.5}/></button>
            <button onClick={() => setGridCols(4)} className={`hover:text-black transition-colors ${gridCols === 4 ? 'text-black' : ''}`}><LayoutGrid size={20} strokeWidth={1.5}/></button>
          </div>
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className={`grid ${getGridClass()} max-w-[1440px] mx-auto transition-all duration-500`}>
        {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
      </div>

      {/* EMPTY STATE */}
      {filteredProducts.length === 0 && (
        <div className="py-32 text-center text-gray-400">
          <p className="text-lg font-serif mb-4 text-black">No pieces match your selection.</p>
          <button onClick={clearFilters} className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 text-black hover:text-amber-700 hover:border-amber-700 transition-colors">
            Clear all filters
          </button>
        </div>
      )}


      {/* --- FILTER DRAWER --- */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white shadow-2xl z-[70] flex flex-col border-r border-gray-200"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="font-serif text-2xl">Filter</h2>
                <button onClick={() => setIsFilterOpen(false)} className="hover:text-amber-700 transition-colors"><X size={24} /></button>
              </div>

              {/* Scrollable Filters */}
              <div className="flex-1 overflow-y-auto p-6 space-y-12">
                
                {/* 1. Category */}
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-gray-500">Category</h3>
                  <div className="space-y-4">
                    {AVAILABLE_FILTERS.categories.map(cat => (
                      <label key={cat} className="flex items-center gap-4 cursor-pointer group">
                        <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${filters.categories.includes(cat) ? 'bg-black border-black' : 'border-gray-300'}`}>
                          {filters.categories.includes(cat) && <Check size={10} className="text-white" />}
                        </div>
                        <input type="checkbox" className="hidden" onChange={() => toggleFilter('categories', cat)} checked={filters.categories.includes(cat)} />
                        <span className="text-sm text-gray-600 group-hover:text-black">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 2. Price */}
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-gray-500">Investment</h3>
                  <div className="space-y-4">
                    {AVAILABLE_FILTERS.priceRanges.map(range => (
                      <label key={range.label} className="flex items-center gap-4 cursor-pointer group">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${filters.priceRange === range.label ? 'border-amber-700' : 'border-gray-300'}`}>
                          {filters.priceRange === range.label && <div className="w-2 h-2 bg-amber-700 rounded-full" />}
                        </div>
                        <input type="radio" name="price" className="hidden" onChange={() => setFilters({...filters, priceRange: filters.priceRange === range.label ? null : range.label})} checked={filters.priceRange === range.label} />
                        <span className="text-sm text-gray-600 group-hover:text-black">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 3. Sizes */}
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-gray-500">Size</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {AVAILABLE_FILTERS.sizes.map(size => (
                      <button 
                        key={size}
                        onClick={() => toggleFilter('sizes', size)}
                        className={`py-3 text-xs tracking-widest border transition-all ${filters.sizes.includes(size) ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-500 hover:border-black hover:text-black'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Color Swatches */}
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-gray-500">Color Palette</h3>
                  <div className="flex flex-wrap gap-3">
                    {AVAILABLE_FILTERS.colors.map(col => (
                      <button 
                        key={col.name}
                        onClick={() => toggleFilter('colors', col.name)}
                        title={col.name}
                        className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${filters.colors.includes(col.name) ? 'border-black scale-110' : 'border-transparent hover:scale-110 hover:shadow-md'}`}
                      >
                        <div className="w-8 h-8 rounded-full border border-gray-100 shadow-inner" style={{ backgroundColor: col.value }} />
                        {filters.colors.includes(col.name) && <Check size={14} className={`absolute drop-shadow-md ${col.name === 'Noir' || col.name === 'Black' ? 'text-white' : 'text-black'}`} />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-4">
                <button 
                  onClick={clearFilters}
                  className="w-1/3 py-4 text-[10px] font-bold uppercase tracking-[0.2em] border border-black hover:bg-white transition-colors"
                >
                  Clear
                </button>
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="w-2/3 py-4 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-amber-900 transition-colors"
                >
                  View {filteredProducts.length} Pieces
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}