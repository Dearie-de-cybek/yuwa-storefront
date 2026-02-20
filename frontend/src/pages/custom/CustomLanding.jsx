import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// --- LUXURY ANIMATION CONFIG ---
// This specific bezier curve mimics the slow, deliberate easing seen on high-end fashion sites (Khaite, Zara, SSENSE)
const luxuryEase = [0.16, 1, 0.3, 1]; 
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.4, ease: luxuryEase } }
};

export default function CustomLanding() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  
  // Subtle parallax for the main hero image
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 100]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-[#FAF9F6]">
      
      {/* =========================================
          1. THE HERO CAMPAIGN
          Editorial split. The image bleeds, the typography is massive. 
          No buttons, just an invitational text link.
      ========================================= */}
      <section className="relative w-full min-h-[90vh] flex flex-col justify-end lg:flex-row lg:justify-between items-end px-6 md:px-12 pb-12 pt-32 max-w-[1600px] mx-auto">
        
        {/* Typographic Anchor (Bottom Left) */}
        <motion.div 
          initial="hidden" animate="visible" variants={fadeUp}
          className="w-full lg:w-5/12 z-10 pb-12 lg:pb-0"
        >
          <span className="block text-[10px] tracking-[0.3em] uppercase mb-8 text-[#8C6D46]">
            The YUWA Atelier
          </span>
          <h1 className="font-serif text-6xl md:text-8xl lg:text-[7rem] leading-[0.85] tracking-tight mb-8">
            Bespoke <br />
            <span className="italic font-light text-[#555]">Identity.</span>
          </h1>
          <p className="text-base md:text-lg font-light leading-relaxed max-w-sm mb-12 text-[#444]">
            Rooted in Lagos, crafted for the global stage. 
            We design breathtaking adire and silk garments that command the room and celebrate your heritage.
          </p>
          <Link 
            to="/custom/book"
            className="group inline-flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.2em] border-b border-[#1A1A1A] pb-1 hover:text-[#8C6D46] hover:border-[#8C6D46] transition-colors duration-500"
          >
            Enter the Atelier
            <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-500 ease-out" />
          </Link>
        </motion.div>

        {/* Hero Image (Right/Top Bleed) */}
        <div className="w-full lg:w-6/12 h-[60vh] lg:h-[80vh] relative overflow-hidden">
          <motion.img 
            style={{ y: heroY }}
            src="https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=1200" 
            alt="African Haute Couture" 
            className="absolute inset-0 w-full h-[120%] object-cover object-top scale-105"
          />
        </div>
      </section>

      {/* =========================================
          2. THE NARRATIVE SPREAD
          Magazine style text spread. Huge drop-cap feel, uneven columns.
      ========================================= */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
        className="py-32 md:py-48 px-6 md:px-12 max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 items-center"
      >
        <div className="md:col-span-7">
          <h2 className="font-serif text-4xl md:text-5xl leading-tight">
            "We do not make clothes. We architect confidence."
          </h2>
        </div>
        <div className="md:col-span-4 md:col-start-9">
          <p className="text-sm leading-loose text-[#444]">
            For the diasporan woman, presence is everything. Every custom YUWA piece is a dialogue between traditional Nigerian craftsmanship and modern luxury minimalism. From hand-dyed fabrics to impeccable tailoring, your garment is a masterpiece built exclusively for your silhouette.
          </p>
        </div>
      </motion.section>

      {/* =========================================
          3. EDITORIAL COLLECTIONS (The "Categories")
          No grids. Broken layout, overlapping text, directional flow.
      ========================================= */}
      <section className="py-20 px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-32 md:gap-y-48">
          
          {/* Block 01: Prom (Left aligned, tall) */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="md:col-span-5 relative group cursor-pointer"
          >
            <Link to="/custom/prom" className="block relative h-[80vh] overflow-hidden">
              <img src="/images/prom.jpg" className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105" alt="Prom & Graduation" />
            </Link>
            <div className="absolute top-1/2 -translate-y-1/2 -right-8 md:-right-24 z-10 pointer-events-none">
              <span className="block text-[10px] tracking-[0.2em] text-[#8C6D46] mb-2">01</span>
              <h3 className="font-serif text-5xl md:text-7xl text-[#1A1A1A] bg-[#FAF9F6] py-2 pr-4">Prom.</h3>
              <p className="font-serif italic text-lg text-[#555] bg-[#FAF9F6] pr-4">Own the night.</p>
            </div>
          </motion.div>

          {/* Block 02: Wedding Guest (Right aligned, wide, offset down) */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="md:col-span-6 md:col-start-7 mt-20 md:mt-48 relative group cursor-pointer"
          >
            <div className="absolute top-10 -left-6 md:-left-20 z-10 pointer-events-none text-right md:text-left">
              <span className="block text-[10px] tracking-[0.2em] text-[#8C6D46] mb-2">02</span>
              <h3 className="font-serif text-4xl md:text-6xl text-[#1A1A1A] bg-[#FAF9F6] py-2 pl-4">Wedding<br/>Guest.</h3>
            </div>
            <Link to="/custom/wedding" className="block relative h-[60vh] overflow-hidden">
              <img src="/images/wedding-guest.jpg" className="w-full h-full object-cover object-top transition-transform duration-[2000ms] ease-out group-hover:scale-105" alt="Wedding Guest" />
            </Link>
          </motion.div>

          {/* Block 03: Dinner & Gala (Center aligned, massive) */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="md:col-span-8 md:col-start-3 mt-10 md:mt-32 relative group cursor-pointer"
          >
            <Link to="/custom/dinner" className="block relative h-[70vh] overflow-hidden">
              <img src="/images/dinner.jpg" className="w-full h-full object-cover object-top transition-transform duration-[2000ms] ease-out group-hover:scale-105" alt="Dinner and Gala" />
            </Link>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-center w-full pointer-events-none">
              <h3 className="font-serif text-5xl md:text-7xl text-white drop-shadow-lg">Gala & Event.</h3>
              <p className="font-serif italic text-xl text-white drop-shadow-md">Command the room.</p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* =========================================
          4. THE ATELIER JOURNEY (Process)
          Pure typography. No icons, no borders, no boxes.
      ========================================= */}
      <section className="py-32 md:py-48 px-6 md:px-12 max-w-[1200px] mx-auto border-t border-[#E5E5E5] mt-24">
        <h2 className="text-[10px] tracking-[0.3em] uppercase text-[#8C6D46] mb-24 text-center">The Journey</h2>
        
        <div className="space-y-24 md:space-y-32">
          {[
            { step: "01", title: "The Dialogue", desc: "A private consultation to understand your vision, the occasion, and your personal style. We select fabrics and draft the initial silhouette." },
            { step: "02", title: "The Architecture", desc: "Precise measurements are translated into a custom pattern. Our artisans in Lagos begin the meticulous process of cutting and hand-basting." },
            { step: "03", title: "The Refinement", desc: "Through detailed fittings (virtual or in-person), we adjust the drape, the hem, and the tension until it acts as a second skin." },
            { step: "04", title: "The Realization", desc: "The final masterpiece is delivered. Ready to be worn, ready to make history." }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}
              className="flex flex-col md:flex-row gap-6 md:gap-24 items-start"
            >
              <div className="font-serif text-5xl md:text-7xl text-[#E5E5E5] italic w-32 shrink-0">
                {item.step}.
              </div>
              <div className="max-w-xl pt-2">
                <h3 className="font-serif text-2xl md:text-3xl mb-4">{item.title}</h3>
                <p className="text-[#555] leading-relaxed text-sm md:text-base">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* =========================================
          5. INVESTMENT & POLICY (Footer Menu)
          A minimal, multi-column fine-print aesthetic.
      ========================================= */}
      <section className="py-24 px-6 md:px-12 bg-[#1A1A1A] text-[#FAF9F6]">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
          
          <div className="md:col-span-4">
            <h2 className="font-serif text-4xl mb-8 text-[#B8860B]">Investment.</h2>
            <div className="space-y-6 text-sm font-light tracking-wide text-[#CCC]">
              <div className="flex justify-between border-b border-[#333] pb-2">
                <span>Prom / Dinner</span>
                <span className="font-serif italic">from $350 AUD</span>
              </div>
              <div className="flex justify-between border-b border-[#333] pb-2">
                <span>Wedding Guest</span>
                <span className="font-serif italic">from $450 AUD</span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-[#777] pt-4">
                *Final cost determined by fabric sourcing and artisanal complexity.
              </p>
            </div>
          </div>

          <div className="md:col-span-4 md:col-start-9">
            <h2 className="font-serif text-4xl mb-8 text-[#B8860B]">Policy.</h2>
            <div className="space-y-8 text-sm font-light leading-loose text-[#CCC]">
              <div>
                <strong className="block text-[10px] uppercase tracking-widest text-[#FFF] mb-1">Timeline</strong>
                Standard bespoke production requires 4–6 weeks. Express service (2–3 weeks) is available for a premium, subject to atelier capacity.
              </div>
              <div>
                <strong className="block text-[10px] uppercase tracking-widest text-[#FFF] mb-1">Commitment</strong>
                A 50% non-refundable deposit is required to commence pattern drafting.
              </div>
              <div className="pt-8">
                <Link to="/custom/book" className="text-xs font-bold uppercase tracking-[0.2em] border-b border-[#FAF9F6] pb-1 hover:text-[#B8860B] hover:border-[#B8860B] transition-colors duration-300">
                  Secure Your Slot
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}