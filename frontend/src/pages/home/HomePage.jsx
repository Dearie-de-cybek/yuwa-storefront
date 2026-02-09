import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import aboutImage from '../../assets/images/about.jpg';

// Re-use the Product Card for "The Edit" section
import ProductCard from '../../components/product/ProductCard';

// Mock Data for "The Edit"
const FEATURED_PRODUCTS = [
  {
    id: 1,
    name: "The Zaria Silk Bubu",
    category: "Luxury Bubu",
    price: 180,
    tag: "Best Seller",
    variants: [{ id: 'v1', colorName: "Emerald", type: 'color', value: '#046c4e', image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=1000&auto=format&fit=crop' }]
  },
  {
    id: 2,
    name: "Lagos City Midi",
    category: "Ready-to-Wear",
    price: 120,
    tag: "New",
    variants: [{ id: 'v1', colorName: "Ankara Print", type: 'pattern', swatchImage: '', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop' }]
  },
  {
    id: 4,
    name: "Othello Maxi",
    category: "Luxury Bubu",
    price: 210,
    tag: "Limited",
    variants: [{ id: 'v1', colorName: "Gold", type: 'color', value: '#D4AF37', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000' }]
  }
];

const SectionHeader = ({ title, subtitle }) => (
  <div className="flex justify-between items-end mb-12 px-6 max-w-[1440px] mx-auto">
    <div>
      <h2 className="text-3xl md:text-5xl font-serif mb-2">{title}</h2>
      <p className="text-muted text-sm uppercase tracking-widest">{subtitle}</p>
    </div>
    <Link to="/shop/ready-to-wear" className="hidden md:flex items-center gap-2 text-xs uppercase tracking-widest hover:text-accent transition-colors">
      View All <ArrowRight size={14} />
    </Link>
  </div>
);

export default function HomePage() {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: scrollRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]); // Parallax effect

  return (
    <div className="bg-secondary min-h-screen">
      
      {/* 1. HERO SECTION (Full Screen) */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background Image/Video */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2864&auto=format&fit=crop" 
            alt="YUWA Hero" 
            className="w-full h-full object-cover object-top brightness-75"
          />
        </div>
        
        {/* Overlay Text */}
        <div className="absolute inset-0 flex flex-col justify-end pb-32 px-6 md:px-12 max-w-[1440px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-white max-w-2xl"
          >
            <span className="block text-sm md:text-base uppercase tracking-[0.3em] mb-4 text-white/80">The New Heritage</span>
            <h1 className="text-5xl md:text-8xl font-serif mb-8 leading-tight">
              Modern African <br/> <i className="font-serif text-accent">Luxury</i>
            </h1>
            <div className="flex flex-col md:flex-row gap-4">
              <Link 
                to="/shop/ready-to-wear" 
                className="px-8 py-4 bg-white text-primary uppercase tracking-widest text-xs hover:bg-accent hover:text-white transition-colors text-center"
              >
                Shop Collection
              </Link>
              <Link 
                to="/custom" 
                className="px-8 py-4 border border-white text-white uppercase tracking-widest text-xs hover:bg-white hover:text-primary transition-colors text-center"
              >
                Custom Design
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. TICKER TAPE (Marquee) */}
      <div className="bg-primary text-white py-4 overflow-hidden whitespace-nowrap border-b border-white/10">
        <div className="animate-marquee inline-block">
          <span className="mx-8 text-xs uppercase tracking-[0.2em]">Lagos • London • New York • Sydney</span>
          <span className="mx-8 text-xs uppercase tracking-[0.2em]">Free Express Shipping on Orders Over $250</span>
          <span className="mx-8 text-xs uppercase tracking-[0.2em]">New Collection: "Omo Ghetto" Drop 1</span>
          <span className="mx-8 text-xs uppercase tracking-[0.2em]">Lagos • London • New York • Sydney</span>
        </div>
      </div>

      {/* 3. CATEGORIES GRID */}
      <section className="py-24 px-6 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[800px] md:h-[600px]">
          
          {/* Big Item 1 */}
          <Link to="/shop/bubus" className="relative group overflow-hidden h-full">
            <img 
              src="https://unsplash.com/photos/woman-in-ornate-blue-dress-and-headwrap-p5ewDl5mVWc?q=80&w=1000&auto=format&fit=crop" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-3xl font-serif italic mb-2">The Bubu Edit</h3>
              <span className="text-xs uppercase tracking-widest border-b border-white pb-1">Explore</span>
            </div>
          </Link>

          {/* Stacked Items */}
          <div className="flex flex-col gap-4 h-full">
            <Link to="/custom" className="relative group overflow-hidden h-1/2 flex-1">
              <img 
                src="https://images.unsplash.com/photo-1560709493-27fef01e913b?q=80&w=1000&auto=format&fit=crop" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-3xl font-serif italic mb-2">Custom & Bridal</h3>
                <span className="text-xs uppercase tracking-widest border-b border-white pb-1">Book Consultation</span>
              </div>
            </Link>
            
            <Link to="/shop/ready-to-wear" className="relative group overflow-hidden h-1/2 flex-1">
              <img 
                src="https://images.unsplash.com/photo-1589451397839-49774a3838dc?q=80&w=1000&auto=format&fit=crop" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-3xl font-serif italic mb-2">Ready to Wear</h3>
                <span className="text-xs uppercase tracking-widest border-b border-white pb-1">Shop Now</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. THE EDIT (Horizontal Scroll) */}
      <section className="py-20 bg-white">
        <SectionHeader title="The Weekend Edit" subtitle="Curated for the diaspora" />
        
        <div className="overflow-x-auto no-scrollbar px-6">
          <div className="flex gap-6 w-max max-w-[1440px] mx-auto pb-8">
            {FEATURED_PRODUCTS.map(product => (
              <div key={product.id} className="w-[300px] md:w-[350px]">
                <ProductCard product={product} />
              </div>
            ))}
             {/* "View All" Card */}
             <Link to="/shop/ready-to-wear" className="w-[300px] md:w-[350px] bg-secondary flex flex-col items-center justify-center gap-4 group hover:bg-primary transition-colors duration-500">
               <div className="w-16 h-16 rounded-full border border-primary group-hover:border-white flex items-center justify-center">
                 <ArrowRight size={24} className="text-primary group-hover:text-white" />
               </div>
               <span className="font-serif text-xl group-hover:text-white">View All Products</span>
             </Link>
          </div>
        </div>
      </section>

      {/* 5. BRAND STORY (Parallax) */}
      <section ref={scrollRef} className="py-32 px-6 max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center overflow-hidden">
        <div className="order-2 md:order-1">
          <span className="text-accent text-xs uppercase tracking-[0.2em] mb-6 block">Our Ethos</span>
          <h2 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">
            Designed in Lagos. <br/> Worn Worldwide.
          </h2>
          <p className="text-lg text-muted leading-relaxed mb-8">
            YUWA bridges the gap between traditional African aesthetics and modern global fashion. 
            We source our silks from the markets of Kano and hand-dye our fabrics in Abeokuta, 
            creating pieces that tell a story of heritage, luxury, and pride.
          </p>
          <Link to="/about" className="inline-flex items-center gap-2 text-primary border-b border-primary pb-1 uppercase tracking-widest text-xs hover:text-accent hover:border-accent transition-colors">
            Read Our Story <ArrowUpRight size={14} />
          </Link>
        </div>
        
        <div className="relative order-1 md:order-2 h-[600px] bg-gray-200 overflow-hidden">
          <motion.img 
            style={{ y }}
             src={aboutImage}
            className="w-full h-[120%] object-cover"
            alt="About YUWA"
          />
        </div>
      </section>

    </div>
  );
}