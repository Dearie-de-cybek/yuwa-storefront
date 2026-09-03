'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { Loader2, Trash2, Plus } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const EMPTY = { title: '', code: '', discountType: 'PERCENTAGE', discountValue: '', minOrderAmount: '', maxUses: '' };

export default function PromotionsPage() {
  const { token } = useAuth();
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const api = axios.create({ baseURL: API_URL, headers: { Authorization: `Bearer ${token}` } });

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/promotions');
      setPromos(data || []);
    } catch {
      toast.error('Failed to load promotions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createPromo = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.post('/api/promotions', form);
      setPromos((prev) => [data, ...prev]);
      setForm(EMPTY);
      setShowForm(false);
      toast.success(`Promotion ${data.code} created`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not create promotion');
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (p) => {
    try {
      const { data } = await api.patch(`/api/promotions/${p.id}`);
      setPromos((prev) => prev.map((x) => (x.id === p.id ? data : x)));
    } catch {
      toast.error('Update failed');
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete promotion ${p.code}?`)) return;
    try {
      await api.delete(`/api/promotions/${p.id}`);
      setPromos((prev) => prev.filter((x) => x.id !== p.id));
      toast.success('Promotion deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const discountLabel = (p) => (p.discountType === 'PERCENTAGE' ? `${p.discountValue}%` : `₦${Number(p.discountValue).toLocaleString()}`);

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif text-3xl">Active Promotions</h1>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="bg-black text-white px-6 py-3 text-sm tracking-widest uppercase hover:bg-gray-800 flex items-center gap-2"
        >
          <Plus size={16} /> {showForm ? 'Close' : 'New Campaign'}
        </button>
      </div>

      {/* CREATE FORM */}
      {showForm && (
        <form onSubmit={createPromo} className="bg-white border border-gray-200 rounded-xl p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Title</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-gray-300 rounded-lg p-3 text-sm" placeholder="Detty December Sale" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Code</label>
            <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="w-full border border-gray-300 rounded-lg p-3 text-sm uppercase" placeholder="DETTYDECEMBER" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Type</label>
            <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} className="w-full border border-gray-300 rounded-lg p-3 text-sm">
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FIXED">Fixed (₦)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Value</label>
            <input required type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} className="w-full border border-gray-300 rounded-lg p-3 text-sm" placeholder="15" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Min Order (optional)</label>
            <input type="number" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} className="w-full border border-gray-300 rounded-lg p-3 text-sm" placeholder="50000" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Max Uses (optional)</label>
            <input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} className="w-full border border-gray-300 rounded-lg p-3 text-sm" placeholder="100" />
          </div>
          <div className="md:col-span-2">
            <button type="submit" disabled={saving} className="bg-black text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50">
              {saving ? 'Creating...' : 'Create Promotion'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="py-20 flex justify-center text-gray-400"><Loader2 className="animate-spin" size={28} /></div>
      ) : promos.length === 0 ? (
        <div className="bg-white p-12 text-center border border-dashed border-gray-300 rounded-xl">
          <p className="text-gray-400 mb-4">No active sales or promo codes.</p>
          <p className="text-sm text-gray-500">Create a discount code like "DETTYDECEMBER" to boost sales.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Uses</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {promos.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-bold text-gray-900">{p.code}</td>
                  <td className="px-6 py-4">{p.title}</td>
                  <td className="px-6 py-4">{discountLabel(p)}</td>
                  <td className="px-6 py-4 text-gray-500">{p.currentUses}{p.maxUses ? ` / ${p.maxUses}` : ''}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggle(p)}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                    >
                      {p.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => remove(p)} className="text-red-500 hover:text-red-700 inline-flex items-center gap-1 text-xs uppercase tracking-widest font-bold">
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
