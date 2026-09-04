'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowRight, Plus } from 'lucide-react';
import { useStore } from '../../store/useStore';

const luxuryEase = [0.16, 1, 0.3, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: luxuryEase } },
};

const SLOT_LABEL = {
  DRESS: 'Bubu',
  HEADWRAP: 'Headwrap',
  BAG: 'Bag',
  JEWELLERY: 'Jewellery',
  SHOES: 'Shoes',
  OTHER: 'Piece',
};

export default function CompleteTheLook({ productId }) {
  const { addToCart } = useStore();
  const [look, setLook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;
    let active = true;
    (async () => {
      try {
        const { data } = await axios.get(`/api/products/${productId}/looks`);
        if (active) setLook(data.looks?.[0] || null);
      } catch {
        if (active) setLook(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [productId]);

  if (loading || !look) return null;

  const shopTheLook = () => {
    const shoppable = look.items.filter((i) => i.defaultVariant?.inStock);
    if (shoppable.length === 0) {
      toast.error('These pieces are currently out of stock.');
      return;
    }

    shoppable.forEach((item) => {
      addToCart(
        { id: item.product.id, name: item.product.name, price: item.product.price },
        {
          id: item.defaultVariant.id,
          color: item.defaultVariant.color,
          size: item.defaultVariant.size,
          image: item.product.image,
        }
      );
    });

    toast.success('The look is in your bag', {
      description: `${shoppable.length} piece${shoppable.length !== 1 ? 's' : ''} added.`,
    });
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={fadeUp}
      className="py-16 md:py-20 border-t border-border"
    >
      <div className="max-w-[1000px] mx-auto px-6">
        <h2 className="font-serif text-3xl mb-8 text-center">Complete The Look</h2>

        {/* Compact slot chain: circular thumbnail + label, joined by "+" */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5 mb-14">
          {look.items.map((item, idx) => (
            <div key={item.product.id} className="flex items-center gap-3 md:gap-5">
              {idx > 0 && <Plus size={16} className="text-muted shrink-0" />}
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden bg-secondary border border-border">
                  {item.product.image && (
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <span className="text-[10px] uppercase tracking-widest text-muted">
                  {SLOT_LABEL[item.slot] || item.slot}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Itemized breakdown */}
        <div className="bg-secondary/40 border border-border p-6 md:p-10">
          <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-muted mb-6">
            The Look — {look.name}
          </span>

          <div className="space-y-4 mb-8">
            {look.items.map((item) => (
              <Link
                key={item.product.id}
                href={`/product/${item.product.id}`}
                className="flex items-center gap-4 group"
              >
                <div className="w-14 h-16 shrink-0 overflow-hidden bg-white border border-border">
                  {item.product.image && (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-serif group-hover:text-accent transition-colors truncate">
                    {item.product.name}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-muted">
                    {SLOT_LABEL[item.slot] || item.slot}
                  </p>
                </div>
                <span className="text-sm font-medium shrink-0">₦{item.product.price.toLocaleString()}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-border">
            <div>
              <span className="block text-[10px] uppercase tracking-widest text-muted mb-1">Complete Look</span>
              <span className="font-serif italic text-xl">₦{look.total.toLocaleString()}</span>
            </div>
            <button
              onClick={shopTheLook}
              className="group inline-flex items-center gap-3 bg-primary text-white px-6 py-3 md:px-8 md:py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-accent transition-colors"
            >
              Shop The Look
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
