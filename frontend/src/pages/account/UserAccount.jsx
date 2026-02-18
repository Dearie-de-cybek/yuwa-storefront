import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Package, MapPin, User, LogOut, Heart, CreditCard, Loader2 } from 'lucide-react';

// Hooks
import useCustomerData from './components/useCustomerData';

// Components
import OrdersTab from './components/OrdersTab';
import AddressesTab from './components/AddressesTab';
import ProfileTab from './components/ProfileTab';

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
  
  // Connect to the Brain
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
    <div className="min-h-screen bg-white pt-12 pb-24"> 
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Welcome Header */}
        <div className="mb-12 border-b border-gray-100 pb-8 flex justify-between items-end">
          <div>
             <h1 className="font-serif text-4xl mb-2">
               Welcome, {user?.firstName}
             </h1>
             <p className="text-gray-500 text-sm">Account Dashboard</p>
          </div>
          <div className="hidden md:block">
             <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Total Spent</p>
             <p className="font-serif text-xl">₦{metrics.totalSpent.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* SIDEBAR */}
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
                        ? 'bg-gray-50 font-bold text-black' 
                        : 'text-gray-500 hover:text-black hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'text-black' : 'text-gray-400'} />
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
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Total Orders</p>
                    <p className="font-serif text-3xl">{metrics.totalOrders}</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Wishlist Items</p>
                    <p className="font-serif text-3xl">{metrics.wishlistCount}</p>
                  </div>
                  <div className="col-span-2 md:col-span-1 bg-black text-white p-6 rounded-xl">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Wallet</p>
                     <p className="font-serif text-3xl">₦0.00</p>
                  </div>
                </div>

                {orders.length > 0 && (
                   <div>
                     <h3 className="font-bold text-lg mb-4">Recent Order</h3>
                     <div className="border border-gray-200 rounded-xl p-6 flex justify-between items-center bg-white hover:border-black transition-colors cursor-pointer" onClick={() => setActiveTab('orders')}>
                       <div>
                         <p className="font-bold">{orders[0].orderNumber || orders[0].id}</p>
                         <p className="text-sm text-gray-500">{new Date(orders[0].createdAt).toLocaleDateString()}</p>
                       </div>
                       <ChevronRight size={18} className="text-gray-400" />
                     </div>
                   </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && <OrdersTab orders={orders} />}
            {activeTab === 'addresses' && <AddressesTab addresses={addresses} onDelete={deleteAddress} onAdd={() => alert("Modal not implemented")} />}
            {activeTab === 'settings' && <ProfileTab user={user} onUpdate={updateProfile} />}
            
            {activeTab === 'wishlist' && (
               <div className="text-center py-20 animate-fade-in">
                 <Heart size={48} className="mx-auto text-gray-200 mb-4" />
                 <h3 className="font-serif text-xl">Your wishlist is empty</h3>
                 <p className="text-gray-500 mt-2 mb-6">Save items you love for later.</p>
               </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}