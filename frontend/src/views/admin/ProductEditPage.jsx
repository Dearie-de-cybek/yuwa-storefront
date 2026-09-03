import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../admin/AdminLayout';
import useProductForm from './components/product-edit/useProductForm';
import GeneralTab from './components/product-edit/GeneralTab';
import MediaTab from './components/product-edit/MediaTab';
import VariantsTab from './components/product-edit/VariantsTab';
import ContentTab from './components/product-edit/ContentTab';
import SeoTagsTab from './components/product-edit/SeoTagsTab';
import { ArrowLeft, Save, Eye, EyeOff, Loader2 } from 'lucide-react';

const TABS = [
  { key: 'general',  label: 'General' },
  { key: 'media',    label: 'Media' },
  { key: 'variants', label: 'Variants' },
  { key: 'content',  label: 'Content' },
  { key: 'seo',      label: 'SEO & Tags' },
];

export default function ProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');

  const {
    form, loading, saving, publishing,
    updateField, handleChange, save, changeStatus,
  } = useProductForm(id);

  const handleSubmit = (e) => {
    e.preventDefault();
    save();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="h-[60vh] flex items-center justify-center">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto pb-24">

        {/* ── Header ── */}
        <Header
          name={form.name}
          status={form.status}
          saving={saving}
          publishing={publishing}
          onBack={() => navigate('/admin/products')}
          onPublish={() => changeStatus('ACTIVE')}
          onUnpublish={() => changeStatus('DRAFT')}
        />

        {/* ── Tabs ── */}
        <div className="flex gap-1 mb-8 border-b border-gray-200">
          {TABS.map((tab) => (
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

        {/* ── Tab content ── */}
        {activeTab === 'general'  && <GeneralTab form={form} handleChange={handleChange} updateField={updateField} />}
        {activeTab === 'media'    && <MediaTab media={form.media} updateField={updateField} />}
        {activeTab === 'variants' && <VariantsTab variants={form.variants} updateField={updateField} />}
        {activeTab === 'content'  && <ContentTab contentSections={form.contentSections} updateField={updateField} />}
        {activeTab === 'seo'      && <SeoTagsTab form={form} handleChange={handleChange} updateField={updateField} />}
      </form>

      {/* ── Shared styles ── */}
      <style>{`
        .input-field {
          width: 100%; border: 1px solid #e5e7eb; padding: 0.625rem 0.75rem;
          border-radius: 0.5rem; font-size: 0.875rem; background: white; transition: border-color 0.15s;
        }
        .input-field:focus { outline: none; border-color: #111; box-shadow: 0 0 0 1px #111; }
        .input-field::placeholder { color: #9ca3af; }
      `}</style>
    </AdminLayout>
  );
}

// ── Header sub-component (kept here since it's page-specific) ──
const STATUS = {
  DRAFT:    { label: 'Draft',     color: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-500' },
  ACTIVE:   { label: 'Published', color: 'bg-green-100 text-green-800',  dot: 'bg-green-500' },
  ARCHIVED: { label: 'Archived',  color: 'bg-gray-100 text-gray-500',    dot: 'bg-gray-400' },
};

function Header({ name, status, saving, publishing, onBack, onPublish, onUnpublish }) {
  const s = STATUS[status] || STATUS.DRAFT;
  return (
    <div className="flex justify-between items-center mb-8 sticky top-0 bg-gray-50/95 backdrop-blur-sm z-20 py-4 border-b border-gray-200 -mx-4 px-4">
      <div className="flex items-center gap-4">
        <button type="button" onClick={onBack} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-serif text-2xl">{name || 'Untitled Product'}</h1>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${s.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {s.label}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {status !== 'ACTIVE' && (
          <button type="button" onClick={onPublish} disabled={publishing}
            className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg text-xs tracking-widest uppercase hover:bg-green-700 disabled:opacity-50 transition-colors">
            {publishing ? <Loader2 className="animate-spin" size={14} /> : <Eye size={14} />} Publish
          </button>
        )}
        {status === 'ACTIVE' && (
          <button type="button" onClick={onUnpublish} disabled={publishing}
            className="flex items-center gap-2 bg-yellow-500 text-white px-5 py-2.5 rounded-lg text-xs tracking-widest uppercase hover:bg-yellow-600 disabled:opacity-50 transition-colors">
            <EyeOff size={14} /> Unpublish
          </button>
        )}
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg text-xs tracking-widest uppercase hover:bg-gray-800 disabled:opacity-50 transition-colors">
          {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />} Save
        </button>
      </div>
    </div>
  );
}