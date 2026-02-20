import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronDown, ChevronUp, Ruler, Truck, ArrowLeft, Loader2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { toast } from 'sonner'; 
import axios from 'axios';

// Components
import SizeGuideModal from '../../components/product/SizeGuideModal';
import ReviewsSection from '../../components/product/ReviewsSection';
import RelatedProducts from '../../components/product/RelatedProducts';

// Helper to get hex code for swatches
const getColorHex = (colorName) => {
  const PRESET_COLORS = [
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
    { name: "Plum", value: "#8E4585" },
    { name: "Clay", value: "#C15B28" },
    { name: "Noir", value: "#000000" }
  ];
  const found = PRESET_COLORS.find(c => c.name.toLowerCase() === colorName?.toLowerCase());
  return found ? found.value : '#cccccc';
};

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useStore();
  const reviewsRef = useRef(null);

  // --- STATE ---
  const [product, setProduct] = useState(null);
  const [rawVariants, setRawVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null); 
  const [activeAccordion, setActiveAccordion] = useState(0); // Open first accordion by default
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // --- FETCH PRODUCT ---
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchProduct = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await axios.get(`http://localhost:5001/api/products/${id}`);
        const p = res.data;
        
        // Save raw variants to find the exact ID later for checkout
        setRawVariants(p.variants || []);

        // 1. Extract Unique Sizes
        const sizes = [...new Set((p.variants || []).map(v => v.size).filter(Boolean))];

        // 2. Extract Unique Colors & Map to Images
        const colorNames = [...new Set((p.variants || []).map(v => v.color).filter(Boolean))];
        const colors = colorNames.map(colorName => {
          const variantForColor = p.variants.find(v => v.color === colorName);
          
          // If the variant has specific images, use them. Otherwise fallback to main product images
          const images = variantForColor?.media?.length > 0 
            ? variantForColor.media.map(m => m.url)
            : p.media.map(m => m.url);

          return {
            name: colorName,
            value: getColorHex(colorName),
            images: images.length > 0 ? images : ['https://via.placeholder.com/800x1000?text=No+Image']
          };
        });

        // 3. Map Content Sections to Accordions
        const accordions = p.contentSections?.length > 0 
          ? p.contentSections.map(sec => ({ title: sec.title, content: sec.content }))
          : [
              { title: "Product Details", content: p.description || "No details provided." },
              { title: "Shipping & Returns", content: "• Free express shipping on orders over ₦250,000. \n• Returns accepted within 14 days of delivery." }
            ];

        // 4. Build Final Product Object
        const formattedProduct = {
          id: p.id,
          name: p.name,
          price: p.price,
          description: p.description,
          sizes,
          colors,
          accordions
        };

        setProduct(formattedProduct);
        if (formattedProduct.colors.length > 0) setSelectedColor(formattedProduct.colors[0]);

      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size", {
        description: "We need to know your fit before adding to bag.",
        duration: 3000,
        style: { background: '#FFF0F0', color: '#E00', border: '1px solid #FFCDCD' }
      });
      return;
    }

    // Find the exact variant ID from the backend so Checkout works flawlessly
    const exactVariant = rawVariants.find(
      v => v.color === selectedColor.name && v.size === selectedSize
    );

    if (!exactVariant) {
      toast.error("Variant unavailable", { description: "This specific color and size combination is out of stock." });
      return;
    }

    addToCart(
      { 
        id: product.id, 
        name: product.name, 
        price: exactVariant.price || product.price // Use variant price override if exists
      }, 
      {
        id: exactVariant.id, // THE CRUCIAL FIX FOR CHECKOUT
        color: selectedColor.name,
        size: selectedSize,
        image: selectedColor.images[0]
      }
    );

    toast.success(`Added to Bag`, {
      description: `${product.name} (${selectedSize})`,
      duration: 2000,
      style: { background: '#F0FFF4', color: '#046c4e', border: '1px solid #C6F6D5' }
    });
  };

  // --- LOADING & ERROR STATES ---
  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-gray-300 mb-4" size={32} />
        <p className="font-serif text-sm tracking-[0.2em] uppercase text-gray-400">Loading Masterpiece</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-48 pb-20 px-6 bg-white text-center">
        <h1 className="text-4xl font-serif mb-4">Piece Not Found</h1>
        <p className="text-gray-500 mb-8">This garment may have been archived or removed.</p>
        <Link to="/shop/ready-to-wear" className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-amber-700 hover:border-amber-700 transition-colors">
          Return to Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 bg-white selection:bg-black selection:text-white">
      
      {/* 1. TOP SECTION */}
      <div className="px-6 mb-8 max-w-[1440px] mx-auto">
        <Link to="/shop/ready-to-wear" className="text-xs text-gray-400 hover:text-black flex items-center gap-2 uppercase tracking-widest transition-colors">
          <ArrowLeft size={14} /> Back to Shop
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 max-w-[1440px] mx-auto px-6 mb-20">
        
        {/* LEFT: GALLERY */}
        <div className="flex flex-col gap-4">
          <div className="w-full aspect-[3/4] bg-gray-50 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img 
                key={selectedColor?.name || 'default'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                src={selectedColor?.images[0]} 
                className="w-full h-full object-cover"
                alt={product.name}
              />
            </AnimatePresence>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {selectedColor?.images.slice(1).map((img, idx) => (
              <div key={idx} className="aspect-[3/4] bg-gray-50 overflow-hidden">
                <img src={img} className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000 ease-out" alt={`${product.name} detail`} />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: DETAILS */}
        <div className="lg:sticky lg:top-32 h-fit space-y-8">
          
          <div>
            <div className="flex justify-between items-start">
              <h1 className="text-3xl md:text-5xl font-serif mb-3 leading-tight">{product.name}</h1>
              <p className="text-xl md:text-2xl font-serif italic text-gray-700">₦{product.price.toLocaleString()}</p>
            </div>
            
            <button onClick={scrollToReviews} className="flex items-center gap-2 text-sm text-gray-500 mb-8 group">
              <div className="flex text-amber-700">
                {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="currentColor" />)}
              </div>
              <span className="group-hover:text-black underline decoration-dotted transition-colors">
                (Read Reviews)
              </span>
            </button>
            
            <p className="text-gray-600 leading-relaxed font-light">{product.description}</p>
          </div>

          {/* Color Selector */}
          {product.colors.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 block mb-4">
                Color: <span className="text-black">{selectedColor?.name}</span>
              </span>
              <div className="flex gap-4">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    title={color.name}
                    className={`w-10 h-10 rounded-full border p-[2px] transition-all ${selectedColor?.name === color.name ? 'border-black scale-110' : 'border-transparent hover:scale-110'}`}
                  >
                    <div className="w-full h-full rounded-full border border-gray-200 shadow-inner" style={{ backgroundColor: color.value }} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {product.sizes.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                  Size
                </span>
                <button 
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-xs text-gray-500 underline flex items-center gap-1 hover:text-black transition-colors"
                >
                  <Ruler size={14} /> Size Guide
                </button>
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 text-sm font-medium border transition-all duration-300
                      ${selectedSize === size 
                        ? 'border-black bg-black text-white shadow-md' 
                        : 'border-gray-200 hover:border-black text-gray-800 bg-white hover:shadow-sm'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ADD TO BAG BUTTON */}
          <button 
            onClick={handleAddToCart}
            className="w-full bg-black text-white py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-amber-900 transition-colors duration-500 shadow-lg hover:shadow-xl mt-4"
          >
            Add to Bag
          </button>

          <div className="flex items-start gap-4 bg-gray-50 p-6 border border-gray-100 mt-6">
            <Truck className="text-gray-400 shrink-0 mt-1" size={20} />
            <p className="text-xs text-gray-600 leading-relaxed">
              <strong className="text-black block mb-1">Complimentary Shipping</strong>
              On all domestic orders over ₦250,000. <br />
              Estimated delivery: 3–5 business days.
            </p>
          </div>

          {/* Accordions */}
          <div className="border-t border-gray-200 pt-6 mt-12">
            {product.accordions.map((item, idx) => (
              <div key={idx} className="border-b border-gray-200">
                <button 
                  onClick={() => setActiveAccordion(activeAccordion === idx ? null : idx)}
                  className="w-full py-5 flex justify-between items-center hover:text-amber-700 transition-colors group"
                >
                  <span className="font-serif text-xl text-gray-900 group-hover:text-amber-700">{item.title}</span>
                  {activeAccordion === idx ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                </button>
                <AnimatePresence>
                  {activeAccordion === idx && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-8 text-sm text-gray-600 leading-loose whitespace-pre-line font-light">
                        {item.content}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div ref={reviewsRef}>
        <ReviewsSection />
      </div>

      <RelatedProducts />
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  );
}