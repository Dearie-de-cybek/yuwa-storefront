import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function ProfileTab({ user, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match"); // Replace with toast
      return;
    }
    
    setLoading(true);
    await onUpdate(formData);
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-xl animate-fade-in">
      <h2 className="font-serif text-2xl mb-8">Account Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">First Name</label>
            <input 
              name="firstName" 
              value={formData.firstName} 
              onChange={handleChange}
              className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Last Name</label>
            <input 
              name="lastName" 
              value={formData.lastName} 
              onChange={handleChange}
              className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email Address</label>
          <input 
            value={user?.email} 
            disabled 
            className="w-full border-b border-gray-300 py-2 text-gray-400 cursor-not-allowed bg-transparent" 
          />
          <p className="text-[10px] text-gray-400">Contact support to change email.</p>
        </div>

        <div className="space-y-2">
           <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Phone Number</label>
           <input 
             name="phone"
             value={formData.phone}
             onChange={handleChange}
             placeholder="+234..."
             className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors"
           />
        </div>

        <div className="pt-6 border-t border-gray-100">
           <h3 className="font-bold text-sm mb-4">Change Password</h3>
           <div className="space-y-4">
             <input 
               type="password"
               name="password"
               value={formData.password}
               onChange={handleChange}
               placeholder="New Password"
               className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors" 
             />
             <input 
               type="password"
               name="confirmPassword"
               value={formData.confirmPassword}
               onChange={handleChange}
               placeholder="Confirm New Password"
               className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors" 
             />
           </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-black text-white px-8 py-3 text-xs tracking-widest uppercase rounded hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}