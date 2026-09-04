'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const luxuryEase = [0.16, 1, 0.3, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.4, ease: luxuryEase } },
};

export default function OurStory({ story }) {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-[#FAF9F6]">
      {/* =========================================
          1. HERO
      ========================================= */}
      <section className="relative w-full min-h-[85vh] flex flex-col justify-end px-6 md:px-12 pb-16 pt-40 max-w-[1600px] mx-auto">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <img
            src={story.heroImage}
            alt={story.heroTitle}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] via-black/10 to-black/30" />
        </div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-2xl">
          <span className="block text-[10px] tracking-[0.3em] uppercase mb-8 text-white/90">
            {story.heroEyebrow}
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-[6rem] leading-[0.95] tracking-tight mb-2 text-white drop-shadow-sm">
            {story.heroTitle}
          </h1>
          <h1 className="font-serif italic font-light text-4xl md:text-6xl lg:text-[5rem] leading-[0.95] tracking-tight mb-8 text-white/90 drop-shadow-sm">
            {story.heroAccent}
          </h1>
          <p className="text-base md:text-lg font-light leading-relaxed max-w-md text-white/90">
            {story.heroBody}
          </p>
        </motion.div>
      </section>

      {/* =========================================
          2. THE JOURNEY — Nigeria → Australia split
      ========================================= */}
      <section className="py-24 md:py-32 px-6 md:px-12 max-w-[1600px] mx-auto">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp}
          className="text-center mb-16"
        >
          <span className="block text-[10px] tracking-[0.3em] uppercase mb-6 text-[#8C6D46]">The Journey</span>
          <h2 className="font-serif text-4xl md:text-6xl mb-6">{story.journeyTitle}</h2>
          <p className="font-serif italic text-lg md:text-2xl text-[#555] max-w-xl mx-auto">{story.journeyBody}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 md:gap-6 items-center">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={fadeUp}
            className="relative h-[55vh] md:h-[65vh] overflow-hidden group"
          >
            <img
              src={story.journeyFromImage}
              alt={story.journeyFromLabel}
              className="w-full h-full object-cover object-top transition-transform duration-[2000ms] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20" />
            <span className="absolute bottom-6 left-6 text-white font-serif text-2xl md:text-3xl italic drop-shadow">
              {story.journeyFromLabel}
            </span>
          </motion.div>

          <div className="hidden md:flex items-center justify-center">
            <ArrowRight size={32} className="text-[#8C6D46]" />
          </div>
          <div className="flex md:hidden justify-center">
            <ArrowRight size={24} className="text-[#8C6D46] rotate-90" />
          </div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={fadeUp}
            transition={{ delay: 0.15, duration: 1.2, ease: luxuryEase }}
            className="relative h-[55vh] md:h-[65vh] overflow-hidden group"
          >
            <img
              src={story.journeyToImage}
              alt={story.journeyToLabel}
              className="w-full h-full object-cover object-top transition-transform duration-[2000ms] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20" />
            <span className="absolute bottom-6 left-6 text-white font-serif text-2xl md:text-3xl italic drop-shadow">
              {story.journeyToLabel}
            </span>
          </motion.div>
        </div>
      </section>

      {/* =========================================
          3. THE DESIGNER
      ========================================= */}
      <section className="py-24 md:py-32 px-6 md:px-12 max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-center">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp}
          className="md:col-span-5 relative h-[60vh] md:h-[75vh] overflow-hidden"
        >
          <img src={story.designerImage} alt={story.designerName} className="w-full h-full object-cover object-top" />
        </motion.div>

        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp}
          transition={{ delay: 0.15, duration: 1.2, ease: luxuryEase }}
          className="md:col-span-6 md:col-start-7"
        >
          <span className="block text-[10px] tracking-[0.3em] uppercase mb-6 text-[#8C6D46]">
            {story.designerTitle}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl mb-8">{story.designerName}</h2>
          <p className="text-base md:text-lg leading-relaxed text-[#444] max-w-lg">{story.designerBio}</p>
        </motion.div>
      </section>

      {/* =========================================
          4. SOURCING
      ========================================= */}
      <section className="relative py-32 md:py-48 px-6 md:px-12 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={story.sourcingImage} alt={story.sourcingTitle} className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-black/55" />
        </div>

        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp}
          className="max-w-2xl mx-auto text-center relative z-10"
        >
          <span className="block text-[10px] tracking-[0.3em] uppercase mb-6 text-white/70">Sourcing</span>
          <h2 className="font-serif text-4xl md:text-6xl text-white mb-8">{story.sourcingTitle}</h2>
          <p className="text-base md:text-lg leading-relaxed text-white/85">{story.sourcingBody}</p>
        </motion.div>
      </section>

      {/* =========================================
          5. CLOSING QUOTE
      ========================================= */}
      <section className="bg-[#1A1918] text-[#FBF9F5] py-32 md:py-48 px-6 md:px-12 text-center relative overflow-hidden">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp}
          className="max-w-3xl mx-auto relative z-10"
        >
          <div className="w-[1px] h-16 bg-[#8B5E34] mx-auto mb-12" />
          <h2 className="font-serif text-3xl md:text-5xl leading-relaxed mb-10 italic">&ldquo;{story.quote}&rdquo;</h2>
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#8B5E34]">{story.quoteAuthor}</span>

          <div className="mt-16">
            <Link
              href="/shop/ready-to-wear"
              className="group inline-flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.2em] border-b border-[#FAF9F6] pb-1 hover:text-[#B8860B] hover:border-[#B8860B] transition-colors duration-500"
            >
              Shop The Collection
              <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-500 ease-out" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
