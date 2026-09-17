'use client';

import { Section, Field, IconButton } from './ui';
import { Plus, Trash2 } from 'lucide-react';

// Reusable "add/remove text item" list editor — same pattern as
// ContentTab's detail list, used here for occasions and style-with items.
function ListEditor({ items, onChange, placeholder }) {
  const updateItem = (i, value) => {
    const updated = [...items];
    updated[i] = value;
    onChange(updated);
  };
  const addItem = () => onChange([...items, '']);
  const removeItem = (i) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            value={item}
            onChange={(e) => updateItem(i, e.target.value)}
            placeholder={placeholder}
            className="input-field flex-1 text-sm"
          />
          <IconButton onClick={() => removeItem(i)} icon={Trash2} danger size={14} />
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-black transition-colors"
      >
        <Plus size={12} /> Add item
      </button>
    </div>
  );
}

export default function StylingTab({ form, updateField }) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        Styling guidance shown on the product page — helps customers unfamiliar with the
        piece know when and how to wear it. Leave blank to hide the section entirely.
      </p>

      <Section title="The Look" subtitle="A short mood line, e.g. &ldquo;Effortless. Regal. Dramatic.&rdquo;">
        <Field label="Mood">
          <input
            value={form.wearMood}
            onChange={(e) => updateField('wearMood', e.target.value)}
            placeholder="Effortless. Regal. Dramatic."
            className="input-field text-sm"
          />
        </Field>
      </Section>

      <Section title="Wear It To" subtitle="Occasions this piece suits — shown as a checklist.">
        <ListEditor
          items={form.wearOccasions}
          onChange={(items) => updateField('wearOccasions', items)}
          placeholder="e.g. Weddings"
        />
      </Section>

      <Section title="Style It With" subtitle="Suggested accessories or pairings, in plain text.">
        <ListEditor
          items={form.wearStyleWith}
          onChange={(items) => updateField('wearStyleWith', items)}
          placeholder="e.g. Gold jewellery"
        />
      </Section>
    </div>
  );
}
