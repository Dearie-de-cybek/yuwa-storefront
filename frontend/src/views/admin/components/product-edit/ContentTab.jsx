import { useState } from 'react';
import { Section, Field, IconButton } from './ui';
import { ChevronDown, ChevronUp, Plus, Trash2, GripVertical } from 'lucide-react';

const SECTION_CONFIG = {
  DETAILS: {
    title: 'Product Details',
    description: 'Key features and highlights shown on the product page.',
    placeholder: 'e.g. Handcrafted in Lagos, Hidden side pockets, Floor-length silhouette',
  },
  SIZE_FIT: {
    title: 'Size & Fit',
    description: 'Fit guidance and model measurements.',
    placeholder: "e.g. Model is 5'9\" wearing size M, Relaxed flowing fit",
  },
  FABRIC_CARE: {
    title: 'Fabric & Care',
    description: 'Material composition and care instructions.',
    placeholder: 'e.g. 100% Silk Adire, Dry clean only, Iron on low heat inside-out',
  },
  SHIPPING_RETURNS: {
    title: 'Shipping & Returns',
    description: 'Delivery and return policy details.',
    placeholder: 'e.g. Free shipping on orders over ₦50,000, 14-day return policy',
  },
};

export default function ContentTab({ contentSections, updateField }) {

  const updateSection = (type, newContent) => {
    const updated = contentSections.map((s) =>
      s.type === type ? { ...s, content: newContent } : s
    );
    updateField('contentSections', updated);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        These sections appear as accordions on the product detail page. 
        Add a description and list items for each section.
      </p>

      {contentSections.map((section) => (
        <ContentSectionEditor
          key={section.type}
          section={section}
          config={SECTION_CONFIG[section.type] || { title: section.title, description: '', placeholder: '' }}
          onChange={(newContent) => updateSection(section.type, newContent)}
        />
      ))}
    </div>
  );
}

// ============================================================
// Single content section editor
// Stores as a single string but provides a description + list UI
// Format: First line = description paragraph, remaining lines = list items
// ============================================================
function ContentSectionEditor({ section, config, onChange }) {
  const [expanded, setExpanded] = useState(true);

  // Parse content: first paragraph = description, remaining lines = list items
  const lines = (section.content || '').split('\n').filter(Boolean);
  const description = lines[0] || '';
  const listItems = lines.slice(1);

  // Rebuild the content string from description + list items
  const rebuildContent = (desc, items) => {
    const parts = [desc, ...items].filter(Boolean);
    return parts.join('\n');
  };

  const handleDescriptionChange = (value) => {
    onChange(rebuildContent(value, listItems));
  };

  const handleItemChange = (index, value) => {
    const updated = [...listItems];
    updated[index] = value;
    onChange(rebuildContent(description, updated));
  };

  const addItem = () => {
    onChange(rebuildContent(description, [...listItems, '']));
  };

  const removeItem = (index) => {
    const updated = listItems.filter((_, i) => i !== index);
    onChange(rebuildContent(description, updated));
  };

  const hasContent = section.content?.trim().length > 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${hasContent ? 'bg-green-500' : 'bg-gray-300'}`} />
          <div className="text-left">
            <h3 className="font-bold text-sm">{config.title}</h3>
            <p className="text-xs text-gray-400">{config.description}</p>
          </div>
        </div>
        {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>

      {/* Body */}
      {expanded && (
        <div className="px-6 pb-6 space-y-4 border-t border-gray-100 pt-4">
          {/* Description paragraph */}
          <Field label="Description">
            <textarea
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder={`Describe the ${config.title.toLowerCase()}...`}
              rows="3"
              className="input-field resize-y text-sm"
            />
          </Field>

          {/* List items */}
          <Field label="Details List">
            <div className="space-y-2">
              {listItems.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-gray-300 text-xs w-4 text-center">{i + 1}</span>
                  <input
                    value={item}
                    onChange={(e) => handleItemChange(i, e.target.value)}
                    placeholder={config.placeholder}
                    className="input-field flex-1 text-sm"
                  />
                  <IconButton onClick={() => removeItem(i)} icon={Trash2} danger size={14} />
                </div>
              ))}
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-black transition-colors pl-6"
              >
                <Plus size={12} /> Add item
              </button>
            </div>
          </Field>
        </div>
      )}
    </div>
  );
}