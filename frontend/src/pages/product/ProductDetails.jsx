import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronDown, ChevronUp, Ruler, Truck, ArrowLeft } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { toast } from 'sonner'; 

// Components
import SizeGuideModal from '../../components/product/SizeGuideModal';
import ReviewsSection from '../../components/product/ReviewsSection';
import RelatedProducts from '../../components/product/RelatedProducts';

// --- MOCK DATA ---
const PRODUCT = {
  id: 1,
  name: "The Zaria Silk Bubu",
  price: 180,
  description: "Hand-dyed Adire silk that flows like water. The Zaria Bubu is designed for the modern woman who values comfort without compromising on elegance.",
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
  accordions: [
    { title: "Product Details", content: "• 100% Premium Silk\n• Hand-dyed in Lagos, Nigeria\n• Hidden inner belt for adjustable fit\n• Maxi length (60 inches)\n• Side pockets included" },
    { title: "Size & Fit", content: "• Model is 5'9\" wearing size S\n• Loose, flowing fit\n• Fits true to size, but if between sizes, you can size down due to the loose cut." },
    { title: "Fabric & Care", content: "• 100% Silk. \n• Dry clean only recommended to preserve the vibrancy of the Adire dye. \n• Steam iron on low heat." },
    { title: "Shipping & Returns", content: "• Free express shipping on orders over $250 AUD. \n• Returns accepted within 14 days of delivery for store credit or exchange." }
  ]
};

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useStore();
  const reviewsRef = useRef(null);

  const [selectedColor, setSelectedColor] = useState(PRODUCT.colors[0]);
  const [selectedSize, setSelectedSize] = useState(null); 
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAddToCart = () => {
    // 1. VALIDATION TOAST
    if (!selectedSize) {
      toast.error("Please select a size", {
        description: "We need to know your fit before adding to bag.",
        duration: 3000,
        style: { background: '#FFF0F0', color: '#E00', border: '1px solid #FFCDCD' }
      });
      return;
    }

    // 2. SUCCESS
    addToCart(
      { 
        id: PRODUCT.id, 
        name: PRODUCT.name, 
        price: PRODUCT.price 
      }, 
      {
        id: `${selectedColor.name}-${selectedSize}`,
        colorName: selectedColor.name,
        size: selectedSize,
        image: selectedColor.images[0]
      }
    );

    // 3. SUCCESS TOAST
    toast.success(`Added to Bag`, {
      description: `${PRODUCT.name} (${selectedSize})`,
      duration: 2000,
      style: { background: '#F0FFF4', color: '#046c4e', border: '1px solid #C6F6D5' }
    });
  };

  return (
    <div className="min-h-screen pt-32 bg-white">
      
      {/* 1. TOP SECTION */}
      <div className="px-6 mb-8 max-w-360 mx-auto">
        <Link to="/shop/ready-to-wear" className="text-xs text-muted hover:text-primary flex items-center gap-2 uppercase tracking-widest">
          <ArrowLeft size={14} /> Back to Shop
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 max-w-360 mx-auto px-6 mb-20">
        
        {/* LEFT: GALLERY */}
        <div className="flex flex-col gap-4">
          <div className="w-full aspect-3/4 bg-secondary overflow-hidden">
             <motion.img 
               key={selectedColor.name}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 0.5 }}
               src={selectedColor.images[0]} 
               className="w-full h-full object-cover"
             />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {selectedColor.images.slice(1).map((img, idx) => (
              <div key={idx} className="aspect-[3/4] bg-secondary overflow-hidden">
                <img src={img} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: DETAILS */}
        <div className="lg:sticky lg:top-32 h-fit space-y-8">
          
          <div>
            <div className="flex justify-between items-start">
              <h1 className="text-3xl md:text-4xl font-serif mb-2">{PRODUCT.name}</h1>
              <p className="text-xl font-medium">${PRODUCT.price}</p>
            </div>
            
            <button onClick={scrollToReviews} className="flex items-center gap-2 text-sm text-muted mb-6 group">
              <div className="flex text-accent">
                {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="currentColor" />)}
              </div>
              <span className="group-hover:text-primary underline decoration-dotted transition-colors">
                (Read 12 Reviews)
              </span>
            </button>
            
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
              <span className="text-xs font-bold uppercase tracking-widest text-muted">
                Size
              </span>
              <button 
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-xs text-muted underline flex items-center gap-1 hover:text-primary"
              >
                <Ruler size={14} /> Size Guide
              </button>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRODUCT.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 text-sm border transition-all duration-200
                    ${selectedSize === size 
                      ? 'border-primary bg-primary text-white' 
                      : 'border-border hover:border-primary text-primary bg-white'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* ADD TO BAG BUTTON */}
          <button 
            onClick={handleAddToCart}
            className="w-full bg-primary text-white py-4 uppercase tracking-widest hover:bg-accent transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            Add to Bag
          </button>

          <div className="flex items-center gap-3 bg-secondary/50 p-4 border border-border">
            <Truck className="text-muted" size={20} />
            <p className="text-xs text-muted">
              <strong>Free Shipping</strong> on orders over $250 AUD. <br />
              Estimated delivery: 3–5 business days.
            </p>
          </div>

          {/* Accordions */}
          <div className="border-t border-border pt-4">
            {PRODUCT.accordions.map((item, idx) => (
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
                      <p className="pb-6 text-sm text-muted leading-relaxed whitespace-pre-line">
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