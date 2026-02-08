import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Calendar, Scissors, Truck, Ruler, AlertCircle } from 'lucide-react';

// Animation Variants for "Staggered" entry
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

export default function CustomLanding() {
  return (
    <div className="min-h-screen bg-secondary text-primary font-sans pt-20">
      
      {/* 1. HERO SECTION */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative px-6 py-20 md:py-32 max-w-[1440px] mx-auto text-center"
      >
        <motion.span variants={itemVariants} className="block text-accent text-sm tracking-[0.2em] uppercase mb-6 font-medium">
          The Yuwa Brand
        </motion.span>
        
        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-serif mb-6 leading-tight">
          Custom Creations
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-xl md:text-2xl font-serif italic text-muted mb-12">
          Designed. Tailored. Timeless.
        </motion.p>
        
        <motion.div variants={itemVariants} className="max-w-2xl mx-auto text-lg leading-relaxed text-primary/80">
          <p>
            For those seeking something truly unique. Each piece is thoughtfully designed 
            and handcrafted to suit your occasion, body, and personal style — 
            from prom dresses to wedding guest outfits and elegant dinner wear.
          </p>
        </motion.div>
      </motion.section>

      {/* 2. CATEGORIES GRID */}
      <section className="px-6 pb-24 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Prom', 'Wedding Guest', 'Dinner & Events'].map((category, idx) => (
            <Link key={idx} to={`/custom/${category.toLowerCase().replace(' ', '-')}`} className="group relative h-[400px] overflow-hidden bg-[#EAE5DF]">
              {/* Image Placeholder */}
              <div className="absolute inset-0 bg-neutral-300 transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500" />
              
              <div className="absolute bottom-8 left-8">
                <h3 className="text-2xl font-serif text-white mb-2">{category}</h3>
                <span className="text-white/80 text-sm uppercase tracking-widest border-b border-white/50 pb-1 group-hover:border-white transition-all">
                  Explore
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. HOW IT WORKS (Process) */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">The Process</h2>
            <div className="w-16 h-[1px] bg-accent mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-8 left-0 w-full h-[1px] bg-border z-0" />

            {[
              { icon: Calendar, title: "Consultation", desc: "Select category & submit request." },
              { icon: Scissors, title: "Design", desc: "Discuss fabrics, colors & details." },
              { icon: Ruler, title: "Measurements", desc: "Confirmed before production starts." },
              { icon: Clock, title: "Production", desc: "Carefully handcrafted for you." },
              { icon: Truck, title: "Delivery", desc: "Final pickup or shipping." },
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center bg-white p-4">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-accent mb-6 border border-border">
                  <step.icon size={24} strokeWidth={1.5} />
                </div>
                <h4 className="font-serif text-lg mb-2">{step.title}</h4>
                <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INFO & POLICY (Two Columns) */}
      <section className="px-6 py-24 max-w-[1440px] mx-auto bg-secondary">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          
          {/* Turnaround & Pricing */}
          <div>
            <h3 className="text-2xl font-serif mb-8 flex items-center gap-3">
              <Clock className="text-accent" size={24} />
              Turnaround & Pricing
            </h3>
            
            <div className="space-y-8">
              <div>
                <h4 className="font-medium text-lg mb-2">Production Timeline</h4>
                <ul className="space-y-2 text-muted">
                  <li>• Standard: <span className="text-primary font-medium">4–6 weeks</span></li>
                  <li>• Express: <span className="text-primary font-medium">2–3 weeks</span> (+$100–$200 AUD)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-lg mb-2">Starting Prices</h4>
                <ul className="space-y-2 text-muted">
                  <li className="flex justify-between border-b border-border pb-2">
                    <span>Prom / Dinner Dresses</span>
                    <span>from $350 AUD</span>
                  </li>
                  <li className="flex justify-between border-b border-border pb-2">
                    <span>Wedding Guest Outfits</span>
                    <span>from $450 AUD</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Express & Policy */}
          <div className="bg-white p-8 border border-border">
            <h3 className="text-2xl font-serif mb-6 flex items-center gap-3">
              <AlertCircle className="text-accent" size={24} />
              Important Policy
            </h3>
            
            <div className="space-y-4 text-sm text-muted leading-relaxed">
              <p>
                <strong className="text-primary block mb-1">Deposits & Refunds:</strong> 
                A 50% non-refundable deposit is required to begin. Custom orders are non-refundable once production starts.
              </p>
              <p>
                <strong className="text-primary block mb-1">Express Service:</strong> 
                Available for urgent orders. Express fees are non-refundable and subject to slot availability.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <Link 
                to="/book-consultation" 
                className="block w-full py-4 bg-primary text-white text-center uppercase tracking-widest text-sm hover:bg-accent transition-colors duration-300"
              >
                Book a Custom Design
              </Link>
              <p className="text-center text-xs text-muted mt-3">Limited slots available monthly.</p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}