import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// --- LUXURY ANIMATION CONFIG ---
const luxuryEase = [0.16, 1, 0.3, 1]; 
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.5, ease: luxuryEase } }
};

export default function BookConsultation() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    occasion: '',
    date: '',
    vision: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate deliberate, slow processing
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 2000);
  };

  // --- SUCCESS STATE (Editorial Thank You) ---
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center px-6">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center max-w-2xl">
          <span className="block text-[10px] tracking-[0.3em] uppercase mb-8 text-[#8C6D46]">
            Request Received
          </span>
          <h1 className="font-serif text-5xl md:text-7xl mb-8 text-[#1A1A1A]">
            The dialogue <br/> <span className="italic text-[#555]">has begun.</span>
          </h1>
          <p className="text-[#555] font-light leading-relaxed mb-12">
            Our atelier will review your vision and contact you within 24 hours to schedule your private consultation.
          </p>
          <a href="/" className="text-[10px] tracking-[0.2em] uppercase font-bold border-b border-[#1A1A1A] pb-1 hover:text-[#8C6D46] hover:border-[#8C6D46] transition-colors duration-500">
            Return to Homepage
          </a>
        </motion.div>
      </div>
    );
  }

  // --- THE CONSULTATION EXPERIENCE ---
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-[#FAF9F6] pt-32 pb-32 overflow-hidden">
      
      {/* HEADER */}
      <motion.header 
        initial="hidden" animate="visible" variants={fadeUp}
        className="max-w-300 mx-auto px-6 md:px-12 mb-32 md:mb-48 flex flex-col md:flex-row md:items-end justify-between gap-12"
      >
        <div className="max-w-2xl">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-[6rem] leading-[0.9] tracking-tight mb-8">
            The <br />
            <span className="italic font-light text-[#555]">Consultation.</span>
          </h1>
          <p className="text-lg md:text-xl font-light text-[#444] leading-relaxed">
            Every masterpiece begins with a conversation. Share your details below to request a private appointment with our master tailors.
          </p>
        </div>
        
        {/* Subtle Decorative Image */}
        <div className="hidden md:block w-48 h-64 overflow-hidden">
          <img 
            src="/images/atelier-fabric.jpg"
            alt="Atelier Fabric" 
            className="w-full h-full object-cover grayscale opacity-80"
          />
        </div>
      </motion.header>

      {/* THE JOURNEY (FORM) */}
      <form onSubmit={handleSubmit} className="max-w-300 mx-auto px-6 md:px-12">
        
        {/* CHAPTER 01: IDENTITY */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
          className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 mb-32 md:mb-48"
        >
          <div className="md:col-span-4">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#8C6D46] block sticky top-32">
              01. Your Identity
            </span>
          </div>
          <div className="md:col-span-8 space-y-16">
            <div className="relative group">
              <input 
                required type="text" name="name" value={formData.name} onChange={handleChange}
                placeholder="Your Name"
                className="w-full bg-transparent border-b border-[#E0DCD3] py-4 text-3xl md:text-5xl font-serif text-[#1A1A1A] placeholder-[#D1CFC7] focus:outline-none focus:border-[#1A1A1A] transition-colors duration-700 rounded-none"
              />
            </div>
            <div className="relative group">
              <input 
                required type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="Email Address"
                className="w-full bg-transparent border-b border-[#E0DCD3] py-4 text-3xl md:text-5xl font-serif text-primary placeholder-[#D1CFC7] focus:outline-none focus:border-primary transition-colors duration-700 rounded-none"
              />
            </div>
            <div className="relative group">
              <input 
                required type="text" name="phone" value={formData.phone} onChange={handleChange}
                placeholder="Phone Number"
                className="w-full bg-transparent border-b border-[#E0DCD3] py-4 text-3xl md:text-5xl font-serif text-[#1A1A1A] placeholder-[#D1CFC7] focus:outline-none focus:border-[#1A1A1A] transition-colors duration-700 rounded-none"
              />
            </div>
          </div>
        </motion.section>

        {/* CHAPTER 02: THE OCCASION */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
          className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 mb-32 md:mb-48"
        >
          <div className="md:col-span-4">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#8C6D46] block sticky top-32">
              02. The Occasion
            </span>
          </div>
          <div className="md:col-span-8 space-y-16">
            <div className="relative group">
              <input 
                required type="text" name="occasion" value={formData.occasion} onChange={handleChange}
                placeholder="Event Type (e.g. Wedding, Gala)"
                className="w-full bg-transparent border-b border-[#E0DCD3] py-4 text-3xl md:text-5xl font-serif text-[#1A1A1A] placeholder-[#D1CFC7] focus:outline-none focus:border-[#1A1A1A] transition-colors duration-700 rounded-none"
              />
            </div>
            <div className="relative group">
              {/* Note: Using text instead of 'date' type prevents ugly browser-default calendars */}
              <input 
                required type="text" name="date" value={formData.date} onChange={handleChange}
                placeholder="Event Date (e.g. October 24, 2026)"
                className="w-full bg-transparent border-b border-[#E0DCD3] py-4 text-3xl md:text-5xl font-serif text-[#1A1A1A] placeholder-[#D1CFC7] focus:outline-none focus:border-[#1A1A1A] transition-colors duration-700 rounded-none"
              />
            </div>
          </div>
        </motion.section>

        {/* CHAPTER 03: THE VISION */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
          className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 mb-32"
        >
          <div className="md:col-span-4">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#8C6D46] block sticky top-32">
              03. Your Vision
            </span>
          </div>
          <div className="md:col-span-8">
            <div className="relative group">
              <textarea 
                required name="vision" value={formData.vision} onChange={handleChange}
                rows={4}
                placeholder="Tell us about your dream silhouette, fabrics, and inspirations..."
                className="w-full bg-transparent border-b border-[#E0DCD3] py-4 text-2xl md:text-4xl font-serif text-[#1A1A1A] placeholder-[#D1CFC7] focus:outline-none focus:border-[#1A1A1A] transition-colors duration-700 rounded-none resize-none leading-relaxed"
              />
            </div>
          </div>
        </motion.section>

        {/* CHAPTER 04: THE COMMITMENT (SUBMIT) */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}
          className="border-t border-[#E0DCD3] pt-24 md:pt-32 flex flex-col items-center text-center"
        >
          <p className="font-serif italic text-xl md:text-2xl text-[#555] mb-12 max-w-xl">
            "Each garment is a dialogue between artisan and muse. Please review your details before submitting."
          </p>

          <button 
            type="submit" 
            disabled={loading}
            className="group flex items-center gap-6 text-sm font-bold uppercase tracking-[0.3em] text-primary hover:text-[#8C6D46] transition-colors duration-500 disabled:opacity-50"
          >
            {loading ? 'Reserving Your Time...' : 'Begin Your Consultation'}
            {!loading && (
              <span className="w-12 h-px bg-primary group-hover:bg-[#8C6D46] group-hover:w-16 transition-all duration-500 relative flex items-center justify-end">
                <ArrowRight size={16} className="absolute -right-1" />
              </span>
            )}
          </button>
        </motion.section>

      </form>
    </div>
  );
}