'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const EMPTY = {
  heroEyebrow: '', heroTitle: '', heroAccent: '', heroBody: '', heroImage: '',
  journeyTitle: '', journeyBody: '', journeyFromLabel: '', journeyFromImage: '', journeyToLabel: '', journeyToImage: '',
  designerName: '', designerTitle: '', designerBio: '', designerImage: '',
  sourcingTitle: '', sourcingBody: '', sourcingImage: '',
  quote: '', quoteAuthor: '',
};

function Field({ label, value, onChange, textarea, half }) {
  return (
    <div className={half ? '' : 'md:col-span-2'}>
      <label className="block text-xs font-bold uppercase text-gray-500 mb-2">{label}</label>
      {textarea ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 text-sm"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 text-sm"
        />
      )}
    </div>
  );
}

function ImageField({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase text-gray-500 mb-2">{label}</label>
      <div className="flex gap-3 items-start">
        <div className="w-16 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
          {value && <img src={value} alt="" className="w-full h-full object-cover" />}
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/images/... or https://..."
          className="flex-1 border border-gray-300 rounded-lg p-3 text-sm"
        />
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
      <h2 className="font-bold text-lg mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
    </div>
  );
}

export default function OurStoryPage() {
  const { token } = useAuth();
  const [story, setStory] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const api = axios.create({ baseURL: API_URL, headers: { Authorization: `Bearer ${token}` } });
  const set = (field) => (value) => setStory((s) => ({ ...s, [field]: value }));

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/api/brand-story');
        setStory({ ...EMPTY, ...data });
      } catch {
        toast.error('Failed to load Our Story content');
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
      await api.put('/api/brand-story', story);
      toast.success('Our Story updated');
    } catch {
      toast.error('Could not save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl">Our Story</h1>
          <p className="text-sm text-gray-400 mt-1">The brand-heritage content shown on /our-story and the homepage.</p>
        </div>
        <a href="/our-story" target="_blank" rel="noreferrer" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black underline">
          View Live Page
        </a>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center text-gray-400"><Loader2 className="animate-spin" size={28} /></div>
      ) : (
        <form onSubmit={save} className="space-y-8 max-w-4xl">
          <Section title="Hero">
            <Field half label="Eyebrow" value={story.heroEyebrow} onChange={set('heroEyebrow')} />
            <div />
            <Field half label="Title (line 1)" value={story.heroTitle} onChange={set('heroTitle')} />
            <Field half label="Title (line 2, accent)" value={story.heroAccent} onChange={set('heroAccent')} />
            <Field label="Body" value={story.heroBody} onChange={set('heroBody')} textarea />
            <div className="md:col-span-2">
              <ImageField label="Hero Image" value={story.heroImage} onChange={set('heroImage')} />
            </div>
          </Section>

          <Section title="The Journey — Nigeria → Australia">
            <Field label="Title" value={story.journeyTitle} onChange={set('journeyTitle')} />
            <Field label="Body" value={story.journeyBody} onChange={set('journeyBody')} textarea />
            <div>
              <Field half label="'From' Label" value={story.journeyFromLabel} onChange={set('journeyFromLabel')} />
              <div className="mt-4">
                <ImageField label="'From' Image" value={story.journeyFromImage} onChange={set('journeyFromImage')} />
              </div>
            </div>
            <div>
              <Field half label="'To' Label" value={story.journeyToLabel} onChange={set('journeyToLabel')} />
              <div className="mt-4">
                <ImageField label="'To' Image" value={story.journeyToImage} onChange={set('journeyToImage')} />
              </div>
            </div>
          </Section>

          <Section title="The Designer">
            <Field half label="Name" value={story.designerName} onChange={set('designerName')} />
            <Field half label="Title" value={story.designerTitle} onChange={set('designerTitle')} />
            <Field label="Bio" value={story.designerBio} onChange={set('designerBio')} textarea />
            <div className="md:col-span-2">
              <ImageField label="Designer Image" value={story.designerImage} onChange={set('designerImage')} />
            </div>
          </Section>

          <Section title="Sourcing">
            <Field label="Title" value={story.sourcingTitle} onChange={set('sourcingTitle')} />
            <Field label="Body" value={story.sourcingBody} onChange={set('sourcingBody')} textarea />
            <div className="md:col-span-2">
              <ImageField label="Sourcing Image" value={story.sourcingImage} onChange={set('sourcingImage')} />
            </div>
          </Section>

          <Section title="Closing Quote">
            <Field label="Quote" value={story.quote} onChange={set('quote')} textarea />
            <Field half label="Attribution" value={story.quoteAuthor} onChange={set('quoteAuthor')} />
          </Section>

          <div className="pt-2 pb-8">
            <button type="submit" disabled={saving} className="bg-black text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}
    </AdminLayout>
  );
}
