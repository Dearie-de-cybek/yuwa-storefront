'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

// Small palette so swatches get a sensible colour (mirrors the Shop mapping).
const COLOR_HEX = {
  emerald: '#50C878', indigo: '#3F51B5', gold: '#D4A017', ivory: '#FFFFF0',
  burgundy: '#800020', 'royal blue': '#4169E1', coral: '#FF7F50',
  champagne: '#F7E7CE', black: '#1A1A1A', white: '#FFFFFF', teal: '#008080', plum: '#8E4585',
};
const hex = (name) => COLOR_HEX[name?.toLowerCase()] || '#E5E5E5';

// Map an API product into the shape ProductCard expects.
const mapProduct = (p) => {
  const raw = p.variants || [];
  const colors = [...new Set(raw.map((v) => v.color).filter(Boolean))];
  let variants = colors.map((color) => {
    const v = raw.find((x) => x.color === color);
    return { id: v?.id || color, colorName: color, type: 'color', value: hex(color), image: p.image };
  });
  if (variants.length === 0) {
    variants = [{ id: 'default', colorName: 'Default', type: 'color', value: '#E5E5E5', image: p.image }];
  }
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category?.name || '',
    price: p.price,
    compareAt: p.compareAt,
    tag: p.featured ? 'Featured' : p.compareAt ? 'Sale' : null,
    variants,
    image: p.image,
  };
};

export default function RelatedProducts({ currentId, category }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const params = { status: 'ACTIVE', limit: 8 };
        if (category) params.search = category;
        const { data } = await axios.get('/api/products', { params });
        if (!active) return;
        const list = (data.products || [])
          .filter((p) => p.id !== currentId)
          .slice(0, 4)
          .map(mapProduct);
        setProducts(list);
      } catch {
        if (active) setProducts([]);
      }
    })();
    return () => { active = false; };
  }, [currentId, category]);

  if (products.length === 0) return null;

  return (
    <section className="py-20 px-6 max-w-360 mx-auto border-t border-border">
      <h3 className="font-serif text-3xl mb-12 text-center">Complete The Look</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
