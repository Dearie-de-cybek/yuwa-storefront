'use client';

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowRight, Check } from 'lucide-react';
import { OCCASIONS } from '@/lib/occasions';

const luxuryEase = [0.16, 1, 0.3, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: luxuryEase } },
};

// The three "big launch" occasions this section curates. Everyday Elegance
// lives in the nav's Shop mega menu and the /occasion index instead.
const EDIT_SLUGS = ['wedding', 'prom', 'dinner'];

function WaitlistForm({ occasionValue }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post('/api/waitlist', { email, occasion: occasionValue });
      setDone(true);
      toast.success("You're on the list — we'll notify you first.");
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="flex items-center gap-2 text-white text-[11px] font-bold uppercase tracking-[0.25em]">
        <Check size={14} /> You&rsquo;re on the list
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="group inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em] text-white border-b border-white/50 pb-1 hover:border-accent hover:text-accent transition-colors w-max"
      >
        Join the Waitlist
        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </button>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={submit}
      className="flex items-center gap-3 max-w-[240px]"
    >
      <input
        type="email"
        required
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        className="flex-1 min-w-0 bg-transparent border-b border-white/50 text-white placeholder:text-white/50 text-xs py-2 outline-none focus:border-white transition-colors"
      />
      <button
        type="submit"
        disabled={submitting}
        aria-label="Join waitlist"
        className="shrink-0 text-white hover:text-accent transition-colors disabled:opacity-50"
      >
        <ArrowRight size={16} />
      </button>
    </motion.form>
  );
}

export default function OccasionEdit({ summary = {} }) {
  const items = OCCASIONS.filter((o) => EDIT_SLUGS.includes(o.slug));

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-[#1A1918]">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={fadeUp}
        className="max-w-[1600px] mx-auto text-center mb-16 md:mb-20"
      >
        <span className="block text-[10px] tracking-[0.3em] uppercase mb-4 text-[#B8860B]">The Edit</span>
        <h2 className="font-serif text-4xl md:text-6xl text-[#FBF9F5]">The Occasion Edit</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1600px] mx-auto">
        {items.map((o, i) => {
          const s = summary[o.value] || { count: 0, image: null };
          const locked = s.count === 0;
          const bgImage = s.image || o.image;

          return (
            <motion.div
              key={o.slug}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              transition={{ delay: i * 0.1, duration: 1.2, ease: luxuryEase }}
              className="relative h-[70vh] md:h-[78vh] overflow-hidden group"
            >
              <img
                src={bgImage}
                alt={o.editTitle}
                className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-[2000ms] ease-out ${
                  locked ? 'grayscale' : 'group-hover:scale-105'
                }`}
              />
              <div
                className={`absolute inset-0 ${
                  locked ? 'bg-black/60' : 'bg-gradient-to-t from-black/85 via-black/10 to-black/20'
                }`}
              />

              <div className="absolute inset-0 flex flex-col justify-end p-8">
                {locked ? (
                  <>
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/60 mb-4">
                      Coming Soon
                    </span>
                    <h3 className="font-serif italic text-2xl md:text-3xl text-white mb-6">
                      The {o.title} Collection
                    </h3>
                    <WaitlistForm occasionValue={o.value} />
                  </>
                ) : (
                  <>
                    <span className="text-[10px] tracking-[0.3em] uppercase text-white/70 mb-4">0{i + 1}</span>
                    <h3 className="font-serif text-3xl md:text-4xl text-white mb-3">{o.editTitle}</h3>
                    <p className="font-serif italic text-white/85 mb-6 max-w-xs">{o.tagline}</p>
                    <Link
                      href={`/occasion/${o.slug}`}
                      className="group/link inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em] text-white border-b border-white/50 pb-1 hover:border-accent hover:text-accent transition-colors w-max"
                    >
                      {o.cta}
                      <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
