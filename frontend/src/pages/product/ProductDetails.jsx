import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronDown, ChevronUp, Ruler, Truck, ArrowLeft } from 'lucide-react';
import { useStore } from '../../store/useStore';

// --- MOCK DATA FOR SPECIFIC PRODUCT (In real app, fetch by ID) ---
const PRODUCT = {
  id: 1,
  name: "The Zaria Silk Bubu",
  price: 180,
  description: "Hand-dyed Adire silk that flows like water. The Zaria Bubu is designed for the modern woman who values comfort without compromising on elegance. Features a hidden inner belt for a fitted look or wear loose for maximum flow.",
  colors: [
    { name: "Emerald", value: "#046c4e", images: [
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop"
    ]},
    { name: "Clay", value: "#C15B28", images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=1000&auto=format&fit=crop"
    ]}
  ],
  sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  details: [
    { title: "Fabric & Care", content: "100% Silk. Dry clean only. Handle with care to preserve the hand-dyed patterns." },
    { title: "Shipping & Returns", content: "Free shipping on orders over $250. Returns accepted within 14 days." }
  ]
};

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useStore();

  const [selectedColor, setSelectedColor] = useState(PRODUCT.colors[0]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [error, setError] = useState('');

  // Scroll to top on load
  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError('Please select a size.');
      return;
    }
    setError('');
    
    // Construct the cart item
    addToCart({
      id: PRODUCT.id,
      name: PRODUCT.name,
      price: PRODUCT.price,
      // We pass the selected specific variant details
      variant: {
        id: selectedColor.name + selectedSize, // Unique ID per combo
        colorName: selectedColor.name,
        size: selectedSize,
        image: selectedColor.images[0]
      }
    }, null); // Second arg is null because we constructed the variant manually above
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-white">
      
      {/* Breadcrumb */}
      <div className="px-6 mb-8 max-w-[1440px] mx-auto">
        <Link to="/shop/ready-to-wear" className="text-xs text-muted hover:text-primary flex items-center gap-2 uppercase tracking-widest">
          <ArrowLeft size={14} /> Back to Shop
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 max-w-[1440px] mx-auto px-6">
        
        {/* LEFT: IMAGE GALLERY (Sticky Grid on Desktop) */}
        <div className="flex flex-col gap-4">
          {/* Main Image (Mobile Swipe / Desktop Scroll) */}
          <div className="w-full aspect-[3/4] bg-secondary overflow-hidden">
             <motion.img 
               key={selectedColor.name}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 0.5 }}
               src={selectedColor.images[0]} 
               className="w-full h-full object-cover"
             />
          </div>
          {/* Secondary Images (Grid) */}
          <div className="grid grid-cols-2 gap-4">
            {selectedColor.images.slice(1).map((img, idx) => (
              <div key={idx} className="aspect-[3/4] bg-secondary overflow-hidden">
                <img src={img} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: DETAILS PANEL (Sticky) */}
        <div className="lg:sticky lg:top-32 h-fit space-y-8">
          
          {/* Header */}
          <div>
            <div className="flex justify-between items-start">
              <h1 className="text-3xl md:text-4xl font-serif mb-2">{PRODUCT.name}</h1>
              <p className="text-xl font-medium">${PRODUCT.price}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted mb-6">
              <div className="flex text-accent"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
              <span>(12 Reviews)</span>
            </div>
            <p className="text-muted leading-relaxed font-light">{PRODUCT.description}</p>
          </div>

          {/* Color Selector */}
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-muted block mb-3">
              Color: <span className="text-primary">{selectedColor.name}</span>
            </span>
            <div className="flex gap-3">
              {PRODUCT.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border p-0.5 transition-all ${selectedColor.name === color.name ? 'border-primary scale-110' : 'border-transparent hover:border-gray-300'}`}
                >
                  <div className="w-full h-full rounded-full border border-gray-100" style={{ backgroundColor: color.value }} />
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-muted">Size</span>
              <button className="text-xs text-muted underline flex items-center gap-1 hover:text-primary">
                <Ruler size={14} /> Size Guide
              </button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRODUCT.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => { setSelectedSize(size); setError(''); }}
                  className={`py-3 text-sm border transition-all duration-200
                    ${selectedSize === size 
                      ? 'border-primary bg-primary text-white' 
                      : 'border-border hover:border-primary text-primary'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          </div>

          {/* Add to Cart */}
          <button 
            onClick={handleAddToCart}
            className="w-full bg-primary text-white py-4 uppercase tracking-widest hover:bg-accent transition-colors duration-300"
          >
            Add to Bag
          </button>

          {/* Shipping Note */}
          <div className="flex items-center gap-3 bg-secondary/50 p-4 border border-border">
            <Truck className="text-muted" size={20} />
            <p className="text-xs text-muted">
              <strong>Free Shipping</strong> on orders over $250 AUD. <br />
              Estimated delivery: 3–5 business days.
            </p>
          </div>

          {/* Accordion Details */}
          <div className="border-t border-border pt-4">
            {PRODUCT.details.map((item, idx) => (
              <div key={idx} className="border-b border-border">
                <button 
                  onClick={() => setActiveAccordion(activeAccordion === idx ? null : idx)}
                  className="w-full py-4 flex justify-between items-center hover:text-accent transition-colors"
                >
                  <span className="font-serif text-lg">{item.title}</span>
                  {activeAccordion === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                <AnimatePresence>
                  {activeAccordion === idx && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-sm text-muted leading-relaxed">{item.content}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}