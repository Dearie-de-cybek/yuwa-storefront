import { useState } from 'react';
import { Section, Field } from './ui';
import { Star, Plus, ChevronDown } from 'lucide-react';

// ── Default Bubu categories (extendable by admin) ──
const DEFAULT_CATEGORIES = [
  'Luxury Bubu',
  'Ready-to-Wear',
  'Bridal Collection',
  'Aso-Oke',
  'Adire',
  'Casual Bubu',
  'Accessories',
];

const STATUS_CONFIG = {
  DRAFT:    { label: 'Draft',     color: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-500' },
  ACTIVE:   { label: 'Published', color: 'bg-green-100 text-green-800',  dot: 'bg-green-500' },
  ARCHIVED: { label: 'Archived',  color: 'bg-gray-100 text-gray-500',    dot: 'bg-gray-400' },
};

export default function GeneralTab({ form, handleChange, updateField }) {
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  // Merge default categories with whatever the product already has
  const categories = [...new Set([...DEFAULT_CATEGORIES, form.category].filter(Boolean))];

  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (trimmed) {
      updateField('category', trimmed);
      setNewCategory('');
      setShowNewCategory(false);
    }
  };

  const statusConf = STATUS_CONFIG[form.status] || STATUS_CONFIG.DRAFT;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* ── Left: Main info ── */}
      <div className="lg:col-span-2 space-y-6">
        <Section title="General Information">
          <Field label="Product Name">
            <input
              name="name"
              value={form.name}
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
                value={form.price}
                onChange={handleChange}
                className="input-field"
                min="0"
                step="0.01"
                required
              />
            </Field>
            <Field label="Compare at Price (₦)" hint="Strikethrough price for sales">
              <input
                type="number"
                name="compareAt"
                value={form.compareAt}
                onChange={handleChange}
                className="input-field"
                min="0"
                step="0.01"
                placeholder="Was ₦..."
              />
            </Field>
          </div>

          {/* ── Category Dropdown ── */}
          <Field label="Category">
            {!showNewCategory ? (
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="input-field appearance-none pr-10"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewCategory(true)}
                  className="px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition-colors flex items-center gap-1"
                >
                  <Plus size={14} /> New
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="e.g. Evening Bubu"
                  className="input-field flex-1"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewCategory(false)}
                  className="px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </Field>

          <Field label="Description">
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="6"
              className="input-field resize-y"
              placeholder="Describe your masterpiece..."
            />
          </Field>
        </Section>
      </div>

      {/* ── Right: Sidebar ── */}
      <div className="space-y-6">
        <Section title="Status">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Current</span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConf.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusConf.dot}`} />
              {statusConf.label}
            </span>
          </div>
          <label className="flex items-center gap-3 cursor-pointer pt-2">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300 accent-yellow-500"
            />
            <span className="text-sm flex items-center gap-1">
              <Star size={14} className="text-yellow-500" />
              Featured Product
            </span>
          </label>
        </Section>

        <Section title="Material / Fabric">
          <textarea
            name="material"
            value={form.material}
            onChange={handleChange}
            placeholder="e.g. 100% Adire Silk from Abeokuta"
            className="input-field resize-y h-24"
          />
        </Section>
      </div>
    </div>
  );
}