'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const luxuryEase = [0.16, 1, 0.3, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: luxuryEase } },
};

export default function HowToWearIt({ mood, occasions = [], styleWith = [] }) {
  const hasMood = Boolean(mood?.trim());
  const hasOccasions = occasions.length > 0;
  const hasStyleWith = styleWith.length > 0;

  // Nothing to show — don't render an empty section.
  if (!hasMood && !hasOccasions && !hasStyleWith) return null;

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={fadeUp}
      className="py-16 md:py-20 border-t border-border bg-secondary/30"
    >
      <div className="max-w-[1000px] mx-auto px-6">
        <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-muted mb-3 text-center">
          The Look
        </span>

        {hasMood && (
          <h2 className="font-serif italic text-3xl md:text-4xl text-center mb-14">{mood}</h2>
        )}

        {(hasOccasions || hasStyleWith) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 max-w-2xl mx-auto">
            {hasOccasions && (
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mb-5">Wear It To</h3>
                <ul className="space-y-3">
                  {occasions.map((o, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <Check size={14} className="text-accent shrink-0" />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {hasStyleWith && (
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mb-5">Style It With</h3>
                <ul className="space-y-3">
                  {styleWith.map((s, i) => (
                    <li key={i} className="text-sm font-serif italic text-[#555]">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.section>
  );
}
