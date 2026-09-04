'use client';

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { OCCASIONS } from '@/lib/occasions';

const luxuryEase = [0.16, 1, 0.3, 1];
const stepVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0, transition: { duration: 0.7, ease: luxuryEase } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.4, ease: luxuryEase } },
};

const MOODS = [
  { value: 'ELEGANT', label: 'Elegant', desc: 'Timeless, refined, quietly powerful.' },
  { value: 'BOLD', label: 'Bold', desc: 'Unapologetic color and presence.' },
  { value: 'MINIMAL', label: 'Minimal', desc: 'Clean lines, understated luxury.' },
  { value: 'DRAMATIC', label: 'Dramatic', desc: 'Statement-making, unforgettable.' },
];

const SILHOUETTES = [
  { value: 'FLOWING', label: 'Flowing', desc: 'Movement, softness, ease.' },
  { value: 'FITTED', label: 'Fitted', desc: 'Sculpted, precise, confident.' },
  { value: 'STATEMENT', label: 'Statement', desc: 'Voluminous, sculptural, striking.' },
];

const QUESTIONS = ["What's the occasion?", "What's your mood?", "What's your preferred silhouette?"];

// mapProduct: styleQuizService already returns a flat shape; ProductCard
// needs { id, name, category, price, tag, variants: [{id,type,value,image}] }
const toCardProduct = (p) => ({
  id: p.id,
  name: p.name,
  category: '',
  price: p.price,
  compareAt: p.compareAt,
  tag: p.compareAt ? 'Sale' : null,
  variants: [{ id: p.id, colorName: 'Default', type: 'color', value: '#E5E5E5', image: p.image }],
});

export default function StyleQuiz({ initialOccasion = null }) {
  const [step, setStep] = useState(initialOccasion ? 1 : 0);
  const [answers, setAnswers] = useState({ occasion: initialOccasion, mood: null, silhouette: null });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const choose = async (key, value) => {
    const next = { ...answers, [key]: value };
    setAnswers(next);

    if (key === 'silhouette') {
      setLoading(true);
      setStep(3);
      try {
        const { data } = await axios.get('/api/style-quiz', { params: next });
        setResults(data.products || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    } else {
      setStep((s) => s + 1);
    }
  };

  const goBack = () => setStep((s) => Math.max(0, s - 1));
  const startOver = () => {
    setAnswers({ occasion: null, mood: null, silhouette: null });
    setResults(null);
    setStep(0);
  };

  const occasionLabel = OCCASIONS.find((o) => o.value === answers.occasion)?.title || '';

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-6">
      <div className="max-w-[1000px] mx-auto">
        {/* Progress */}
        {step < 3 && (
          <div className="flex items-center justify-center gap-3 mb-16">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-[2px] w-10 transition-colors duration-500 ${i <= step ? 'bg-accent' : 'bg-border'}`}
              />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 0 — Occasion */}
          {step === 0 && (
            <motion.div key="step-0" variants={stepVariants} initial="enter" animate="center" exit="exit">
              <h1 className="font-serif text-4xl md:text-5xl text-center mb-14">{QUESTIONS[0]}</h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {OCCASIONS.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => choose('occasion', o.value)}
                    className="group relative h-52 md:h-64 overflow-hidden"
                  >
                    <img
                      src={o.image}
                      alt={o.title}
                      className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors" />
                    <span className="absolute inset-0 flex items-center justify-center text-white font-serif text-lg md:text-xl text-center px-2">
                      {o.title}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 1 — Mood */}
          {step === 1 && (
            <motion.div key="step-1" variants={stepVariants} initial="enter" animate="center" exit="exit">
              <h1 className="font-serif text-4xl md:text-5xl text-center mb-14">{QUESTIONS[1]}</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {MOODS.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => choose('mood', m.value)}
                    className="group text-left p-8 border border-border hover:border-primary transition-colors"
                  >
                    <span className="block font-serif text-2xl mb-2 group-hover:text-accent transition-colors">
                      {m.label}
                    </span>
                    <span className="block text-sm text-muted">{m.desc}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2 — Silhouette */}
          {step === 2 && (
            <motion.div key="step-2" variants={stepVariants} initial="enter" animate="center" exit="exit">
              <h1 className="font-serif text-4xl md:text-5xl text-center mb-14">{QUESTIONS[2]}</h1>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                {SILHOUETTES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => choose('silhouette', s.value)}
                    className="group text-left p-8 border border-border hover:border-primary transition-colors"
                  >
                    <span className="block font-serif text-2xl mb-2 group-hover:text-accent transition-colors">
                      {s.label}
                    </span>
                    <span className="block text-sm text-muted">{s.desc}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3 — Results */}
          {step === 3 && (
            <motion.div key="step-3" variants={stepVariants} initial="enter" animate="center">
              {loading ? (
                <div className="flex flex-col items-center py-32 text-muted">
                  <Loader2 className="animate-spin mb-4" size={28} />
                  <p className="font-serif text-sm tracking-[0.2em] uppercase">Curating Your Edit</p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-14">
                    <span className="block text-[10px] tracking-[0.3em] uppercase mb-4 text-accent">
                      {occasionLabel}
                    </span>
                    <h1 className="font-serif text-4xl md:text-5xl italic mb-4">Your edit is ready.</h1>
                    <button
                      onClick={startOver}
                      className="text-xs uppercase tracking-widest text-muted hover:text-black underline decoration-dotted transition-colors"
                    >
                      Start Over
                    </button>
                  </div>

                  {results && results.length > 0 ? (
                    <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
                      {results.map((p) => (
                        <ProductCard key={p.id} product={toCardProduct(p)} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 text-muted">
                      <p className="font-serif text-xl text-black mb-4">Nothing matched yet — but the collection grows weekly.</p>
                      <Link href="/shop/ready-to-wear" className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-accent hover:border-accent transition-colors">
                        Browse Everything
                      </Link>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {step > 0 && step < 3 && (
          <button
            onClick={goBack}
            className="mt-16 mx-auto flex items-center gap-2 text-xs uppercase tracking-widest text-muted hover:text-black transition-colors"
          >
            <ArrowLeft size={14} /> Back
          </button>
        )}
      </div>
    </div>
  );
}
