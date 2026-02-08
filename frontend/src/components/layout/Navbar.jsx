import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, User, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const location = useLocation();

  
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
        { title: 'Prom', path: '/custom/prom' },
        { title: 'Wedding Guest', path: '/custom/wedding' },
        { title: 'Dinner & Events', path: '/custom/dinner' }
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
                  className={`text-sm uppercase tracking-widest font-medium hover:text-accent transition-colors
                    ${item.isSpecial ? 'text-accent' : 'text-primary'}`}
                >
                  {item.title}
                </Link>
                
                {/* Desktop Dropdown for Custom Creations */}
                {item.children && (
                  <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="bg-white border border-border p-6 w-56 shadow-sm">
                       <span className="text-xs text-muted mb-3 block border-b border-gray-100 pb-2">
                         Made for moments that matter
                       </span>
                       <div className="flex flex-col space-y-3">
                         {item.children.map((child, cIdx) => (
                           <Link 
                             key={cIdx} 
                             to={child.path}
                             className="text-primary hover:text-accent text-sm font-serif italic"
                           >
                             {child.title}
                           </Link>
                         ))}
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
            <h1 className={`font-serif text-3xl md:text-4xl tracking-tight font-medium transition-colors duration-300 ${scrolled || isOpen ? 'text-primary' : 'text-primary'}`}>
              YUWA
            </h1>
          </Link>

          {/* RIGHT - Utilities */}
          <div className="flex items-center space-x-6 text-primary">
            <button className="hidden md:block hover:text-accent transition-colors">
              <Search strokeWidth={1.5} size={22} />
            </button>
            <Link to="/account" className="hidden md:block hover:text-accent transition-colors">
              <User strokeWidth={1.5} size={22} />
            </Link>
            <button className="relative hover:text-accent transition-colors">
              <ShoppingBag strokeWidth={1.5} size={22} />
              <span className="absolute -top-1 -right-2 bg-accent text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">0</span>
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU DRAWER (Editorial Style) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            />
            
            {/* Drawer */}
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
                            className={`transition-transform duration-300 ${activeSubmenu === idx ? 'rotate-180' : ''}`}
                          />
                        </button>
                      )}
                    </div>

                    {/* Mobile Accordion for Custom Creations */}
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
                                className="text-muted text-lg hover:text-accent font-sans"
                              >
                                {child.title}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              <div className="mt-16 pt-8 border-t border-border">
                <Link to="/account" className="flex items-center space-x-3 text-primary mb-4">
                  <User size={20} />
                  <span>My Account</span>
                </Link>
                <div className="text-sm text-muted">
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