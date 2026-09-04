'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, Search, User, Bookmark, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import SearchOverlay from './SearchOverlay';
import { HIDE_AT } from './AnnouncementBar';

// ── Mega menu content ──────────────────────────────────────────────
const SHOP_MEGA = {
  columns: [
    {
      heading: 'Collections',
      links: [
        { title: 'Ready-to-Wear', path: '/shop/ready-to-wear' },
        { title: 'Bùbús', path: '/shop/bubus' },
      ],
    },
    {
      heading: 'Shop by Occasion',
      links: [
        { title: 'Wedding', path: '/occasion/wedding' },
        { title: 'Prom', path: '/occasion/prom' },
        { title: 'Dinner & Events', path: '/occasion/dinner' },
        { title: 'Everyday Elegance', path: '/occasion/everyday' },
      ],
    },
  ],
  tiles: [
    { image: '/models/1.jpg', label: 'Shop All Ready-to-Wear', path: '/shop/ready-to-wear' },
    { image: '/images/wedding-guest.jpg', label: 'Shop by Occasion', path: '/occasion' },
  ],
};

const CUSTOM_MEGA = {
  columns: [
    {
      heading: 'Bespoke Tailoring',
      links: [
        { title: 'Prom', path: '/custom/prom' },
        { title: 'Wedding Guest', path: '/custom/wedding' },
        { title: 'Dinner & Events', path: '/custom/dinner' },
      ],
    },
  ],
  tiles: [
    { image: '/images/atelier-fabric.jpg', label: 'Book a Consultation', path: '/custom/book' },
    { image: '/images/tailor.jpg', label: 'Meet the Atelier', path: '/custom' },
  ],
};

const navStructure = [
  { title: 'Shop', mega: SHOP_MEGA },
  { title: 'Custom Creations', path: '/custom', isSpecial: true, mega: CUSTOM_MEGA },
  { title: 'Journal', path: '/journal' },
];

const luxuryEase = [0.16, 1, 0.3, 1];

// ── Full-width mega panel content (desktop) ────────────────────────
// Rendered once, as a direct child of <nav> (which is fixed inset-x-0 —
// the actual full-width positioning context). Do NOT nest this inside a
// per-item wrapper: a narrow positioned ancestor there would hijack the
// containing block and collapse the panel's width down to that item.
function MegaPanelContent({ mega }) {
  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-12 grid grid-cols-12 gap-10">
      {/* Text columns */}
      <div className="col-span-12 md:col-span-5 grid grid-cols-2 gap-8">
        {mega.columns.map((col) => (
          <div key={col.heading}>
            <span className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-5">
              {col.heading}
            </span>
            <div className="flex flex-col space-y-4">
              {col.links.map((l) => (
                <Link key={l.path} href={l.path} className="text-sm text-primary hover:text-accent transition-colors">
                  {l.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Image tiles */}
      <div className="col-span-12 md:col-span-7 grid grid-cols-2 gap-6">
        {mega.tiles.map((t) => (
          <Link key={t.path} href={t.path} className="group/tile block">
            <div className="aspect-[4/5] overflow-hidden bg-secondary mb-3">
              <img
                src={t.image}
                alt={t.label}
                className="w-full h-full object-cover transition-transform duration-[1500ms] ease-out group-hover/tile:scale-105"
              />
            </div>
            <span className="block text-center text-[10px] uppercase tracking-widest font-bold text-primary group-hover/tile:text-accent transition-colors">
              {t.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const pathname = usePathname();
  const { toggleCartDrawer, cart } = useStore();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Avoid SSR/client hydration mismatch for the persisted cart badge.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    // Same threshold as AnnouncementBar — the two snap together with no gap.
    const handleScroll = () => setScrolled(window.scrollY > HIDE_AT);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setIsOpen(false), [pathname]);

  const toggleSubmenu = (index) => {
    setActiveSubmenu(activeSubmenu === index ? null : index);
  };

  return (
    <>
      <nav
        onMouseLeave={() => setHoveredIndex(null)}
        className={`fixed inset-x-0 z-50 transition-all duration-500 ease-out
        ${scrolled || isOpen ? 'top-0 bg-secondary/95 backdrop-blur-md border-b border-border py-4' : 'top-9 bg-transparent py-6'}`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 flex items-center justify-between">

          {/* LEFT — Logo */}
          <Link href="/" className="shrink-0">
            <h1 className="font-serif text-2xl md:text-3xl tracking-tight font-medium text-primary">
              YUWA
            </h1>
          </Link>

          {/* CENTER-LEFT — Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8 ml-12">
            {navStructure.map((item, idx) => {
              const label = (
                <>
                  {item.title}
                  {item.mega && (
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-300 ${hoveredIndex === idx ? 'rotate-180' : ''}`}
                    />
                  )}
                </>
              );
              const linkClass = `flex items-center gap-1 text-[13px] uppercase tracking-widest font-medium hover:text-accent transition-colors ${
                item.isSpecial ? 'text-accent' : 'text-primary'
              }`;

              return (
                <div key={idx} className="h-full flex items-center py-2" onMouseEnter={() => setHoveredIndex(idx)}>
                  {item.path ? (
                    <Link href={item.path} className={linkClass}>{label}</Link>
                  ) : (
                    <span className={`${linkClass} cursor-default`}>{label}</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Spacer pushes utilities right */}
          <div className="hidden lg:block flex-1" />

          {/* MOBILE LEFT - Hamburger */}
          <button onClick={() => setIsOpen(true)} className="lg:hidden text-primary">
            <Menu strokeWidth={1.5} size={26} />
          </button>

          {/* RIGHT - Utilities */}
          <div className="flex items-center space-x-5 md:space-x-6 text-primary">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:block hover:text-accent transition-colors"
            >
              <Search strokeWidth={1.5} size={20} />
            </button>
            <Link href="/account" className="hidden md:block hover:text-accent transition-colors">
              <Bookmark strokeWidth={1.5} size={20} />
            </Link>
            <Link href="/account" className="hidden md:block hover:text-accent transition-colors">
              <User strokeWidth={1.5} size={20} />
            </Link>
            <button
              onClick={toggleCartDrawer}
              className="relative hover:text-accent transition-colors"
            >
              <ShoppingBag strokeWidth={1.5} size={20} />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-accent text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Shared mega panel — one instance, positioned against <nav> itself
            so it always spans the full nav width regardless of which item
            triggered it. */}
        <AnimatePresence>
          {hoveredIndex !== null && navStructure[hoveredIndex]?.mega && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: luxuryEase }}
              className="absolute top-full left-0 w-full bg-white border-t border-border shadow-xl"
            >
              <MegaPanelContent mega={navStructure[hoveredIndex].mega} />
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* MOBILE MENU DRAWER (Editorial Style) */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "tween", duration: 0.4, ease: "circOut" }}
              className="fixed top-0 left-0 h-full w-[85%] max-w-md bg-secondary z-[70] p-8 overflow-y-auto border-r border-border"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="font-serif text-2xl">Menu</span>
                <button onClick={() => setIsOpen(false)}>
                  <X strokeWidth={1.5} size={28} />
                </button>
              </div>

              <div className="flex flex-col space-y-6">
                {navStructure.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center">
                      {item.path ? (
                        <Link
                          href={item.path}
                          className={`text-2xl font-serif ${item.isSpecial ? 'text-accent' : 'text-primary'}`}
                          onClick={() => !item.mega && setIsOpen(false)}
                        >
                          {item.title}
                        </Link>
                      ) : (
                        <button
                          onClick={() => toggleSubmenu(idx)}
                          className="text-2xl font-serif text-primary text-left"
                        >
                          {item.title}
                        </button>
                      )}
                      {item.mega && (
                        <button onClick={() => toggleSubmenu(idx)} className="p-2">
                          <ChevronDown
                            size={20}
                            className={`transition-transform duration-300 ${activeSubmenu === idx ? 'rotate-180 text-accent' : ''}`}
                          />
                        </button>
                      )}
                    </div>

                    <AnimatePresence>
                      {item.mega && activeSubmenu === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col space-y-6 pl-4 mt-4 border-l border-border">
                            {item.mega.columns.map((col) => (
                              <div key={col.heading}>
                                <span className="block text-[10px] uppercase tracking-widest text-muted mb-3">
                                  {col.heading}
                                </span>
                                <div className="flex flex-col space-y-3">
                                  {col.links.map((l) => (
                                    <Link
                                      key={l.path}
                                      href={l.path}
                                      onClick={() => setIsOpen(false)}
                                      className="text-muted text-lg hover:text-accent font-serif italic"
                                    >
                                      {l.title}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

              <div className="mt-16 pt-8 border-t border-border">
                <Link href="/account" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 text-primary mb-4">
                  <User size={20} />
                  <span className="font-medium uppercase tracking-widest text-xs">My Account</span>
                </Link>
                <div className="text-xs uppercase tracking-widest text-muted">
                  <p>Currency: NGN</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
