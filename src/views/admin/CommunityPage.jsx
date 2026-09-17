'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { Loader2, Upload, Trash2, Eye, EyeOff } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CITIES = ['Sydney', 'Melbourne', 'Brisbane', 'Perth'];

export default function CommunityPage() {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ imageUrl: '', city: CITIES[0], handle: '', caption: '' });
  const fileInputRef = useRef(null);

  const api = axios.create({ baseURL: API_URL, headers: { Authorization: `Bearer ${token}` } });

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/community', { params: { all: 1 } });
      setPosts(data.posts || []);
    } catch {
      toast.error('Failed to load community posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      setForm((f) => ({ ...f, imageUrl: data.files[0].url }));
      toast.success('Photo uploaded');
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const addPost = async (e) => {
    e.preventDefault();
    if (!form.imageUrl) return toast.error('Upload a photo first');
    try {
      await api.post('/api/community', form);
      setForm({ imageUrl: '', city: CITIES[0], handle: '', caption: '' });
      toast.success('Added to Seen On You');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not add post');
    }
  };

  const toggleActive = async (post) => {
    try {
      await api.patch(`/api/community/${post.id}`);
      load();
    } catch {
      toast.error('Update failed');
    }
  };

  const removePost = async (post) => {
    if (!window.confirm('Remove this photo permanently?')) return;
    try {
      await api.delete(`/api/community/${post.id}`);
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
      toast.success('Removed');
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-serif text-3xl">Community — Seen On You</h1>
        <p className="text-sm text-gray-400 mt-1">
          Real customer photos only. The homepage shows an invite-to-tag state until you add some here.
        </p>
      </div>

      {/* Add form */}
      <form onSubmit={addPost} className="bg-white border border-gray-200 rounded-xl p-6 mb-8 max-w-2xl">
        <h2 className="font-bold text-sm mb-4">Add a Photo</h2>

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

        <div className="flex gap-4 mb-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-24 h-32 shrink-0 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors overflow-hidden disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 className="animate-spin text-gray-400" size={20} />
            ) : form.imageUrl ? (
              <img src={form.imageUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <Upload className="text-gray-400" size={20} />
            )}
          </button>

          <div className="flex-1 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">City</label>
              <select
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
              >
                {CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Handle (optional)</label>
              <input
                value={form.handle}
                onChange={(e) => setForm({ ...form, handle: e.target.value })}
                placeholder="@customer"
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Caption (optional)</label>
              <input
                value={form.caption}
                onChange={(e) => setForm({ ...form, caption: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
              />
            </div>
          </div>
        </div>

        <button type="submit" className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800">
          Add to Seen On You
        </button>
      </form>

      {/* Existing posts */}
      {loading ? (
        <div className="py-20 flex justify-center text-gray-400"><Loader2 className="animate-spin" size={28} /></div>
      ) : posts.length === 0 ? (
        <p className="text-gray-400 text-sm">No photos yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {posts.map((p) => (
            <div key={p.id} className="relative group rounded-lg overflow-hidden border border-gray-200">
              <img src={p.imageUrl} alt="" className={`aspect-[3/4] w-full object-cover ${!p.isActive ? 'opacity-40' : ''}`} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button onClick={() => toggleActive(p)} className="p-2 bg-white rounded-full" title={p.isActive ? 'Hide' : 'Show'}>
                  {p.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button onClick={() => removePost(p)} className="p-2 bg-white rounded-full text-red-500" title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
              <span className="absolute bottom-1 left-1 text-[9px] bg-black/70 text-white px-1.5 py-0.5 rounded">{p.city}</span>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
