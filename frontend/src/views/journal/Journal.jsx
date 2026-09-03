import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- LUXURY ANIMATION EASE ---
const luxuryEase = [0.16, 1, 0.3, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.4, ease: luxuryEase } }
};

// --- EDITORIAL CONTENT SYSTEM ---
const CATEGORIES = ['All', 'Editorial', 'Culture', 'Atelier', 'Styling'];

const FEATURED_STORY = {
  id: 'feat-1',
  title: "The Modern Bubu: Power, Presence, Identity",
  category: "Editorial",
  abstract: "How volume translates to taking up space in modern cities. A definitive guide to wearing your heritage without apology.",
  image: "/images/silk.jpg", 
  imageDesc: "Low angle, striking Black model in a voluminous silk bubu against stark, modern concrete architecture."
};

const EDITORIAL_STORIES = [
  {
    id: 1,
    layout: "large-vertical", // Left side
    title: "From Lagos to London: The Architecture of Identity",
    category: "Culture",
    abstract: "As we navigate new time zones and foreign streets, the garments we carry become our truest anchors. An essay on movement and memory.",
    image: "/images/tailor3.jpg",
    imageDesc: "Model walking decisively across a blurred European cityscape, wearing a sharp Aso-Oke coat over minimal basics."
  },
  {
    id: 2,
    layout: "small-stacked-top", // Right side top
    title: "The Language of Fabric: Speaking Without Words",
    category: "Styling",
    abstract: "The unspoken dialogue between hand-dyed silk and the woman who wears it. Why texture is the ultimate luxury.",
    image: "/images/journal1.jpg",
    imageDesc: "Close-up macro shot of Adire fabric draped over a collarbone, highlighting the sheen and texture."
  },
  {
    id: 3,
    layout: "small-stacked-bottom", // Right side bottom
    title: "Inside the Atelier: The Abeokuta Artisans",
    category: "Atelier",
    abstract: "A rare glimpse into the ancestral dyeing techniques preserving the art of Adire for the next generation.",
    image: "/images/journal2.jpg",
    imageDesc: "Hands submerged in indigo dye vats, capturing the raw, messy beauty of the craft."
  },
  {
    id: 4,
    layout: "wide-horizontal", // Bottom full width spanning
    title: "Dressing Between Worlds: The Diaspora Wardrobe",
    category: "Culture",
    abstract: "Reconciling the warmth of home with the stark lines of western minimalism. How to curate a closet that belongs to two worlds at once.",
    image: "/images/journal3.jpg",
    imageDesc: "Two models in a minimalist, sun-drenched desert house, wearing flowing earth-toned garments."
  }
];

export default function Journal() {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <div className="bg-[#F8F6F2] text-[#1A1A1A] font-sans min-h-screen selection:bg-[#1A1A1A] selection:text-[#F8F6F2]">
      
      {/* =========================================
          1. HERO SECTION (Cinematic Entry)
      ========================================= */}
      <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden bg-[#1A1A1A]">
        <motion.div 
          initial={{ scale: 1.05 }} animate={{ scale: 1 }} transition={{ duration: 2.5, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <img 
            src="/images/journal.jpg" 
            alt="YUWA Journal Hero" 
            className="w-full h-full object-cover object-[50%_30%] opacity-70"
          />
        </motion.div>
        <div className="absolute inset-0 bg-black/30" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10 mt-20">
          <motion.h1 
            initial="hidden" animate="visible" variants={fadeUp}
            className="font-serif text-6xl md:text-8xl lg:text-[9rem] text-[#F8F6F2] tracking-tight mb-6"
          >
            The Journal.
          </motion.h1>
          <motion.p 
            initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }}
            className="font-serif italic text-lg md:text-2xl text-[#EAE8E3] max-w-2xl"
          >
            Stories of heritage, movement, and modern African luxury.
          </motion.p>
        </div>
      </section>

      {/* =========================================
          2. CATEGORY FILTER (Minimalist)
      ========================================= */}
      <div className="sticky top-[72px] md:top-[88px] z-40 bg-[#F8F6F2]/95 backdrop-blur-md border-b border-[#E0DCD3] py-6 px-6 md:px-12 flex justify-center md:justify-start gap-8 overflow-x-auto hide-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-[10px] tracking-[0.2em] uppercase font-bold whitespace-nowrap transition-colors duration-500 pb-1 border-b ${
              activeCategory === cat 
                ? 'text-[#1A1A1A] border-[#1A1A1A]' 
                : 'text-[#888] border-transparent hover:text-[#1A1A1A]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-20 md:py-32">
        
        {/* =========================================
            3. FEATURED STORY (Dominant Block)
        ========================================= */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-32 md:mb-48 items-center"
        >
          <Link to={`/journal/${FEATURED_STORY.id}`} className="lg:col-span-7 group relative overflow-hidden h-[60vh] md:h-[80vh] bg-[#E0DCD3]">
            <img 
              src={FEATURED_STORY.image} 
              alt={FEATURED_STORY.title}
              className="w-full h-full object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-105"
            />
          </Link>
          
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#8C6D46] font-bold mb-6 block">
              {FEATURED_STORY.category}
            </span>
            <Link to={`/journal/${FEATURED_STORY.id}`} className="group block">
              <h2 className="font-serif text-4xl md:text-6xl leading-[1.1] text-[#1A1A1A] mb-8 group-hover:text-[#8C6D46] transition-colors duration-500">
                {FEATURED_STORY.title}
              </h2>
            </Link>
            <p className="text-[#555] text-lg font-light leading-relaxed mb-10">
              {FEATURED_STORY.abstract}
            </p>
            <Link to={`/journal/${FEATURED_STORY.id}`} className="group inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-[#1A1A1A] pb-1 w-max hover:text-[#8C6D46] hover:border-[#8C6D46] transition-all duration-500">
              Read Story
              <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-500" />
            </Link>
          </div>
        </motion.section>

        {/* =========================================
            4. ASYMMETRICAL EDITORIAL GRID
        ========================================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-24 md:gap-x-12 lg:gap-x-24">
          
          {/* Left Column: Large Vertical */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="md:col-span-6 flex flex-col"
          >
            <Link to={`/journal/${EDITORIAL_STORIES[0].id}`} className="group block mb-8 overflow-hidden bg-[#E0DCD3] aspect-[3/4]">
              <img src={EDITORIAL_STORIES[0].image} alt={EDITORIAL_STORIES[0].title} className="w-full h-full object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-105" />
            </Link>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#8C6D46] font-bold mb-4 block">
              {EDITORIAL_STORIES[0].category}
            </span>
            <Link to={`/journal/${EDITORIAL_STORIES[0].id}`} className="group block mb-4">
              <h3 className="font-serif text-3xl md:text-5xl leading-tight group-hover:text-[#8C6D46] transition-colors duration-500">{EDITORIAL_STORIES[0].title}</h3>
            </Link>
            <p className="text-[#555] font-light leading-relaxed">{EDITORIAL_STORIES[0].abstract}</p>
          </motion.div>

          {/* Right Column: Two Stacked Stories */}
          <div className="md:col-span-6 flex flex-col gap-24 md:pt-32">
            
            {/* Stacked Top */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
              <Link to={`/journal/${EDITORIAL_STORIES[1].id}`} className="group block mb-6 overflow-hidden bg-[#E0DCD3] aspect-square">
                <img src={EDITORIAL_STORIES[1].image} alt={EDITORIAL_STORIES[1].title} className="w-full h-full object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-105" />
              </Link>
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#8C6D46] font-bold mb-3 block">
                {EDITORIAL_STORIES[1].category}
              </span>
              <Link to={`/journal/${EDITORIAL_STORIES[1].id}`} className="group block mb-3">
                <h3 className="font-serif text-2xl md:text-3xl leading-snug group-hover:text-[#8C6D46] transition-colors duration-500">{EDITORIAL_STORIES[1].title}</h3>
              </Link>
            </motion.div>

            {/* Stacked Bottom */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
              <Link to={`/journal/${EDITORIAL_STORIES[2].id}`} className="group block mb-6 overflow-hidden bg-[#E0DCD3] aspect-[4/3]">
                <img src={EDITORIAL_STORIES[2].image} alt={EDITORIAL_STORIES[2].title} className="w-full h-full object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-105" />
              </Link>
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#8C6D46] font-bold mb-3 block">
                {EDITORIAL_STORIES[2].category}
              </span>
              <Link to={`/journal/${EDITORIAL_STORIES[2].id}`} className="group block mb-3">
                <h3 className="font-serif text-2xl md:text-3xl leading-snug group-hover:text-[#8C6D46] transition-colors duration-500">{EDITORIAL_STORIES[2].title}</h3>
              </Link>
            </motion.div>

          </div>

          {/* Bottom Row: Wide Horizontal Spanning */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="md:col-span-12 mt-12 md:mt-24 pt-24 border-t border-[#E0DCD3] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div className="order-2 lg:order-1 lg:pr-12">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#8C6D46] font-bold mb-6 block">
                {EDITORIAL_STORIES[3].category}
              </span>
              <Link to={`/journal/${EDITORIAL_STORIES[3].id}`} className="group block mb-6">
                <h3 className="font-serif text-4xl md:text-5xl leading-tight group-hover:text-[#8C6D46] transition-colors duration-500">{EDITORIAL_STORIES[3].title}</h3>
              </Link>
              <p className="text-[#555] font-light text-lg leading-relaxed mb-8 max-w-lg">
                {EDITORIAL_STORIES[3].abstract}
              </p>
              <Link to={`/journal/${EDITORIAL_STORIES[3].id}`} className="group inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-[#1A1A1A] pb-1 hover:text-[#8C6D46] hover:border-[#8C6D46] transition-all duration-500">
                Read Story <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-500" />
              </Link>
            </div>
            <Link to={`/journal/${EDITORIAL_STORIES[3].id}`} className="order-1 lg:order-2 group block overflow-hidden bg-[#E0DCD3] h-[40vh] md:h-[60vh]">
              <img src={EDITORIAL_STORIES[3].image} alt={EDITORIAL_STORIES[3].title} className="w-full h-full object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-105" />
            </Link>
          </motion.div>

        </div>
      </div>
      
      {/* Hide scrollbar util for the category nav on mobile */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}