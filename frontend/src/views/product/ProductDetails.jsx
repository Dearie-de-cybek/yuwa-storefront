'use client';

import { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronDown, ChevronUp, Ruler, Truck, ArrowLeft } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { toast } from 'sonner';

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

// Transform the productService detail shape into the view model.
function transform(p) {
  const rawVariants = p.variants || [];
  const sizes = [...new Set(rawVariants.map(v => v.size).filter(Boolean))];
  const colorNames = [...new Set(rawVariants.map(v => v.color).filter(Boolean))];

  const colors = colorNames.map(colorName => {
    const variantsWithThisColor = rawVariants.filter(v => v.color === colorName);
    const primaryVariant = variantsWithThisColor[0];
    const galleryImages = primaryVariant?.media?.length > 0
      ? primaryVariant.media.map(m => m.url)
      : (p.media || []).map(m => m.url);
    const swatchImage = primaryVariant?.media?.length > 0 ? primaryVariant.media[0].url : null;
    return {
      name: colorName,
      value: getColorHex(colorName),
      swatchImage,
      images: galleryImages.length > 0 ? galleryImages : ['https://via.placeholder.com/800x1000?text=No+Image'],
    };
  });

  const accordions = p.contentSections?.length > 0
    ? p.contentSections.map(sec => ({ title: sec.title, content: sec.content }))
    : [
        { title: "Product Details", content: p.description || "No details provided." },
        { title: "Shipping & Returns", content: "• Free express shipping on orders over ₦250,000. \n• Returns accepted within 14 days of delivery." },
      ];

  return {
    product: { id: p.id, name: p.name, price: p.price, description: p.description, sizes, colors, accordions },
    rawVariants,
  };
}

export default function ProductDetails({ detail }) {
  const { addToCart } = useStore();
  const reviewsRef = useRef(null);

  const { product, rawVariants } = useMemo(() => transform(detail), [detail]);
  const id = product.id;
  const category = detail.category?.name;

  const [selectedColor, setSelectedColor] = useState(product.colors[0] || null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeAccordion, setActiveAccordion] = useState(0);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

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

  return (
    <div className="min-h-screen pt-32 bg-white selection:bg-black selection:text-white">

      {/* 1. TOP SECTION */}
      <div className="px-6 mb-8 max-w-[1440px] mx-auto">
        <Link href="/shop/ready-to-wear" className="text-xs text-gray-400 hover:text-black flex items-center gap-2 uppercase tracking-widest transition-colors">
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

          {/* Color/Fabric Selector */}
          {product.colors.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 block mb-4">
                Material / Color: <span className="text-black">{selectedColor?.name}</span>
              </span>
              <div className="flex flex-wrap gap-4">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`w-12 h-12 rounded-full border p-0.5 transition-all ${
                      selectedColor?.name === color.name ? 'border-black scale-110' : 'border-transparent'
                    }`}
                  >
                    <div
                      className="w-full h-full rounded-full border border-gray-200 bg-cover bg-center"
                      style={{
                        backgroundColor: color.value,
                        backgroundImage: color.swatchImage ? `url(${color.swatchImage})` : 'none',
                      }}
                    />
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
        <ReviewsSection productId={id} />
      </div>

      <RelatedProducts currentId={id} category={category} />
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  );
}
