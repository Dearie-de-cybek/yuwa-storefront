import AdminLayout from '../admin/AdminLayout';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function CustomersPage() {
  const customers = [
    { id: 1, name: "Amaka Obi", email: "amaka@example.com", joined: "Jan 20, 2025", location: "Lagos, NG" },
    { id: 2, name: "Chioma Jesus", email: "chioma@example.com", joined: "Feb 15, 2025", location: "Abuja, NG" },
  ];

  return (
    <AdminLayout>
      <h1 className="font-serif text-3xl mb-8">Customers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((c) => (
          <div key={c.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-600">
              {c.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{c.name}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <Mail size={12} /> {c.email}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <MapPin size={12} /> {c.location}
              </div>
              <p className="text-xs text-gray-400 mt-3">Joined: {c.joined}</p>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}