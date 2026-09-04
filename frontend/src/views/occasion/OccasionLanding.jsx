'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { OCCASIONS } from '@/lib/occasions';

const luxuryEase = [0.16, 1, 0.3, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.4, ease: luxuryEase } },
};

export default function OccasionLanding() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-[#FAF9F6]">
      {/* Intro */}
      <section className="pt-40 pb-16 md:pb-24 px-6 md:px-12 max-w-[1440px] mx-auto text-center">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <span className="block text-[10px] tracking-[0.3em] uppercase mb-6 text-[#8C6D46]">The Edit</span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight mb-8">Shop by Occasion</h1>
          <p className="font-serif italic text-lg md:text-2xl text-[#555] max-w-xl mx-auto">
            Not “which dress do I like?” — but “what am I dressing for?”
          </p>
        </motion.div>
      </section>

      {/* Occasion blocks — broken editorial grid */}
      <section className="pb-32 px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24 md:gap-y-40">
          {OCCASIONS.map((o, i) => (
            <motion.div
              key={o.slug}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeUp}
              className={`group ${i % 2 === 1 ? 'md:mt-32' : ''}`}
            >
              <Link href={`/occasion/${o.slug}`} className="block">
                <div className="relative overflow-hidden h-[65vh] md:h-[75vh]">
                  <img
                    src={o.image}
                    alt={o.title}
                    className="w-full h-full object-cover object-top transition-transform duration-[2000ms] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />
                  <span className="absolute top-6 left-6 text-[11px] tracking-[0.3em] uppercase text-white/80">
                    0{i + 1}
                  </span>
                </div>
                <div className="mt-6 flex items-end justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-3xl md:text-5xl mb-2">{o.title}</h2>
                    <p className="font-serif italic text-base md:text-lg text-[#555] max-w-sm">{o.tagline}</p>
                  </div>
                  <ArrowRight
                    size={24}
                    className="text-[#8C6D46] shrink-0 mb-2 -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500"
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
