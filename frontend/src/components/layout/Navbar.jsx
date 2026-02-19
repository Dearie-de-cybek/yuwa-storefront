import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, User, ChevronDown, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import SearchOverlay from './SearchOverlay';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const location = useLocation();
  const { toggleCartDrawer, cart } = useStore();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location]);

  const toggleSubmenu = (index) => {
    setActiveSubmenu(activeSubmenu === index ? null : index);
  };

  const navStructure = [
    { title: 'Ready-to-Wear', path: '/shop/ready-to-wear' },
    { title: 'Bùbús', path: '/shop/bubus' },
    { 
      title: 'Custom Creations', 
      path: '/custom',
      isSpecial: true,
      children: [
        { title: 'Prom', path: '/custom/prom', desc: 'Own the night' },
        { title: 'Wedding Guest', path: '/custom/wedding', desc: 'Elegant & unforgettable' },
        { title: 'Dinner & Events', path: '/custom/dinner', desc: 'Command the room' }
      ]
    },
    { title: 'Journal', path: '/journal' } 
  ];

  return (
    <>
      <nav 
        className={`fixed w-full z-50 transition-all duration-500 ease-out 
        ${scrolled || isOpen ? 'bg-secondary/95 backdrop-blur-md border-b border-border py-4' : 'bg-transparent py-6'}`}
      >
        <div className="max-w-[1440px] mx-auto px-6 flex items-center justify-between">
          
          {/* DESKTOP LEFT - Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navStructure.map((item, idx) => (
              <div key={idx} className="relative group">
                <Link 
                  to={item.path} 
                  className={`flex items-center gap-1 text-sm uppercase tracking-widest font-medium hover:text-accent transition-colors
                    ${item.isSpecial ? 'text-accent' : 'text-primary'}`}
                >
                  {item.title}
                  {/* Dropdown Indicator Arrow */}
                  {item.children && (
                    <ChevronDown size={14} className="transition-transform duration-300 group-hover:rotate-180" />
                  )}
                </Link>
                
                {/* 💎 LUXURY MEGA MENU FOR DESKTOP */}
                {item.children && (
                  <div className="absolute top-full left-1/2 -translate-x-1/3 pt-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 ease-out z-50">
                    <div className="bg-white border border-gray-100 shadow-2xl w-[650px] flex overflow-hidden">
                       
                       {/* Left Side: Links */}
                       <div className="w-1/2 p-10 flex flex-col justify-center bg-white">
                         <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6 block border-b border-gray-100 pb-3">
                           Bespoke Tailoring
                         </span>
                         
                         <div className="flex flex-col space-y-5">
                           {item.children.map((child, cIdx) => (
                             <Link 
                               key={cIdx} 
                               to={child.path}
                               className="group/link flex items-center justify-between"
                             >
                               <div>
                                 <p className="text-primary group-hover/link:text-accent text-xl font-serif italic transition-colors">
                                   {child.title}
                                 </p>
                                 <p className="text-[10px] uppercase tracking-wider text-gray-400 mt-1 opacity-0 group-hover/link:opacity-100 transition-opacity">
                                   {child.desc}
                                 </p>
                               </div>
                               <ArrowRight size={18} className="text-accent opacity-0 -translate-x-4 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300" />
                             </Link>
                           ))}
                         </div>
                       </div>

                       {/* Right Side: Editorial Image */}
                       <div className="w-1/2 relative bg-gray-100 overflow-hidden">
                          <img 
                            src="https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800" 
                            alt="Custom Atelier" 
                            className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-[2000ms] ease-out"
                          />
                          <div className="absolute inset-0 bg-black/10" /> {/* Subtle overlay */}
                          <div className="absolute bottom-6 left-6 right-6 text-center">
                             <p className="text-white font-serif italic text-lg shadow-sm">Made for moments that matter</p>
                          </div>
                       </div>

                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* MOBILE LEFT - Hamburger */}
          <button onClick={() => setIsOpen(true)} className="lg:hidden text-primary">
            <Menu strokeWidth={1.5} size={28} />
          </button>

          {/* CENTER - Logo */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 z-50">
            <h1 className={`font-serif text-3xl md:text-4xl tracking-tight font-medium transition-colors duration-300 text-primary`}>
              YUWA
            </h1>
          </Link>

          {/* RIGHT - Utilities */}
          <div className="flex items-center space-x-6 text-primary">
           <button 
            onClick={() => setIsSearchOpen(true)} 
            className="hidden md:block hover:text-accent transition-colors"
          >
            <Search strokeWidth={1.5} size={22} />
          </button>
            <Link to="/account" className="hidden md:block hover:text-accent transition-colors">
              <User strokeWidth={1.5} size={22} />
            </Link>
            <button 
            onClick={toggleCartDrawer}
            className="relative hover:text-accent transition-colors">
              <ShoppingBag strokeWidth={1.5} size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-accent text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
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
                      <Link 
                        to={item.path} 
                        className={`text-2xl font-serif ${item.isSpecial ? 'text-accent' : 'text-primary'}`}
                        onClick={() => !item.children && setIsOpen(false)}
                      >
                        {item.title}
                      </Link>
                      {item.children && (
                        <button onClick={() => toggleSubmenu(idx)} className="p-2">
                          <ChevronDown 
                            size={20} 
                            className={`transition-transform duration-300 ${activeSubmenu === idx ? 'rotate-180 text-accent' : ''}`}
                          />
                        </button>
                      )}
                    </div>

                    <AnimatePresence>
                      {item.children && activeSubmenu === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col space-y-4 pl-4 mt-4 border-l border-border">
                            {item.children.map((child, cIdx) => (
                              <Link 
                                key={cIdx} 
                                to={child.path}
                                onClick={() => setIsOpen(false)}
                                className="text-muted text-lg hover:text-accent font-serif italic flex items-center gap-2 group"
                              >
                                {child.title}
                                <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                              </Link>
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
                <Link to="/account" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 text-primary mb-4">
                  <User size={20} />
                  <span className="font-medium uppercase tracking-widest text-xs">My Account</span>
                </Link>
                <div className="text-xs uppercase tracking-widest text-muted">
                  <p>Currency: AUD</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}