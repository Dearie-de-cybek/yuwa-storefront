import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-secondary pt-20 pb-10 px-6 border-t border-white/10">
      <div className="max-w-[1440px] mx-auto">
        
        {/* TOP: Newsletter & Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-20">
          
          {/* 1. Brand & Newsletter */}
          <div className="md:col-span-2 space-y-8">
            <h2 className="font-serif text-3xl">YUWA</h2>
            <div className="max-w-md">
              <p className="text-sm text-gray-400 mb-6">
                Join our list for exclusive drops, private sales, and stories from the diaspora.
              </p>
              <form className="flex border-b border-gray-600 pb-2">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="bg-transparent w-full outline-none text-white placeholder-gray-600 font-sans"
                />
                <button type="button" className="text-white hover:text-accent transition-colors">
                  <ArrowRight size={20} />
                </button>
              </form>
            </div>
          </div>

          {/* 2. Shop Links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-6">Shop</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><Link to="/shop/ready-to-wear" className="hover:text-white transition-colors">Ready to Wear</Link></li>
              <li><Link to="/shop/bubus" className="hover:text-white transition-colors">Bùbús</Link></li>
              <li><Link to="/custom" className="hover:text-white transition-colors">Custom Creations</Link></li>
              <li><Link to="/shop/gift-cards" className="hover:text-white transition-colors">Gift Cards</Link></li>
            </ul>
          </div>

          {/* 3. Support Links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><Link to="/track-order" className="hover:text-white transition-colors">Track Order</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/size-guide" className="hover:text-white transition-colors">Size Guide</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        {/* BOTTOM: Copyright & Socials */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-xs text-gray-500">
          <p>© 2026 The YUWA Brand. All rights reserved.</p>
          
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">TikTok</a>
            <a href="#" className="hover:text-white transition-colors">Facebook</a>
          </div>

          {/* Payment Icons (Visual Only) */}
          <div className="flex gap-4 mt-4 md:mt-0 opacity-50">
            <div className="w-8 h-5 bg-white rounded-sm" /> {/* Visa */}
            <div className="w-8 h-5 bg-white rounded-sm" /> {/* Mastercard */}
            <div className="w-8 h-5 bg-white rounded-sm" /> {/* Paystack */}
          </div>
        </div>

      </div>
    </footer>
  );
}