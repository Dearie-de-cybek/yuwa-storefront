'use client';

import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';

const luxuryEase = [0.16, 1, 0.3, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: luxuryEase } },
};

const CITIES = ['Sydney', 'Melbourne', 'Brisbane', 'Perth'];
const HASHTAG = '#StyledByYUWA';

export default function SeenOnYou({ posts = [] }) {
  const hasPosts = posts.length > 0;

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-white">
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp}
        className="max-w-[1600px] mx-auto text-center mb-16"
      >
        <span className="block text-[10px] tracking-[0.3em] uppercase mb-4 text-accent">From Our Community</span>
        <h2 className="font-serif text-4xl md:text-6xl mb-4">Seen On You.</h2>
        <p className="text-sm md:text-base text-muted max-w-md mx-auto">
          {hasPosts
            ? `Real women, real YUWA, across ${CITIES.join(', ')}.`
            : 'This space belongs to our future customers — tag us for a chance to be featured here.'}
        </p>
      </motion.div>

      {hasPosts ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-[1600px] mx-auto">
          {posts.slice(0, 8).map((p, i) => (
            <motion.div
              key={p.id}
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={fadeUp}
              transition={{ delay: i * 0.06, duration: 1, ease: luxuryEase }}
              className="relative aspect-[3/4] overflow-hidden group"
            >
              <img
                src={p.imageUrl}
                alt={p.caption || `Styled by a customer in ${p.city}`}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-3 left-3 text-white text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                {p.city}{p.handle ? ` · ${p.handle}` : ''}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={fadeUp}
          className="max-w-2xl mx-auto text-center bg-secondary/40 border border-border p-12 md:p-16"
        >
          <Instagram size={28} className="mx-auto mb-6 text-accent" strokeWidth={1.5} />
          <p className="font-serif italic text-2xl md:text-3xl mb-6">Be the first to be featured.</p>
          <p className="text-sm text-muted mb-8 max-w-md mx-auto">
            Wear YUWA, tag {HASHTAG}, and you could see yourself right here — alongside women in{' '}
            {CITIES.join(', ')}.
          </p>
          <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] border-b border-primary pb-1">
            {HASHTAG}
          </span>
        </motion.div>
      )}
    </section>
  );
}
