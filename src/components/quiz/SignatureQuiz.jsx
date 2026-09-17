'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { motion } from 'framer-motion';
import ProductCard from '@/components/product/ProductCard';
import { mapQuizProduct } from '@/lib/product';
import { ENTRANCES, OCCASIONS, TEXTURES } from '@/lib/signature';

const luxuryEase = [0.16, 1, 0.3, 1];

const stepVariants = {
  enter: { opacity: 0, y: 30 },
  center: { opacity: 1, y: 0, transition: { duration: 0.8, ease: luxuryEase } },
  exit: { opacity: 0, y: -30, transition: { duration: 0.5, ease: luxuryEase } },
};

const QUESTIONS = [
  { key: 'entrance', title: 'Your ideal entrance?', options: ENTRANCES },
  { key: 'occasion', title: 'Your perfect occasion?', options: OCCASIONS },
  { key: 'texture', title: 'Pick a texture', options: TEXTURES },
];

// A radio row: fill animates in on select, brief pause, then advances —
// visual confirmation before the step transitions away.
function RadioRow({ label, selected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className="w-full flex items-center gap-5 py-5 border-b border-border group text-left"
    >
      <span className="relative w-5 h-5 rounded-full border border-primary flex items-center justify-center shrink-0">
        {selected && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className="w-2.5 h-2.5 rounded-full bg-accent"
          />
        )}
      </span>
      <span className={`font-serif text-xl md:text-2xl transition-colors ${selected ? 'text-accent' : 'group-hover:text-accent'}`}>
        {label}
      </span>
    </button>
  );
}

export default function SignatureQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ entrance: null, occasion: null, texture: null });
  const [pendingSelect, setPendingSelect] = useState(null);
  const [phase, setPhase] = useState('question'); // question | calculating | reveal
  const [results, setResults] = useState(null);

  const question = QUESTIONS[step];

  const choose = (value) => {
    setPendingSelect(value);
    setTimeout(() => {
      const key = question.key;
      const next = { ...answers, [key]: value };
      setAnswers(next);
      setPendingSelect(null);

      if (step < QUESTIONS.length - 1) {
        setStep((s) => s + 1);
      } else {
        runReveal(next);
      }
    }, 450);
  };

  const runReveal = async (finalAnswers) => {
    setPhase('calculating');
    const entrance = ENTRANCES.find((e) => e.value === finalAnswers.entrance);
    const occasion = OCCASIONS.find((o) => o.value === finalAnswers.occasion);
    const texture = TEXTURES.find((t) => t.value === finalAnswers.texture);

    const [{ data }] = await Promise.all([
      axios.get('/api/style-quiz', {
        params: {
          occasion: occasion?.occasion,
          mood: entrance?.mood,
          silhouette: entrance?.silhouette,
          material: texture?.keyword,
        },
      }),
      new Promise((r) => setTimeout(r, 1400)), // deliberate pause — "reading your signature"
    ]);

    setResults(data.products || []);
    setPhase('reveal');
  };

  const startOver = () => {
    setAnswers({ entrance: null, occasion: null, texture: null });
    setResults(null);
    setStep(0);
    setPhase('question');
  };

  const entrance = ENTRANCES.find((e) => e.value === answers.entrance);

  return (
    <div className="min-h-screen bg-[#0F0F0E] text-white pt-32 pb-24 px-6">
      <div className="max-w-[900px] mx-auto">
        {phase === 'question' && (
          <>
            {/* Intro (only on first question) */}
            {step === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: luxuryEase }}
                className="text-center mb-16"
              >
                <span className="block text-[10px] tracking-[0.3em] uppercase mb-5 text-[#B8860B]">
                  Find Your Signature
                </span>
                <p className="font-serif italic text-lg md:text-xl text-white/70 max-w-md mx-auto">
                  Your style says more than your outfit. Let&rsquo;s find the piece that speaks for you.
                </p>
              </motion.div>
            )}

            {/* Progress */}
            <div className="flex items-center justify-center gap-3 mb-14">
              {QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className={`h-[2px] w-10 transition-colors duration-500 ${i <= step ? 'bg-[#B8860B]' : 'bg-white/15'}`}
                />
              ))}
            </div>

            {/* key={step} forces a fresh mount each question — instant, reliable
                unmount of the old one (no AnimatePresence exit tracking to
                get stuck on) with a clean enter animation on the new one. */}
            <motion.div key={step} initial="enter" animate="center" variants={stepVariants}>
                <h1 className="font-serif text-3xl md:text-5xl text-center mb-14">{question.title}</h1>
                <div className="max-w-md mx-auto">
                  {question.options.map((opt) => (
                    <RadioRow
                      key={opt.value}
                      label={opt.label}
                      selected={pendingSelect === opt.value}
                      onSelect={() => choose(opt.value)}
                    />
                  ))}
                </div>
            </motion.div>
          </>
        )}

        {phase === 'calculating' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-40"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 rounded-full border border-[#B8860B] border-t-transparent mb-8"
            />
            <p className="font-serif italic text-lg text-white/70">Reading your signature&hellip;</p>
          </motion.div>
        )}

        {phase === 'reveal' && (
          <div>
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: luxuryEase }}
                className="block text-[10px] tracking-[0.3em] uppercase mb-6 text-white/50"
              >
                Your Style
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, delay: 0.3, ease: luxuryEase }}
                className="font-serif italic text-4xl md:text-6xl lg:text-7xl mb-8 text-[#FBF9F5]"
              >
                {entrance?.persona}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.7, ease: luxuryEase }}
                className="text-white/70 max-w-lg mx-auto leading-relaxed mb-8"
              >
                {entrance?.description}
              </motion.p>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                onClick={startOver}
                className="text-xs uppercase tracking-widest text-white/50 hover:text-white underline decoration-dotted transition-colors"
              >
                Start Over
              </motion.button>
            </div>

            {results && results.length > 0 ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 1.2 } } }}
                className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 bg-[#FBF9F5] p-6 md:p-10 rounded-sm"
              >
                {results.map((p) => (
                  <motion.div
                    key={p.id}
                    variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: luxuryEase } } }}
                  >
                    <ProductCard product={mapQuizProduct(p)} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-center py-20 text-white/60"
              >
                <p className="font-serif text-xl text-white mb-4">Nothing matched yet — but the collection grows weekly.</p>
                <Link href="/shop/ready-to-wear" className="text-xs font-bold uppercase tracking-widest border-b border-white/50 pb-1 hover:text-[#B8860B] hover:border-[#B8860B] transition-colors">
                  Browse Everything
                </Link>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
