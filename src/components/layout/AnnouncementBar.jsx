'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';

// Must match the Navbar's scroll threshold so the bar tucks away exactly
// as the nav snaps to top:0 — no gap, no overlap.
export const HIDE_AT = 40;

const MESSAGES = [
  { text: 'Book a Private Styling Consultation', href: '/custom/book' },
  { text: 'Complimentary Shipping on Orders Over ₦250,000' },
  { text: 'New — Shop by Occasion', href: '/occasion' },
];

const luxuryEase = [0.16, 1, 0.3, 1];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setHidden(window.scrollY > HIDE_AT);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 4500);
    return () => clearInterval(timerRef.current);
  }, [paused]);

  const current = MESSAGES[index];
  const total = String(MESSAGES.length).padStart(2, '0');
  const position = String(index + 1).padStart(2, '0');

  return (
    <div
      className={`fixed top-0 inset-x-0 z-[60] bg-primary text-white transition-transform duration-500 ease-out ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="h-9 flex items-center justify-between px-6 max-w-[1600px] mx-auto text-[10px] uppercase tracking-[0.2em]">
        <span className="tabular-nums text-white/45 w-10 shrink-0">
          {position}/{total}
        </span>

        <div className="flex-1 flex justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: luxuryEase }}
            >
              {current.href ? (
                <Link href={current.href} className="hover:text-accent transition-colors">
                  {current.text}
                </Link>
              ) : (
                <span>{current.text}</span>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? 'Resume announcements' : 'Pause announcements'}
          className="w-10 shrink-0 flex justify-end text-white/70 hover:text-white transition-colors"
        >
          {paused ? <Play size={11} /> : <Pause size={11} />}
        </button>
      </div>
    </div>
  );
}
