import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../admin/AdminLayout';
import { toast } from 'sonner';
import {
  Save, Plus, Trash2, ArrowLeft, Loader2,
  Image as ImageIcon, Eye, EyeOff, Star, Tag,
  ChevronDown, ChevronUp, GripVertical, X,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

// ============================================================
// STATUS CONFIG
// ============================================================
const STATUS_CONFIG = {
  DRAFT:    { label: 'Draft',    color: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-500' },
  ACTIVE:   { label: 'Published', color: 'bg-green-100 text-green-800',  dot: 'bg-green-500' },
  ARCHIVED: { label: 'Archived', color: 'bg-gray-100 text-gray-500',    dot: 'bg-gray-400' },
};

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function ProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // ── Form state matches API response shape exactly ──
  const [formData, setFormData] = useState({
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

  // ── Tag input state ──
  const [tagInput, setTagInput] = useState('');

  // ── Axios instance with auth ──
  const api = axios.create({
    baseURL: API_URL,
    headers: { Authorization: `Bearer ${token}` },
  });

  // ============================================================
  // 1. FETCH PRODUCT
  // ============================================================
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/api/products/${id}`);
        setFormData({
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
      } catch (error) {
        toast.error('Could not load product');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // ============================================================
  // 2. GENERIC HANDLERS
  // ============================================================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // ============================================================
  // 3. MEDIA HANDLERS
  // ============================================================
  // Media shape: { url, altText?, type?, position }
  const handleMediaChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.media];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, media: updated };
    });
  };

  const addMedia = () => {
    setFormData((prev) => ({
      ...prev,
      media: [...prev.media, { url: '', altText: '', type: 'IMAGE', position: prev.media.length }],
    }));
  };

  const removeMedia = (index) => {
    setFormData((prev) => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index).map((m, i) => ({ ...m, position: i })),
    }));
  };

  const moveMedia = (index, direction) => {
    setFormData((prev) => {
      const arr = [...prev.media];
      const target = index + direction;
      if (target < 0 || target >= arr.length) return prev;
      [arr[index], arr[target]] = [arr[target], arr[index]];
      return { ...prev, media: arr.map((m, i) => ({ ...m, position: i })) };
    });
  };

  // ============================================================
  // 4. CONTENT SECTION HANDLERS
  // ============================================================
  // Shape: { type, title, content, position }
  const handleSectionChange = (type, value) => {
    setFormData((prev) => ({
      ...prev,
      contentSections: prev.contentSections.map((s) =>
        s.type === type ? { ...s, content: value } : s
      ),
    }));
  };

  // ============================================================
  // 5. VARIANT HANDLERS
  // ============================================================
  // Shape: { color, size, stock, price?, weight?, barcode?, attributes?: {} }
  const handleVariantChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.variants];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, variants: updated };
    });
  };

  const handleVariantAttributeChange = (index, key, value) => {
    setFormData((prev) => {
      const updated = [...prev.variants];
      updated[index] = {
        ...updated[index],
        attributes: { ...updated[index].attributes, [key]: value },
      };
      return { ...prev, variants: updated };
    });
  };

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { color: '', size: '', stock: 0, price: '', weight: '', barcode: '', attributes: {} },
      ],
    }));
  };

  const removeVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  // ============================================================
  // 6. TAG HANDLERS
  // ============================================================
  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
      setTagInput('');
    }
  };

  const removeTag = (index) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  // ============================================================
  // 7. SUBMIT — Build payload matching service.update() shape
  // ============================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        compareAt: formData.compareAt ? parseFloat(formData.compareAt) : null,
        description: formData.description,
        material: formData.material || null,
        category: formData.category,
        featured: formData.featured,
        metaTitle: formData.metaTitle || null,
        metaDescription: formData.metaDescription || null,
        media: formData.media.map((m, i) => ({
          url: m.url,
          altText: m.altText || null,
          type: m.type || 'IMAGE',
          position: i,
        })),
        contentSections: formData.contentSections.map((s) => ({
          type: s.type,
          title: s.title,
          content: s.content,
          position: s.position,
        })),
        variants: formData.variants.map((v) => ({
          color: v.color,
          size: v.size,
          stock: parseInt(v.stock) || 0,
          price: v.price ? parseFloat(v.price) : null,
          weight: v.weight ? parseFloat(v.weight) : null,
          barcode: v.barcode || null,
          attributes: v.attributes || {},
        })),
        tags: formData.tags,
      };

      await api.put(`/api/products/${id}`, payload);
      toast.success('Product saved');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // 8. PUBLISH / UNPUBLISH
  // ============================================================
  const handleStatusChange = async (newStatus) => {
    setPublishing(true);
    try {
      await api.patch(`/api/products/${id}/status`, { status: newStatus });
      setFormData((prev) => ({ ...prev, status: newStatus }));
      toast.success(newStatus === 'ACTIVE' ? 'Product published' : `Status set to ${newStatus}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Status change failed');
    } finally {
      setPublishing(false);
    }
  };

  // ============================================================
  // LOADING STATE
  // ============================================================
  if (loading) {
    return (
      <AdminLayout>
        <div className="h-[60vh] flex items-center justify-center">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      </AdminLayout>
    );
  }

  const statusConf = STATUS_CONFIG[formData.status] || STATUS_CONFIG.DRAFT;

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto pb-24">

        {/* ── HEADER ── */}
        <div className="flex justify-between items-center mb-8 sticky top-0 bg-gray-50/95 backdrop-blur-sm z-20 py-4 border-b border-gray-200 -mx-4 px-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="font-serif text-2xl">{formData.name || 'Untitled Product'}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConf.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusConf.dot}`} />
                  {statusConf.label}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {formData.status !== 'ACTIVE' && (
              <button
                type="button"
                onClick={() => handleStatusChange('ACTIVE')}
                disabled={publishing}
                className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg text-xs tracking-widest uppercase hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {publishing ? <Loader2 className="animate-spin" size={14} /> : <Eye size={14} />}
                Publish
              </button>
            )}
            {formData.status === 'ACTIVE' && (
              <button
                type="button"
                onClick={() => handleStatusChange('DRAFT')}
                disabled={publishing}
                className="flex items-center gap-2 bg-yellow-500 text-white px-5 py-2.5 rounded-lg text-xs tracking-widest uppercase hover:bg-yellow-600 disabled:opacity-50 transition-colors"
              >
                <EyeOff size={14} />
                Unpublish
              </button>
            )}
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg text-xs tracking-widest uppercase hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
              Save
            </button>
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="flex gap-1 mb-8 border-b border-gray-200">
          {[
            { key: 'general', label: 'General' },
            { key: 'media', label: 'Media' },
            { key: 'variants', label: 'Variants' },
            { key: 'content', label: 'Content Sections' },
            { key: 'seo', label: 'SEO & Tags' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB: GENERAL ── */}
        {activeTab === 'general' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Section title="General Information">
                <Field label="Product Name">
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g. Emerald Silk Bubu"
                    required
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Price (₦)">
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="input-field"
                      min="0"
                      step="0.01"
                      required
                    />
                  </Field>
                  <Field label="Compare at Price (₦)">
                    <input
                      type="number"
                      name="compareAt"
                      value={formData.compareAt}
                      onChange={handleChange}
                      className="input-field"
                      min="0"
                      step="0.01"
                      placeholder="Original price for strikethrough"
                    />
                  </Field>
                </div>
                <Field label="Category">
                  <input
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g. Luxury Bubu"
                  />
                </Field>
                <Field label="Description">
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="6"
                    className="input-field resize-y"
                    placeholder="Describe your masterpiece..."
                  />
                </Field>
              </Section>
            </div>

            <div className="space-y-6">
              <Section title="Status">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Current Status</span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConf.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusConf.dot}`} />
                      {statusConf.label}
                    </span>
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm">
                      <Star size={14} className="inline mr-1 text-yellow-500" />
                      Featured Product
                    </span>
                  </label>
                </div>
              </Section>

              <Section title="Material">
                <textarea
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  placeholder="e.g. 100% Adire Silk from Abeokuta"
                  className="input-field resize-y h-24"
                />
              </Section>
            </div>
          </div>
        )}

        {/* ── TAB: MEDIA ── */}
        {activeTab === 'media' && (
          <Section title="Product Media" subtitle="First image is the hero. Drag to reorder.">
            {formData.media.length === 0 && (
              <p className="text-sm text-gray-400 italic py-4">No media added yet.</p>
            )}
            <div className="space-y-3">
              {formData.media.map((m, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  {/* Preview */}
                  <div className="w-20 h-20 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden">
                    {m.url ? (
                      <img src={m.url} alt={m.altText || ''} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageIcon size={24} />
                      </div>
                    )}
                  </div>

                  {/* Fields */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      {i === 0 && (
                        <span className="text-[10px] font-bold uppercase bg-black text-white px-2 py-0.5 rounded">
                          Hero
                        </span>
                      )}
                      <select
                        value={m.type || 'IMAGE'}
                        onChange={(e) => handleMediaChange(i, 'type', e.target.value)}
                        className="text-xs border rounded px-2 py-1 bg-white"
                      >
                        <option value="IMAGE">Image</option>
                        <option value="VIDEO">Video</option>
                      </select>
                    </div>
                    <input
                      value={m.url}
                      onChange={(e) => handleMediaChange(i, 'url', e.target.value)}
                      placeholder="https://cdn.yuwa.com/..."
                      className="input-field text-sm"
                    />
                    <input
                      value={m.altText || ''}
                      onChange={(e) => handleMediaChange(i, 'altText', e.target.value)}
                      placeholder="Alt text for accessibility"
                      className="input-field text-sm"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1">
                    <button type="button" onClick={() => moveMedia(i, -1)} disabled={i === 0}
                      className="p-1.5 hover:bg-gray-200 rounded disabled:opacity-20 transition-colors">
                      <ChevronUp size={14} />
                    </button>
                    <button type="button" onClick={() => moveMedia(i, 1)} disabled={i === formData.media.length - 1}
                      className="p-1.5 hover:bg-gray-200 rounded disabled:opacity-20 transition-colors">
                      <ChevronDown size={14} />
                    </button>
                    <button type="button" onClick={() => removeMedia(i)}
                      className="p-1.5 hover:bg-red-50 text-red-500 rounded transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" onClick={addMedia}
              className="mt-4 flex items-center gap-2 text-sm font-medium text-black hover:text-gray-600 transition-colors">
              <Plus size={16} /> Add Media
            </button>
          </Section>
        )}

        {/* ── TAB: VARIANTS ── */}
        {activeTab === 'variants' && (
          <Section title="Variants" subtitle="Each combination of color + size is a unique SKU.">
            {formData.variants.length === 0 ? (
              <p className="text-sm text-gray-400 italic py-4">No variants added yet.</p>
            ) : (
              <div className="space-y-4">
                {formData.variants.map((v, i) => (
                  <div key={i} className="p-5 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-gray-400">
                        Variant {i + 1} {v.sku && `— ${v.sku}`}
                      </span>
                      <button type="button" onClick={() => removeVariant(i)}
                        className="text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Row 1: Core attributes */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Field label="Color" compact>
                        <input value={v.color} placeholder="e.g. Emerald"
                          onChange={(e) => handleVariantChange(i, 'color', e.target.value)}
                          className="input-field text-sm" />
                      </Field>
                      <Field label="Size" compact>
                        <input value={v.size} placeholder="e.g. M"
                          onChange={(e) => handleVariantChange(i, 'size', e.target.value)}
                          className="input-field text-sm" />
                      </Field>
                      <Field label="Stock" compact>
                        <input type="number" value={v.stock} min="0"
                          onChange={(e) => handleVariantChange(i, 'stock', e.target.value)}
                          className="input-field text-sm" />
                      </Field>
                      <Field label="Price Override (₦)" compact>
                        <input type="number" value={v.price || ''} placeholder="Leave empty to inherit"
                          onChange={(e) => handleVariantChange(i, 'price', e.target.value)}
                          className="input-field text-sm" min="0" step="0.01" />
                      </Field>
                    </div>

                    {/* Row 2: Extended attributes */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Field label="Weight (g)" compact>
                        <input type="number" value={v.weight || ''} placeholder="e.g. 250"
                          onChange={(e) => handleVariantChange(i, 'weight', e.target.value)}
                          className="input-field text-sm" min="0" />
                      </Field>
                      <Field label="Barcode" compact>
                        <input value={v.barcode || ''} placeholder="Optional"
                          onChange={(e) => handleVariantChange(i, 'barcode', e.target.value)}
                          className="input-field text-sm" />
                      </Field>
                      <Field label="Fabric Type" compact>
                        <input value={v.attributes?.fabricType || ''} placeholder="e.g. Aso-Oke"
                          onChange={(e) => handleVariantAttributeChange(i, 'fabricType', e.target.value)}
                          className="input-field text-sm" />
                      </Field>
                      <Field label="Pattern" compact>
                        <input value={v.attributes?.pattern || ''} placeholder="e.g. Geometric"
                          onChange={(e) => handleVariantAttributeChange(i, 'pattern', e.target.value)}
                          className="input-field text-sm" />
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button type="button" onClick={addVariant}
              className="mt-4 flex items-center gap-2 text-sm font-medium text-black hover:text-gray-600 transition-colors">
              <Plus size={16} /> Add Variant
            </button>
          </Section>
        )}

        {/* ── TAB: CONTENT SECTIONS ── */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <p className="text-sm text-gray-500">
              These sections appear as accordions on the product detail page.
            </p>
            {formData.contentSections.map((section) => (
              <Section key={section.type} title={section.title}>
                <textarea
                  value={section.content}
                  onChange={(e) => handleSectionChange(section.type, e.target.value)}
                  rows="5"
                  className="input-field resize-y"
                  placeholder={getSectionPlaceholder(section.type)}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Use line breaks to separate list items. Supports markdown.
                </p>
              </Section>
            ))}
          </div>
        )}

        {/* ── TAB: SEO & TAGS ── */}
        {activeTab === 'seo' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Section title="SEO">
              <Field label="Meta Title">
                <input
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Custom title for search engines"
                  maxLength={70}
                />
                <p className="text-xs text-gray-400 mt-1">
                  {formData.metaTitle.length}/70 characters
                </p>
              </Field>
              <Field label="Meta Description">
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  className="input-field resize-y"
                  placeholder="Brief description for search results"
                  rows="3"
                  maxLength={160}
                />
                <p className="text-xs text-gray-400 mt-1">
                  {formData.metaDescription.length}/160 characters
                </p>
              </Field>
            </Section>

            <Section title="Tags">
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm">
                    <Tag size={12} />
                    {tag}
                    <button type="button" onClick={() => removeTag(i)}
                      className="hover:text-red-500 transition-colors">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  className="input-field flex-1"
                  placeholder="Type a tag and press Enter"
                />
                <button type="button" onClick={addTag}
                  className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                  Add
                </button>
              </div>
            </Section>
          </div>
        )}
      </form>

      {/* ── GLOBAL STYLES ── */}
      <style>{`
        .input-field {
          width: 100%;
          border: 1px solid #e5e7eb;
          padding: 0.625rem 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          transition: border-color 0.15s;
          background: white;
        }
        .input-field:focus {
          outline: none;
          border-color: #111;
          box-shadow: 0 0 0 1px #111;
        }
        .input-field::placeholder {
          color: #9ca3af;
        }
      `}</style>
    </AdminLayout>
  );
}


// ============================================================
// SUB-COMPONENTS
// ============================================================

function Section({ title, subtitle, children }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="font-bold text-base mb-1">{title}</h3>
      {subtitle && <p className="text-xs text-gray-400 mb-4">{subtitle}</p>}
      {!subtitle && <div className="mb-4" />}
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, compact, children }) {
  return (
    <div>
      <label className={`block font-bold uppercase text-gray-500 ${compact ? 'text-[10px] mb-1' : 'text-xs mb-2'}`}>
        {label}
      </label>
      {children}
    </div>
  );
}

function getSectionPlaceholder(type) {
  const placeholders = {
    DETAILS: 'Handcrafted in Lagos\nHidden side pockets\nFloor-length silhouette\nSigned authenticity tag',
    SIZE_FIT: 'Model is 5\'9" wearing size M\nRelaxed, flowing fit\nTrue to size — order your usual',
    FABRIC_CARE: '100% Silk Adire\nDry clean only\nDo not bleach\nIron on low heat inside-out',
    SHIPPING_RETURNS: 'Free shipping on orders over ₦50,000\nDelivery within 3-5 business days (Lagos)\n14-day return policy',
  };
  return placeholders[type] || 'Enter content...';
}