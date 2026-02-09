import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, ArrowRight, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore'; // If you want to use global products later

// --- MOCK DATA (Ideally this comes from a global constant or API) ---
const SEARCH_PRODUCTS = [
  {
    id: 1,
    name: "The Zaria Silk Bubu",
    category: "Luxury Bubu",
    price: 180,
    image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Lagos City Midi",
    category: "Ready-to-Wear",
    price: 120,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Adire Wrap Set",
    category: "Co-ords",
    price: 155,
    image: "https://images.unsplash.com/photo-1589451397839-49774a3838dc?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Othello Maxi",
    category: "Luxury Bubu",
    price: 210,
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=200&auto=format&fit=crop"
  }
];

const SUGGESTIONS = ["Silk Bubu", "Wedding Guest", "Prom Dress", "Adire", "Gift Card"];

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Real-time Search Logic
  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }
    
    const searchTerms = query.toLowerCase().split(" ");
    const filtered = SEARCH_PRODUCTS.filter(product => {
      const nameMatch = searchTerms.every(term => product.name.toLowerCase().includes(term));
      const catMatch = product.category.toLowerCase().includes(query.toLowerCase());
      return nameMatch || catMatch;
    });

    setResults(filtered);
  }, [query]);

  const handleClose = () => {
    setQuery("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white z-[80] overflow-hidden flex flex-col"
        >
          {/* 1. HEADER (Input Area) */}
          <div className="border-b border-border px-6 py-8">
            <div className="max-w-[1000px] mx-auto relative flex items-center">
              <Search className="text-muted absolute left-0 top-1/2 -translate-y-1/2" size={24} />
              <input 
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products, trends, or collections..."
                className="w-full pl-12 pr-12 py-4 text-2xl md:text-4xl font-serif border-none outline-none placeholder:text-gray-300 bg-transparent"
              />
              <button 
                onClick={handleClose}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:bg-secondary rounded-full transition-colors"
              >
                <X size={28} />
              </button>
            </div>
          </div>

          {/* 2. CONTENT AREA */}
          <div className="flex-1 overflow-y-auto px-6 py-12 bg-secondary/20">
            <div className="max-w-[1000px] mx-auto">
              
              {/* STATE A: EMPTY QUERY (Suggestions) */}
              {query === "" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  {/* Trending */}
                  <div>
                    <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted mb-6">
                      <TrendingUp size={14} /> Trending Now
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {SUGGESTIONS.map((tag) => (
                        <button 
                          key={tag}
                          onClick={() => setQuery(tag)}
                          className="px-6 py-3 bg-white border border-border rounded-full hover:border-accent hover:text-accent transition-colors text-sm"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Collections */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-6">Collections</h3>
                    <ul className="space-y-4">
                      <li>
                        <Link to="/shop/ready-to-wear" onClick={handleClose} className="flex items-center justify-between group border-b border-border pb-2">
                          <span className="font-serif text-xl group-hover:pl-4 transition-all duration-300">Ready to Wear</span>
                          <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        </Link>
                      </li>
                      <li>
                        <Link to="/shop/bubus" onClick={handleClose} className="flex items-center justify-between group border-b border-border pb-2">
                          <span className="font-serif text-xl group-hover:pl-4 transition-all duration-300">Luxury Bùbús</span>
                          <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        </Link>
                      </li>
                       <li>
                        <Link to="/custom" onClick={handleClose} className="flex items-center justify-between group border-b border-border pb-2">
                          <span className="font-serif text-xl group-hover:pl-4 transition-all duration-300">Custom Creations</span>
                          <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* STATE B: VISUAL RESULTS */}
              {query !== "" && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-8">
                    {results.length} Result{results.length !== 1 ? 's' : ''}
                  </h3>
                  
                  {results.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {results.map((product) => (
                        <Link 
                          key={product.id} 
                          to={`/product/${product.id}`}
                          onClick={handleClose}
                          className="group block"
                        >
                          <div className="aspect-[3/4] bg-white overflow-hidden mb-4 relative">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Quick Add Overlay */}
                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <h4 className="font-serif text-lg group-hover:text-accent transition-colors">{product.name}</h4>
                          <p className="text-sm text-muted">${product.price}</p>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                       <p className="font-serif text-2xl text-muted mb-2">No results found for "{query}"</p>
                       <p className="text-sm text-gray-400">Try searching for "Silk", "Dress", or "Midi".</p>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}