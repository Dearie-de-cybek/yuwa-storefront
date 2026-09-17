'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react';
import Skeleton from '../../components/ui/Skeleton';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ACTIVE_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED'];

const STATUS_COLOR = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-indigo-100 text-indigo-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-gray-100 text-gray-700',
};

export default function AdminDashboard() {
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ revenue: 0, activeOrders: 0, customers: 0, totalOrders: 0 });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const api = axios.create({ baseURL: API_URL, headers: { Authorization: `Bearer ${token}` } });

    (async () => {
      try {
        const [ordersRes, usersRes] = await Promise.all([
          api.get('/api/orders/admin/all', { params: { limit: 100 } }),
          api.get('/api/users/admin/all', { params: { limit: 1 } }),
        ]);

        const orders = ordersRes.data.orders || [];
        const revenue = orders
          .filter((o) => o.paymentStatus === 'PAID')
          .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

        setStats({
          revenue,
          activeOrders: orders.filter((o) => ACTIVE_STATUSES.includes(o.status)).length,
          customers: usersRes.data.pagination?.total ?? 0,
          totalOrders: ordersRes.data.pagination?.total ?? orders.length,
        });
        setRecent(orders.slice(0, 5));
      } catch (error) {
        // Leave zeros on failure.
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const fmt = (n) => `₦${Number(n).toLocaleString()}`;

  const cards = [
    { title: 'Total Revenue', value: fmt(stats.revenue), icon: DollarSign, color: 'bg-green-100 text-green-700', note: 'Paid orders' },
    { title: 'Active Orders', value: String(stats.activeOrders), icon: ShoppingBag, color: 'bg-blue-100 text-blue-700', note: 'In progress' },
    { title: 'Customers', value: stats.customers.toLocaleString(), icon: Users, color: 'bg-purple-100 text-purple-700', note: 'Registered' },
    { title: 'Total Orders', value: String(stats.totalOrders), icon: TrendingUp, color: 'bg-orange-100 text-orange-700', note: 'All time' },
  ];

  return (
    <AdminLayout>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.title}</p>
                <h3 className="text-2xl font-serif mt-2 text-gray-900">
                  {loading ? <Skeleton className="h-7 w-24 mt-1" /> : stat.value}
                </h3>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">{stat.note}</p>
          </div>
        ))}
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-serif text-lg mb-4">Recent Activity</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-gray-50/50">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3" colSpan={4}><Skeleton className="h-6 w-full" /></td>
                    </tr>
                  ))
                ) : recent.length === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-10 text-center text-gray-400">No orders yet.</td></tr>
                ) : (
                  recent.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{o.orderNumber}</td>
                      <td className="px-4 py-3">{o.user ? `${o.user.firstName} ${o.user.lastName}` : o.customerEmail}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${STATUS_COLOR[o.status] || 'bg-gray-100 text-gray-700'}`}>{o.status}</span>
                      </td>
                      <td className="px-4 py-3 text-right">{fmt(o.totalAmount)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-serif text-lg mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button onClick={() => router.push('/admin/products')} className="w-full py-3 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors rounded-lg">
              + Manage Products
            </button>
            <button onClick={() => router.push('/admin/orders')} className="w-full py-3 border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors rounded-lg">
              View Orders
            </button>
          </div>

          <div className="mt-8">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">System Health</h4>
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-100">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Server Operational
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
