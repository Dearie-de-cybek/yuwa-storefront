import { useState } from 'react';
import ProductCard from '../../components/product/ProductCard';
import { Filter, ChevronDown } from 'lucide-react';

// --- MOCK DATA for now till we start using photos from backend---
const PRODUCTS = [
  {
    id: 1,
    name: "The Zaria Silk Bubu",
    category: "Luxury Bubu",
    price: 180,
    tag: "Best Seller",
    variants: [
      { 
        id: 'v1', 
        colorName: "Emerald", 
        type: 'color', 
        value: '#046c4e', 
        image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=1000&auto=format&fit=crop',
        hoverImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop'
      },
      { 
        id: 'v2', 
        colorName: "Clay", 
        type: 'color', 
        value: '#C15B28', 
        image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop' 
      }
    ]
  },
  {
    id: 2,
    name: "Lagos City Midi",
    category: "Ready-to-Wear",
    price: 120,
    tag: "New",
    variants: [
      { 
        id: 'v1', 
        colorName: "Ankara Print", 
        type: 'pattern', 
        swatchImage: 'https://images.unsplash.com/photo-1605763240004-7e93b172d754?q=80&w=100&auto=format&fit=crop', 
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop',
        hoverImage: 'https://images.unsplash.com/photo-1572804013427-4d7ca2736179?q=80&w=1000&auto=format&fit=crop'
      },
      { 
        id: 'v2', 
        colorName: "Noir", 
        type: 'color', 
        value: '#000000', 
        image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1000&auto=format&fit=crop' 
      }
    ]
  },
  {
    id: 3,
    name: "Adire Wrap Set",
    category: "Co-ords",
    price: 155,
    tag: null,
    variants: [
      { 
        id: 'v1', 
        colorName: "Indigo", 
        type: 'color', 
        value: '#4B0082', 
        image: 'https://images.unsplash.com/photo-1589451397839-49774a3838dc?q=80&w=1000&auto=format&fit=crop' 
      }
    ]
  }
];

export default function Shop() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-6 bg-white">
      
      {/* 1. HEADER & FILTERS (Zara Style - Minimal Top Bar) */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-12 max-w-[1440px] mx-auto border-b border-border pb-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif mb-2">Ready to Wear</h1>
          <p className="text-muted text-sm">Everyday luxury for the modern woman.</p>
        </div>

        <div className="flex gap-6 mt-6 md:mt-0">
          <button className="flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors">
            FILTER <Filter size={16} />
          </button>
          <button className="flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors">
            SORT BY <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {/* 2. THE GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 max-w-[1440px] mx-auto">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* 3. LOAD MORE */}
      <div className="mt-20 text-center">
        <button className="border border-primary px-10 py-3 text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-300">
          Load More
        </button>
      </div>

    </div>
  );
}