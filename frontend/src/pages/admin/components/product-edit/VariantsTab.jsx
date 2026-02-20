import { useState } from 'react';
import { Section, Field, IconButton } from './ui';
import { Plus, Trash2, ChevronDown, ChevronUp, Copy } from 'lucide-react';

// ── Preset colors for African luxury fabrics ──
const PRESET_COLORS = [
  { name: 'Emerald',    hex: '#50C878' },
  { name: 'Indigo',     hex: '#3F51B5' },
  { name: 'Gold',       hex: '#D4A017' },
  { name: 'Ivory',      hex: '#FFFFF0' },
  { name: 'Burgundy',   hex: '#800020' },
  { name: 'Royal Blue', hex: '#4169E1' },
  { name: 'Coral',      hex: '#FF7F50' },
  { name: 'Champagne',  hex: '#F7E7CE' },
  { name: 'Black',      hex: '#1A1A1A' },
  { name: 'White',      hex: '#FFFFFF' },
  { name: 'Teal',       hex: '#008080' },
  { name: 'Plum',       hex: '#8E4585' },
];

// ── Standard sizes ──
const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'One Size', 'Custom'];

export default function VariantsTab({ variants, updateField }) {

  const updateVariant = (index, field, value) => {
    const updated = variants.map((v, i) => (i === index ? { ...v, [field]: value } : v));
    updateField('variants', updated);
  };

  // FIXED: Added safe fallback `|| {}` so typing in Fabric/Pattern doesn't crash
  const updateAttribute = (index, key, value) => {
    const updated = variants.map((v, i) =>
      i === index ? { ...v, attributes: { ...(v.attributes || {}), [key]: value } } : v
    );
    updateField('variants', updated);
  };

  const addVariant = () => {
    updateField('variants', [
      ...variants,
      { color: '', size: '', stock: 0, price: '', weight: '', barcode: '', attributes: {} },
    ]);
  };

  // NEW: Instantly duplicate a variant so you don't have to re-type everything for M, L, XL
  const duplicateVariant = (index) => {
    const toCopy = variants[index];
    const newVariants = [...variants];
    // Insert a copy right underneath, but clear the size so you can pick the next one
    newVariants.splice(index + 1, 0, { ...toCopy, size: '' }); 
    updateField('variants', newVariants);
  };

  const removeVariant = (index) => {
    updateField('variants', variants.filter((_, i) => i !== index));
  };

  return (
    <Section
      title="Variants (SKUs)"
      subtitle="1 Card = 1 Physical Item. If you have S, M, and L, create 3 variants using the duplicate button."
      actions={
        <button
          type="button"
          onClick={addVariant}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white rounded-lg text-xs hover:bg-gray-800 transition-colors"
        >
          <Plus size={14} /> Add Variant
        </button>
      }
    >
      {variants.length === 0 ? (
        <EmptyState onAdd={addVariant} />
      ) : (
        <div className="space-y-4">
          {variants.map((v, i) => (
            <VariantCard
              key={i}
              variant={v}
              index={i}
              onUpdate={(field, val) => updateVariant(i, field, val)}
              onUpdateAttribute={(key, val) => updateAttribute(i, key, val)}
              onDuplicate={() => duplicateVariant(i)}
              onRemove={() => removeVariant(i)}
            />
          ))}
        </div>
      )}
    </Section>
  );
}

// ── Empty state ──
function EmptyState({ onAdd }) {
  return (
    <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
      <p className="text-gray-400 text-sm mb-3">No variants yet</p>
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
      >
        <Plus size={14} /> Add First Variant
      </button>
    </div>
  );
}

// ── Single variant card ──
function VariantCard({ variant, index, onUpdate, onUpdateAttribute, onDuplicate, onRemove }) {
  const [expanded, setExpanded] = useState(true);
  const [showCustomColor, setShowCustomColor] = useState(false);

  const colorLabel = variant.color || 'Untitled';

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-gray-100">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-3 text-left flex-1"
        >
          {variant.color && (
            <span
              className="w-5 h-5 rounded-full border border-gray-300 flex-shrink-0"
              style={{ backgroundColor: getColorHex(variant.color) }}
            />
          )}
          <span className="text-sm font-medium">
            {colorLabel} — {variant.size || 'Size Required'}{' '}
            <span className="text-gray-400 font-normal">({variant.stock || 0} in stock)</span>
          </span>
          {expanded ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
        </button>
        
        <div className="flex items-center gap-2">
          {/* NEW: Duplicate Button */}
          <button 
            type="button" 
            onClick={onDuplicate}
            className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded transition-colors"
            title="Duplicate for next size"
          >
            <Copy size={16} />
          </button>
          <div className="w-[1px] h-4 bg-gray-200 mx-1" />
          <IconButton onClick={onRemove} icon={Trash2} danger title="Remove variant" />
        </div>
      </div>

      {/* Body */}
      {expanded && (
        <div className="px-5 pb-5 pt-4 space-y-6">
          
          {/* Row 1: Color picker */}
          <Field label="1. Select Color" compact>
            <div className="flex flex-wrap gap-2 mb-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => { onUpdate('color', c.name); setShowCustomColor(false); }}
                  title={c.name}
                  className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                    variant.color === c.name
                      ? 'border-black ring-2 ring-black ring-offset-2'
                      : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
              <button
                type="button"
                onClick={() => setShowCustomColor(!showCustomColor)}
                className={`w-8 h-8 rounded-full border-2 border-dashed flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all ${
                  showCustomColor ? 'border-black' : 'border-gray-300'
                }`}
              >
                <Plus size={12} />
              </button>
            </div>
            {showCustomColor && (
              <div className="flex gap-2 mt-2">
                <input
                  value={variant.color}
                  onChange={(e) => onUpdate('color', e.target.value)}
                  placeholder="Custom color name"
                  className="input-field flex-1 text-sm"
                />
              </div>
            )}
          </Field>

          {/* Row 2: Size */}
          <Field label="2. Select Exact Size" compact>
            <div className="flex flex-wrap gap-2">
              {SIZE_OPTIONS.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => onUpdate('size', size)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    variant.size === size
                      ? 'bg-black text-white border-black shadow-md'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </Field>

          {/* Row 3: Stock, price, weight, barcode */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
            <Field label="Stock Count" compact>
              <input
                type="number"
                value={variant.stock || ''}
                onChange={(e) => onUpdate('stock', parseInt(e.target.value) || 0)}
                className="input-field text-sm font-medium"
                min="0"
                placeholder="0"
              />
            </Field>
            <Field label="Price Override (₦)" compact>
              <input
                type="number"
                value={variant.price || ''}
                onChange={(e) => onUpdate('price', e.target.value)}
                placeholder="Inherit base"
                className="input-field text-sm"
                min="0"
                step="0.01"
              />
            </Field>
            <Field label="Weight (g)" compact>
              <input
                type="number"
                value={variant.weight || ''}
                onChange={(e) => onUpdate('weight', e.target.value)}
                placeholder="e.g. 250"
                className="input-field text-sm"
                min="0"
              />
            </Field>
            <Field label="Barcode" compact>
              <input
                value={variant.barcode || ''}
                onChange={(e) => onUpdate('barcode', e.target.value)}
                placeholder="Optional"
                className="input-field text-sm"
              />
            </Field>
          </div>

          {/* Row 4: Extended attributes */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Fabric Type" compact>
              <input
                value={variant.attributes?.fabricType || ''}
                onChange={(e) => onUpdateAttribute('fabricType', e.target.value)}
                placeholder="e.g. Aso-Oke, Silk Adire"
                className="input-field text-sm"
              />
            </Field>
            <Field label="Pattern" compact>
              <input
                value={variant.attributes?.pattern || ''}
                onChange={(e) => onUpdateAttribute('pattern', e.target.value)}
                placeholder="e.g. Geometric, Floral"
                className="input-field text-sm"
              />
            </Field>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Helper ──
function getColorHex(name) {
  const found = PRESET_COLORS.find((c) => c.name.toLowerCase() === name.toLowerCase());
  return found ? found.hex : '#ccc';
}