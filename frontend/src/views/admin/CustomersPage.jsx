'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { Mail, Phone, ShoppingBag, Loader2 } from 'lucide-react';
import Skeleton from '../../components/ui/Skeleton';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CustomersPage() {
  const { token } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: API_URL,
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/users/admin/all', { params: { limit: 50 } });
      setCustomers(data.users || []);
    } catch (error) {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleActive = async (c) => {
    try {
      const { data } = await api.put(`/api/users/admin/${c.id}/toggle-active`);
      setCustomers((prev) => prev.map((u) => (u.id === c.id ? { ...u, isActive: data.isActive } : u)));
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  return (
    <AdminLayout>
      <h1 className="font-serif text-3xl mb-8">Customers</h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((c) => (
            <div key={c.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-600">
                {(c.firstName || '?').charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-gray-900 truncate">{c.firstName} {c.lastName}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {c.isActive ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 truncate">
                  <Mail size={12} /> {c.email}
                </div>
                {c.phone && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <Phone size={12} /> {c.phone}
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <ShoppingBag size={12} /> {c.orderCount ?? 0} orders
                </div>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-gray-400">Joined: {new Date(c.createdAt).toLocaleDateString()}</p>
                  <button
                    onClick={() => toggleActive(c)}
                    className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-0.5 hover:text-accent hover:border-accent transition-colors"
                  >
                    {c.isActive ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {customers.length === 0 && (
            <p className="col-span-full py-16 text-center text-gray-400">No customers yet.</p>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
