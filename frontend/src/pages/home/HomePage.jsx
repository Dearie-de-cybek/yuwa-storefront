import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// --- LUXURY ANIMATION EASE ---
// A custom bezier curve that starts fast but lingers at the end (the "Vogue" effect)
const luxuryEase = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.6, ease: luxuryEase } }
};

const textReveal = {
  hidden: { opacity: 0, y: "100%" },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: luxuryEase } }
};

export default function HomePage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  // Subtle global parallax
  const slowScroll = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <div ref={containerRef} className="bg-[#FBF9F5] text-[#1A1918] font-sans overflow-hidden selection:bg-[#1A1918] selection:text-[#FBF9F5]">
      
      {/* =========================================
          1. HERO CAMPAIGN
          Full bleed, cinematic lighting, poetic text.
      ========================================= */}
      <section className="relative w-full h-screen overflow-hidden bg-[#1A1918]">
        {/* Subtle internal image scale for a "breathing" effect */}
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 3, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <img 
            src="/images/hero2.jpg" 
            alt="YUWA Campaign" 
            className="w-full h-full object-cover object-[50%_20%] opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1918]/80 via-transparent to-transparent" />
        </motion.div>

        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-[1600px] mx-auto w-full z-10 pb-20 md:pb-32">
          <div className="overflow-hidden mb-4">
            <motion.h1 
              initial="hidden" animate="visible" variants={textReveal}
              className="font-serif text-5xl md:text-8xl lg:text-[8rem] leading-[0.85] text-[#FBF9F5] tracking-tight"
            >
              Rooted in heritage.
            </motion.h1>
          </div>
          <div className="overflow-hidden flex flex-col md:flex-row md:items-end justify-between gap-8">
            <motion.h1 
              initial="hidden" animate="visible" variants={textReveal} transition={{ delay: 0.2 }}
              className="font-serif text-5xl md:text-8xl lg:text-[8rem] leading-[0.85] text-[#FBF9F5] tracking-tight italic font-light"
            >
              Worn without borders.
            </motion.h1>
            
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1.5 }}>
              <Link to="/shop/ready-to-wear" className="group flex items-center gap-4 text-[10px] text-[#FBF9F5] uppercase tracking-[0.3em] font-bold border-b border-[#FBF9F5]/30 pb-2 hover:border-[#FBF9F5] transition-colors duration-500">
                Explore the Collection
                <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-500" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================
          2. IDENTITY STATEMENT
          Massive typographic scale, intentional whitespace.
      ========================================= */}
      <section className="py-32 md:py-56 px-6 md:px-12 max-w-[1440px] mx-auto relative">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
          className="grid grid-cols-1 md:grid-cols-12 gap-8"
        >
          <div className="md:col-span-3">
            <span className="text-[9px] uppercase tracking-[0.4em] text-[#8B5E34] font-bold">
              The Manifesto
            </span>
          </div>
          <div className="md:col-span-9 lg:col-span-8">
            <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl leading-[1.2] tracking-tight text-[#1A1918]">
              We exist at the intersection of Lagos craftsmanship and global lifestyle. YUWA is not just fashion; it is <span className="italic text-[#8B5E34]">the architecture of modern African identity.</span>
            </h2>
          </div>
        </motion.div>
      </section>

      {/* =========================================
          3. EDITORIAL STORY SECTION
          Broken grid, overlapping images, parallax.
      ========================================= */}
      <section className="px-6 md:px-12 max-w-[1600px] mx-auto pb-32 md:pb-48">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-0 items-center">
          
          {/* Left Image (Tall) */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="md:col-span-5 md:col-start-1 relative z-10"
          >
            <div className="aspect-[3/4] overflow-hidden bg-[#EAE8E3]">
              <img 
                src="/images/home1.jpg" 
                alt="Aso-Oke Weaving" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-[3s] ease-out"
              />
            </div>
            <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-[#555]">01. The Craft / Abeokuta</p>
          </motion.div>

          {/* Right Text Block (Overlapping) */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="md:col-span-6 md:col-start-6 lg:col-start-7 bg-[#FBF9F5] md:-ml-24 z-20 md:p-12 relative"
          >
            <h3 className="font-serif text-4xl md:text-6xl mb-8 leading-[1.1]">
              Woven with <br/><span className="italic text-[#8B5E34]">intention.</span>
            </h3>
            <p className="text-sm md:text-base leading-relaxed text-[#444] mb-10 max-w-md">
              Every thread tells a story of diaspora. We partner with multi-generational artisans in Nigeria to hand-dye and weave fabrics that hold the weight of our ancestry, tailored for the pace of your modern life.
            </p>
            <Link to="/journal" className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-bold border-b border-[#1A1918] pb-1 hover:text-[#8B5E34] hover:border-[#8B5E34] transition-colors duration-500">
              Read the Journal
            </Link>
          </motion.div>
        </div>
      </section>

      {/* =========================================
          4. CATEGORY PANELS (Not Grids)
          Massive, full-width alternating editorial blocks.
      ========================================= */}
      <section className="w-full flex flex-col gap-4 px-4 md:px-6 pb-32 md:pb-48">
        
        {/* Panel 1 */}
        <Link to="/shop/bubus" className="group relative w-full h-[70vh] md:h-[85vh] overflow-hidden flex items-center justify-center bg-[#1A1918]">
          <img 
            src="/images/bubus.jpg" 
            alt="The Bubu Edit" 
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-[2s] ease-out"
          />
          <div className="relative z-10 text-center pointer-events-none">
            <span className="block text-[10px] text-[#FBF9F5] tracking-[0.4em] uppercase mb-4">Collection I</span>
            <h2 className="font-serif text-5xl md:text-8xl text-[#FBF9F5] drop-shadow-lg">The Bubu Edit.</h2>
          </div>
        </Link>

        {/* Panel 2 */}
        <Link to="/custom" className="group relative w-full h-[70vh] md:h-[85vh] overflow-hidden flex items-center justify-center bg-[#1A1918]">
          <img 
            src="/images/bridal.jpg" 
            alt="Bespoke Atelier" 
            className="absolute inset-0 w-full h-full object-cover object-top opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-[2s] ease-out"
          />
          <div className="relative z-10 text-center pointer-events-none">
            <span className="block text-[10px] text-[#FBF9F5] tracking-[0.4em] uppercase mb-4">The Atelier</span>
            <h2 className="font-serif text-5xl md:text-8xl text-[#FBF9F5] italic drop-shadow-lg">Custom & Bridal.</h2>
          </div>
        </Link>
      </section>

      {/* =========================================
          5. CURATED SHOWCASE ("The Edit")
          Horizontal, sparse layout. Story over sales.
      ========================================= */}
      <section className="py-24 md:py-32 bg-[#EFECE6]">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 mb-20 flex justify-between items-end">
          <h2 className="font-serif text-4xl md:text-6xl">The Director's Cut.</h2>
          <Link to="/shop/ready-to-wear" className="hidden md:inline-block text-[10px] uppercase tracking-[0.3em] font-bold border-b border-[#1A1918] pb-1 hover:text-[#8B5E34]">
            View All Pieces
          </Link>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex overflow-x-auto hide-scrollbar gap-12 md:gap-24 px-6 md:px-12 pb-12 snap-x">
          
          {/* Curated Item 1 */}
          <div className="min-w-[85vw] md:min-w-[40vw] flex flex-col snap-center group">
            <Link to="/product/1" className="overflow-hidden bg-[#EAE8E3] aspect-[3/4] mb-6">
              <img src="/images/silk.jpg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out" alt="Silk Adire" />
            </Link>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-serif text-2xl mb-2">The Lagosian Bubu</h3>
                <p className="text-xs text-[#555] uppercase tracking-widest">Hand-Dyed Silk</p>
              </div>
              <span className="font-serif italic text-lg">₦145,000</span>
            </div>
          </div>

          {/* Curated Item 2 */}
          <div className="min-w-[85vw] md:min-w-[40vw] flex flex-col snap-center group mt-12 md:mt-24">
            <Link to="/product/2" className="overflow-hidden bg-[#EAE8E3] aspect-[3/4] mb-6">
              <img src="/images/two.jpg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out" alt="Aso-Oke Two Piece" />
            </Link>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-serif text-2xl mb-2">The Eko Two-Piece</h3>
                <p className="text-xs text-[#555] uppercase tracking-widest">Woven Aso-Oke</p>
              </div>
              <span className="font-serif italic text-lg">₦210,000</span>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================
          6. CULTURAL ANCHOR
          Intimate, dark closing statement.
      ========================================= */}
      <section className="bg-[#1A1918] text-[#FBF9F5] py-32 md:py-48 px-6 md:px-12 text-center relative overflow-hidden">
        {/* Grain/Texture Overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }} />
        
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
          className="max-w-3xl mx-auto relative z-10"
        >
          <div className="w-[1px] h-16 bg-[#8B5E34] mx-auto mb-12" />
          <h2 className="font-serif text-3xl md:text-5xl leading-relaxed mb-12">
            "To wear YUWA is to carry your history with you, unapologetically, into the rooms where the future is made."
          </h2>
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#8B5E34]">
            Made in Nigeria. Worn Globally.
          </span>
        </motion.div>
      </section>

      {/* Required style for horizontal scrollbar hiding */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}