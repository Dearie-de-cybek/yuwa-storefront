import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

export default function AddressModal({ isOpen, onClose, onSave }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    label: 'Home',
    firstName: '',
    lastName: '',
    street: '',
    city: 'Lagos',
    state: 'Lagos',
    zip: '',
    country: 'Nigeria',
    phone: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave(formData);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="font-serif text-xl">Add New Address</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input name="firstName" placeholder="First Name" onChange={handleChange} required className="input-field" />
            <input name="lastName" placeholder="Last Name" onChange={handleChange} required className="input-field" />
          </div>
          
          <input name="street" placeholder="Street Address" onChange={handleChange} required className="input-field" />
          
          <div className="grid grid-cols-2 gap-4">
            <input name="city" placeholder="City" defaultValue="Lagos" onChange={handleChange} required className="input-field" />
            <input name="state" placeholder="State" defaultValue="Lagos" onChange={handleChange} required className="input-field" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input name="zip" placeholder="Zip Code" onChange={handleChange} className="input-field" />
            <input name="phone" placeholder="Phone Number" onChange={handleChange} required className="input-field" />
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-100 rounded">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="bg-black text-white px-8 py-3 text-xs font-bold uppercase tracking-widest rounded hover:bg-gray-800 flex items-center gap-2">
              {loading && <Loader2 size={14} className="animate-spin" />}
              Save Address
            </button>
          </div>
        </form>
      </div>
      <style>{`
        .input-field {
          width: 100%; border: 1px solid #e5e7eb; padding: 12px; border-radius: 8px; font-size: 14px; outline: none; transition: border-color 0.2s;
        }
        .input-field:focus { border-color: black; }
      `}</style>
    </div>
  );
}