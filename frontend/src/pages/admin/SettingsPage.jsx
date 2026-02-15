import AdminLayout from '../admin/AdminLayout';

export default function SettingsPage() {
  return (
    <AdminLayout>
      <h1 className="font-serif text-3xl mb-8">Store Settings</h1>
      
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm max-w-2xl">
        <h2 className="font-bold text-lg mb-6">General Information</h2>
        
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Store Name</label>
              <input type="text" defaultValue="YUWA" className="w-full border border-gray-300 rounded-lg p-3 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Currency</label>
              <select className="w-full border border-gray-300 rounded-lg p-3 text-sm">
                <option>NGN (₦)</option>
                <option>USD ($)</option>
                <option>GBP (£)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Support Email</label>
            <input type="email" defaultValue="help@yuwa.com" className="w-full border border-gray-300 rounded-lg p-3 text-sm" />
          </div>

          <div className="pt-6 border-t border-gray-100">
            <button className="bg-black text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-gray-800">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}