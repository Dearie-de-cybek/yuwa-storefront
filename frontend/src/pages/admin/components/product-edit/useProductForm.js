import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../../../context/AuthContext';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Hook that owns all product editor state + API logic.
 * Components just read state and call handlers.
 */
export default function useProductForm(productId) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // ── Core form state ──
  const [form, setForm] = useState({
    name: '',
    price: 0,
    compareAt: '',
    description: '',
    material: '',
    status: 'DRAFT',
    featured: false,
    category: '',
    metaTitle: '',
    metaDescription: '',
    media: [],
    contentSections: [],
    variants: [],
    tags: [],
  });

  // ── Axios instance ──
  const api = axios.create({
    baseURL: API_URL,
    headers: { Authorization: `Bearer ${token}` },
  });

  // ============================================================
  // FETCH
  // ============================================================
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/api/products/${productId}`);
        setForm({
          name: data.name || '',
          price: data.price || 0,
          compareAt: data.compareAt || '',
          description: data.description || '',
          material: data.material || '',
          status: data.status || 'DRAFT',
          featured: data.featured || false,
          category: data.category?.name || '',
          metaTitle: data.metaTitle || '',
          metaDescription: data.metaDescription || '',
          media: data.media || [],
          contentSections: data.contentSections || [],
          variants: data.variants || [],
          tags: data.tags?.map((t) => t.name) || [],
        });
      } catch (err) {
        toast.error('Could not load product');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [productId]);

  // ============================================================
  // GENERIC UPDATER — components call this to change any field
  // ============================================================
  const updateField = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }, []);

  // ============================================================
  // SAVE
  // ============================================================
  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        price: parseFloat(form.price),
        compareAt: form.compareAt ? parseFloat(form.compareAt) : null,
        description: form.description,
        material: form.material || null,
        category: form.category,
        featured: form.featured,
        metaTitle: form.metaTitle || null,
        metaDescription: form.metaDescription || null,
        media: form.media.map((m, i) => ({
          url: m.url,
          altText: m.altText || null,
          type: m.type || 'IMAGE',
          position: i,
        })),
        contentSections: form.contentSections.map((s) => ({
          type: s.type,
          title: s.title,
          content: s.content,
          position: s.position,
        })),
        variants: form.variants.map((v) => ({
          color: v.color,
          size: v.size,
          stock: parseInt(v.stock) || 0,
          price: v.price ? parseFloat(v.price) : null,
          weight: v.weight ? parseFloat(v.weight) : null,
          barcode: v.barcode || null,
          attributes: v.attributes || {},
        })),
        tags: form.tags,
      };

      await api.put(`/api/products/${productId}`, payload);
      toast.success('Product saved');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // PUBLISH / UNPUBLISH
  // ============================================================
  const changeStatus = async (newStatus) => {
    setPublishing(true);
    try {
      await api.post(`/api/products/${productId}/status`, { status: newStatus });
      updateField('status', newStatus);
      toast.success(newStatus === 'ACTIVE' ? 'Product published' : `Status: ${newStatus}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Status change failed');
    } finally {
      setPublishing(false);
    }
  };

  return {
    form,
    loading,
    saving,
    publishing,
    updateField,
    handleChange,
    save,
    changeStatus,
  };
}