import { MapPin, Plus, Trash2 } from 'lucide-react';

export default function AddressesTab({ addresses, onDelete, onAdd }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="font-serif text-2xl">Address Book</h2>
        <button 
          onClick={onAdd}
          className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-600 flex items-center gap-1"
        >
          <Plus size={14} /> Add New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* New Address Button (Card Style) */}
        <button 
          onClick={onAdd}
          className="border border-dashed border-gray-300 p-8 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-black hover:text-black transition-colors min-h-[200px] group"
        >
          <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center mb-3 group-hover:bg-gray-100">
             <Plus size={20} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest">Add New Address</span>
        </button>

        {/* Address Cards */}
        {addresses.map((addr) => (
          <div key={addr.id} className="border border-gray-200 p-6 rounded-xl relative hover:border-black transition-colors bg-white">
            {addr.isDefault && (
              <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest bg-black text-white px-2 py-1 rounded">
                Default
              </span>
            )}
            
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <MapPin size={14} className="text-gray-400" />
              {addr.label || 'Home'}
            </h3>
            
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {addr.firstName} {addr.lastName}<br />
              {addr.street}<br />
              {addr.city}, {addr.state} {addr.zip}<br />
              {addr.country}
            </p>
            
            <div className="flex gap-4 pt-4 border-t border-gray-100">
              <button className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black">Edit</button>
              <button 
                onClick={() => onDelete(addr.id)}
                className="text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-600 flex items-center gap-1"
              >
                <Trash2 size={12} /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}