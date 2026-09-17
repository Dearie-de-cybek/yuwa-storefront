'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SettingsPage() {
  const { token } = useAuth();
  const [settings, setSettings] = useState({ storeName: '', currency: 'NGN', supportEmail: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const api = axios.create({ baseURL: API_URL, headers: { Authorization: `Bearer ${token}` } });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/api/settings');
        setSettings({ storeName: data.storeName, currency: data.currency, supportEmail: data.supportEmail });
      } catch {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/api/settings', settings);
      toast.success('Settings saved');
    } catch {
      toast.error('Could not save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="font-serif text-3xl mb-8">Store Settings</h1>

      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm max-w-2xl">
        <h2 className="font-bold text-lg mb-6">General Information</h2>

        {loading ? (
          <div className="py-10 flex justify-center text-gray-400"><Loader2 className="animate-spin" size={28} /></div>
        ) : (
          <form className="space-y-6" onSubmit={save}>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Store Name</label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm"
                >
                  <option value="NGN">NGN (₦)</option>
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Support Email</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm"
              />
            </div>

            <div className="pt-6 border-t border-gray-100">
              <button type="submit" disabled={saving} className="bg-black text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
