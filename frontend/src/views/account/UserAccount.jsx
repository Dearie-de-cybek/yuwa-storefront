import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Package, MapPin, User, LogOut, Heart, CreditCard, Loader2, ArrowRight } from 'lucide-react';

// Hooks
import useCustomerData from './components/useCustomerData';

// Components
import OrdersTab from './components/OrdersTab';
import AddressesTab from './components/AddressesTab';
import ProfileTab from './components/ProfileTab';
import AddressModal from './components/AddressModal'; 

const MENU = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'settings', label: 'Settings', icon: CreditCard },
];

export default function UserAccount() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false); // Modal State
  
  const { 
    loading, user, orders, addresses, metrics, 
    updateProfile, addAddress, deleteAddress 
  } = useCustomerData();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-white">
           <Loader2 className="animate-spin text-gray-300" size={32} />
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-24"> 
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header with improved spacing */}
        <div className="mb-12 border-b border-gray-100 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
             <h1 className="font-serif text-4xl mb-2 capitalize">
               Welcome, {user?.firstName || 'Guest'}
             </h1>
             <p className="text-gray-500 text-sm">Manage your orders and personal details.</p>
          </div>
          <div className="hidden md:block text-right">
             <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Member Status</p>
             <p className="font-serif text-lg">VIP Client</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* SIDEBAR NAVIGATION */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <nav className="space-y-1">
              {MENU.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-4 px-4 py-4 text-sm transition-all rounded-lg ${
                      isActive 
                        ? 'bg-black text-white font-medium shadow-lg shadow-gray-200' 
                        : 'text-gray-500 hover:text-black hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'text-white' : 'text-gray-400'} />
                    {item.label}
                  </button>
                );
              })}
              
              <div className="pt-8 mt-8 border-t border-gray-100">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-4 py-4 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </nav>
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 min-h-[500px]">
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-fade-in">
                
                {/* HERO SECTION - AFRICAN INSPIRED PATTERN */}
                <div className="relative rounded-2xl overflow-hidden bg-[#1a1a1a] text-white p-8 md:p-12">
                  {/* CSS Pattern Background */}
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, #333 10px, #333 20px), 
                                      linear-gradient(to bottom, #222, #000)`
                  }} />
                  
                  <div className="relative z-10 max-w-lg">
                    <p className="text-xs font-bold uppercase tracking-widest text-yellow-500 mb-3">New Collection</p>
                    <h2 className="font-serif text-3xl md:text-4xl mb-4 leading-tight">
                      Elevate your style with the latest Adire drops.
                    </h2>
                    <Link to="/shop/ready-to-wear" className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 text-xs font-bold uppercase tracking-widest rounded hover:bg-gray-200 transition-colors">
                      Shop Now <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>

                {/* METRICS */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Total Orders</p>
                    <p className="font-serif text-3xl">{metrics.totalOrders}</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Wishlist</p>
                    <p className="font-serif text-3xl">{metrics.wishlistCount}</p>
                  </div>
                  <div className="col-span-2 md:col-span-1 bg-gray-900 text-white p-6 rounded-xl">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Wallet Balance</p>
                     <p className="font-serif text-3xl">₦0.00</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && <OrdersTab orders={orders} />}
            
            {activeTab === 'addresses' && (
              <AddressesTab 
                addresses={addresses} 
                onDelete={deleteAddress} 
                onAdd={() => setIsAddressModalOpen(true)} // Open Modal
              />
            )}
            
            {activeTab === 'settings' && <ProfileTab user={user} onUpdate={updateProfile} />}
            
            {activeTab === 'wishlist' && (
               <div className="text-center py-20 animate-fade-in border border-dashed border-gray-200 rounded-xl">
                 <Heart size={48} className="mx-auto text-gray-200 mb-4" />
                 <h3 className="font-serif text-xl">Your wishlist is empty</h3>
                 <p className="text-gray-500 mt-2 mb-6 text-sm">Save items you love for later.</p>
                 <Link to="/shop/ready-to-wear" className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1">
                   Browse Collection
                 </Link>
               </div>
            )}
          </main>
        </div>
      </div>

      {/* MODAL IS HERE */}
      <AddressModal 
        isOpen={isAddressModalOpen} 
        onClose={() => setIsAddressModalOpen(false)} 
        onSave={addAddress} 
      />
    </div>
  );
}