'use client';

import { motion } from 'framer-motion';
import { FABRICS } from '@/lib/fabrics';

const luxuryEase = [0.16, 1, 0.3, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: luxuryEase } },
};

export default function FabricEdit() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-[#FAF9F6]">
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp}
        className="max-w-[1600px] mx-auto text-center mb-16 md:mb-20"
      >
        <span className="block text-[10px] tracking-[0.3em] uppercase mb-4 text-[#8C6D46]">Craft & Material</span>
        <h2 className="font-serif text-4xl md:text-6xl">The Fabric Edit</h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1600px] mx-auto">
        {FABRICS.map((f, i) => (
          <motion.div
            key={f.key}
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={fadeUp}
            transition={{ delay: i * 0.1, duration: 1.2, ease: luxuryEase }}
            className="group"
          >
            <div className="relative aspect-square overflow-hidden mb-5">
              <img
                src={f.image}
                alt={`${f.name} fabric close-up`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
            </div>
            <h3 className="font-serif text-2xl md:text-3xl mb-2">{f.name}</h3>
            <p className="font-serif italic text-sm md:text-base text-[#555] mb-2">{f.tagline}</p>
            <p className="text-xs text-[#777] leading-relaxed">{f.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
