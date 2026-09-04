'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';

const luxuryEase = [0.16, 1, 0.3, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: luxuryEase } },
};

export default function OccasionShop({ occasion, products }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Editorial hero */}
      <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden flex items-end">
        <img src={occasion.image} alt={occasion.title} className="absolute inset-0 w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative z-10 px-6 md:px-12 pb-12 max-w-[1440px] mx-auto w-full text-white"
        >
          <span className="block text-[10px] tracking-[0.3em] uppercase mb-4 text-white/80">Shop by Occasion</span>
          <h1 className="font-serif text-5xl md:text-7xl mb-3">{occasion.title}</h1>
          <p className="font-serif italic text-lg md:text-2xl text-white/90 max-w-xl">{occasion.tagline}</p>
        </motion.div>
      </section>

      {/* Product grid */}
      <section className="px-6 py-16 md:py-20 max-w-[1440px] mx-auto">
        <div className="flex items-center justify-between mb-10">
          <Link
            href="/occasion"
            className="text-xs text-gray-400 hover:text-black flex items-center gap-2 uppercase tracking-widest transition-colors"
          >
            <ArrowLeft size={14} /> All Occasions
          </Link>
          <span className="text-xs uppercase tracking-widest text-gray-400">
            {products.length} piece{products.length !== 1 ? 's' : ''}
          </span>
        </div>

        {products.length === 0 ? (
          <div className="py-32 text-center text-gray-400">
            <p className="font-serif text-2xl text-black mb-3">Coming soon.</p>
            <p className="text-sm">New {occasion.title.toLowerCase()} pieces are being curated.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12">
            {products.map((p) => (
              <motion.div
                key={p.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeUp}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
