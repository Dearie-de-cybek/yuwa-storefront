'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

// Compact "Wear It With" block, embedded in the PDP sidebar under the
// accordions (not a full-width section below the fold). Shows the real
// shoppable accessories from the product's Look; falls back to the
// admin-curated text list only when no Look exists yet.
// Only 2 shown at a time — matches the reference layout. Jewellery + shoes
// first since that's the pairing customers see most often; bag/headwrap
// fill in when a look has no jewellery or shoes item.
const SLOT_PRIORITY = ['JEWELLERY', 'SHOES', 'BAG', 'HEADWRAP', 'OTHER'];
const MAX_ITEMS = 2;

export default function HowToWearIt({ productId, styleWith = [] }) {
  const [accessories, setAccessories] = useState([]);

  useEffect(() => {
    if (!productId) return;
    let active = true;
    (async () => {
      try {
        const { data } = await axios.get(`/api/products/${productId}/looks`);
        const look = data.looks?.[0];
        const items = (look?.items || [])
          .filter((i) => i.slot !== 'DRESS')
          .sort((a, b) => SLOT_PRIORITY.indexOf(a.slot) - SLOT_PRIORITY.indexOf(b.slot))
          .slice(0, MAX_ITEMS);
        if (active) setAccessories(items);
      } catch {
        if (active) setAccessories([]);
      }
    })();
    return () => { active = false; };
  }, [productId]);

  const hasAccessories = accessories.length > 0;
  const hasStyleWith = styleWith.length > 0;

  if (!hasAccessories && !hasStyleWith) return null;

  return (
    <div className="pt-8 border-t border-gray-200">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-5 text-center">
        Wear It With
      </h3>

      {hasAccessories ? (
        <div className="grid grid-cols-2 gap-6">
          {accessories.map((item) => (
            <Link key={item.product.id} href={`/product/${item.product.id}`} className="group text-center">
              <div className="aspect-[3/4] bg-gray-50 overflow-hidden mb-3">
                {item.product.image && (
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <p className="text-xs uppercase tracking-wide group-hover:text-amber-700 transition-colors truncate">
                {item.product.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">₦{item.product.price.toLocaleString()}</p>
            </Link>
          ))}
        </div>
      ) : (
        <ul className="space-y-3">
          {styleWith.map((s, i) => (
            <li key={i} className="text-sm font-serif italic text-gray-600 text-center">
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
