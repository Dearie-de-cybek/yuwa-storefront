import { useState } from 'react';
import { Section, Field } from './ui';
import { Tag, X } from 'lucide-react';

export default function SeoTagsTab({ form, handleChange, updateField }) {
  const [tagInput, setTagInput] = useState('');

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !form.tags.includes(trimmed)) {
      updateField('tags', [...form.tags, trimmed]);
      setTagInput('');
    }
  };

  const removeTag = (index) => {
    updateField('tags', form.tags.filter((_, i) => i !== index));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
    // Backspace on empty input removes last tag
    if (e.key === 'Backspace' && !tagInput && form.tags.length > 0) {
      removeTag(form.tags.length - 1);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* ── SEO ── */}
      <Section title="Search Engine Optimization" subtitle="Customize how this product appears in Google.">
        <Field label="Meta Title" hint={`${(form.metaTitle || '').length}/70 characters`}>
          <input
            name="metaTitle"
            value={form.metaTitle}
            onChange={handleChange}
            className="input-field"
            placeholder="Custom title for search engines"
            maxLength={70}
          />
        </Field>
        <Field label="Meta Description" hint={`${(form.metaDescription || '').length}/160 characters`}>
          <textarea
            name="metaDescription"
            value={form.metaDescription}
            onChange={handleChange}
            className="input-field resize-y"
            placeholder="Brief description for search results"
            rows="3"
            maxLength={160}
          />
        </Field>

        {/* SEO Preview */}
        <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-xs text-gray-400 uppercase font-bold mb-2">Search Preview</p>
          <p className="text-blue-700 text-sm font-medium truncate">
            {form.metaTitle || form.name || 'Product Title'}
          </p>
          <p className="text-green-700 text-xs truncate">
            yuwa.com/products/{form.name ? form.name.toLowerCase().replace(/\s+/g, '-') : 'product-slug'}
          </p>
          <p className="text-gray-600 text-xs mt-1 line-clamp-2">
            {form.metaDescription || form.description?.slice(0, 160) || 'Product description will appear here...'}
          </p>
        </div>
      </Section>

      {/* ── Tags ── */}
      <Section title="Tags" subtitle="Tags help with filtering and search. Press Enter or comma to add.">
        {/* Tag chips */}
        <div className="flex flex-wrap gap-2 min-h-[2rem]">
          {form.tags.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm group"
            >
              <Tag size={12} className="text-gray-400" />
              {tag}
              <button
                type="button"
                onClick={() => removeTag(i)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={12} />
              </button>
            </span>
          ))}
          {form.tags.length === 0 && (
            <span className="text-sm text-gray-400 italic">No tags added yet</span>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            className="input-field flex-1"
            placeholder="e.g. silk, handmade, new-arrival"
          />
          <button
            type="button"
            onClick={addTag}
            disabled={!tagInput.trim()}
            className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-40"
          >
            Add
          </button>
        </div>

        {/* Suggested tags */}
        <div className="mt-2">
          <p className="text-xs text-gray-400 mb-2">Suggested</p>
          <div className="flex flex-wrap gap-1.5">
            {['handmade', 'silk', 'adire', 'aso-oke', 'luxury', 'bridal', 'new-arrival', 'limited-edition']
              .filter((t) => !form.tags.includes(t))
              .map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => updateField('tags', [...form.tags, tag])}
                  className="text-xs px-2.5 py-1 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  + {tag}
                </button>
              ))}
          </div>
        </div>
      </Section>
    </div>
  );
}