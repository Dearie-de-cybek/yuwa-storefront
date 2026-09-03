import { useState } from 'react';
import { Section, Field, IconButton } from './ui';
import { Plus, Trash2, ChevronDown, ChevronUp, Copy, Grid3X3, Palette, Scissors, Image, X, UploadCloud } from 'lucide-react';

// ============================================================
// EXPANDED COLOR PALETTE (RESTORED)
// ============================================================
const COLOR_GROUPS = [
  {
    label: 'Classics',
    colors: [
      { name: 'Black',      hex: '#1A1A1A' },
      { name: 'White',      hex: '#FFFFFF' },
      { name: 'Ivory',      hex: '#FFFFF0' },
      { name: 'Cream',      hex: '#FFFDD0' },
      { name: 'Champagne',  hex: '#F7E7CE' },
      { name: 'Silver',     hex: '#C0C0C0' },
      { name: 'Charcoal',   hex: '#36454F' },
    ],
  },
  {
    label: 'Warm Tones',
    colors: [
      { name: 'Gold',       hex: '#D4A017' },
      { name: 'Amber',      hex: '#FFBF00' },
      { name: 'Coral',      hex: '#FF7F50' },
      { name: 'Terracotta', hex: '#E2725B' },
      { name: 'Burnt Orange', hex: '#CC5500' },
      { name: 'Rust',       hex: '#B7410E' },
      { name: 'Burgundy',   hex: '#800020' },
      { name: 'Wine',       hex: '#722F37' },
      { name: 'Maroon',     hex: '#800000' },
    ],
  },
  {
    label: 'Cool Tones',
    colors: [
      { name: 'Royal Blue', hex: '#4169E1' },
      { name: 'Navy',       hex: '#000080' },
      { name: 'Indigo',     hex: '#3F51B5' },
      { name: 'Cobalt',     hex: '#0047AB' },
      { name: 'Teal',       hex: '#008080' },
      { name: 'Emerald',    hex: '#50C878' },
      { name: 'Forest Green', hex: '#228B22' },
      { name: 'Olive',      hex: '#808000' },
      { name: 'Sage',       hex: '#9CAF88' },
    ],
  },
  {
    label: 'Vibrant',
    colors: [
      { name: 'Fuchsia',    hex: '#FF00FF' },
      { name: 'Magenta',    hex: '#FF0090' },
      { name: 'Plum',       hex: '#8E4585' },
      { name: 'Lilac',      hex: '#C8A2C8' },
      { name: 'Lavender',   hex: '#E6E6FA' },
      { name: 'Rose',       hex: '#FF007F' },
      { name: 'Blush Pink', hex: '#DE5D83' },
      { name: 'Peach',      hex: '#FFCBA4' },
    ],
  },
  {
    label: 'Earth & Textile',
    colors: [
      { name: 'Khaki',      hex: '#C3B091' },
      { name: 'Sand',       hex: '#C2B280' },
      { name: 'Tan',        hex: '#D2B48C' },
      { name: 'Brown',      hex: '#8B4513' },
      { name: 'Chocolate',  hex: '#7B3F00' },
      { name: 'Copper',     hex: '#B87333' },
      { name: 'Bronze',     hex: '#CD7F32' },
      { name: 'Mahogany',   hex: '#C04000' },
    ],
  },
];

const ALL_COLORS = COLOR_GROUPS.flatMap((g) => g.colors);

// ============================================================
// FABRIC TYPES (CONVERTED TO OBJECTS)
// ============================================================
const FABRIC_PRESETS = [
  'Aso-Oke', 'Adire', 'Ankara', 'Kente', 'Lace (French)', 'Lace (Swiss)',
  'Lace (Cord)', 'Silk', 'Satin', 'Chiffon', 'Velvet', 'Brocade',
  'Organza', 'Damask', 'Cotton', 'Linen', 'Jacquard', 'George',
  'Atiku', 'Guinea Brocade', 'Kampala', 'Taffeta',
].map(name => ({ id: name.toLowerCase(), name, images: [] }));

// ============================================================
// SIZE OPTIONS (RESTORED)
// ============================================================
const SIZE_GROUPS = [
  { label: 'Letter', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'] },
  { label: 'Numeric', sizes: ['6', '8', '10', '12', '14', '16', '18', '20'] },
  { label: 'Special', sizes: ['One Size', 'Custom'] },
];

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function VariantsTab({ variants, updateField }) {
  const [variantType, setVariantType] = useState('color'); 

  // --- REFACTORED SELECTION STATE ---
  const [selectedColors, setSelectedColors] = useState([]); // Array of strings (names)
  const [selectedFabrics, setSelectedFabrics] = useState([]); // Array of Fabric objects
  const [selectedSizes, setSelectedSizes] = useState([]);

  // UI helpers for creation
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#888888');
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Custom Fabric Creation State
  const [customFabricName, setCustomFabricName] = useState('');
  const [customFabricPattern, setCustomFabricPattern] = useState('');
  const [customFabricImages, setCustomFabricImages] = useState([]);

  const toggleColor = (name) => {
    setSelectedColors((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const toggleFabric = (fabric) => {
    setSelectedFabrics((prev) =>
      prev.find(f => f.id === fabric.id) 
        ? prev.filter((f) => f.id !== fabric.id) 
        : [...prev, fabric]
    );
  };

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const addCustomColor = () => {
    if (!customColorName.trim()) return;
    const name = customColorName.trim();
    if (!selectedColors.includes(name)) setSelectedColors((prev) => [...prev, name]);
    setCustomColorName('');
    setShowColorPicker(false);
  };

  const handleCustomFabricUpload = (e) => {
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
    const newMedia = files.map(file => ({
      url: URL.createObjectURL(file),
      type: 'IMAGE',
      altText: customFabricName || 'Fabric upload'
    }));
    setCustomFabricImages(prev => [...prev, ...newMedia]);
  };

  const addCustomFabric = () => {
    if (!customFabricName.trim()) return;
    const newFabric = {
      id: `custom-${Date.now()}`,
      name: customFabricName.trim(),
      patternName: customFabricPattern.trim(),
      images: customFabricImages
    };
    setSelectedFabrics(prev => [...prev, newFabric]);
    setCustomFabricName('');
    setCustomFabricPattern('');
    setCustomFabricImages([]);
  };

  const generateVariants = () => {
    const isFabricMode = variantType === 'fabric';
    const activeSelection = isFabricMode ? selectedFabrics : selectedColors;

    if (activeSelection.length === 0 || selectedSizes.length === 0) return;
    
    const newVariants = [];
    
    activeSelection.forEach((item) => {
      // Determine naming/ID based on mode
      const displayName = isFabricMode ? item.name : item;
      const itemId = isFabricMode ? item.id : item;

      selectedSizes.forEach((size) => {
        // Compatibility Check: Does this specific combination exist?
        const exists = variants.some((v) => 
          (isFabricMode ? v.attributes?.fabricId === itemId : v.color === displayName) && v.size === size
        );

        if (!exists) {
          newVariants.push({
            color: displayName, // Preserving field for UI consistency
            size,
            stock: 0,
            price: '',
            weight: '',
            barcode: '',
            attributes: isFabricMode ? { 
              fabricId: item.id,
              fabricType: item.name, 
              patternName: item.patternName || '' 
            } : {},
            // INHERITANCE: If fabric mode, copy the fabric's initial images
            media: isFabricMode ? [...item.images] : [],
          });
        }
      });
    });

    if (newVariants.length === 0) return;
    updateField('variants', [...variants, ...newVariants]);
    setSelectedColors([]);
    setSelectedFabrics([]);
    setSelectedSizes([]);
  };

  const bulkSetStock = (stock) => {
    const updated = variants.map((v) => ({ ...v, stock: parseInt(stock) || 0 }));
    updateField('variants', updated);
  };

  const updateVariant = (index, field, value) => {
    const updated = variants.map((v, i) => (i === index ? { ...v, [field]: value } : v));
    updateField('variants', updated);
  };

  const updateAttribute = (index, key, value) => {
    const updated = variants.map((v, i) =>
      i === index ? { ...v, attributes: { ...(v.attributes || {}), [key]: value } } : v
    );
    updateField('variants', updated);
  };

  const removeVariant = (index) => {
    updateField('variants', variants.filter((_, i) => i !== index));
  };

  const duplicateVariant = (index) => {
    const copy = { ...variants[index], size: '' };
    const next = [...variants];
    next.splice(index + 1, 0, copy);
    updateField('variants', next);
  };

  const comboCount = (variantType === 'color' ? selectedColors.length : selectedFabrics.length) * selectedSizes.length;

  return (
    <Section
      title="Variants"
      subtitle="Select all colors/fabrics and sizes, then generate every combination at once."
    >
      {/* ── Mode + Type toggles ── */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setVariantType('color')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              variantType === 'color' ? 'bg-white shadow text-black' : 'text-gray-500'
            }`}
          >
            <Palette size={13} /> By Color
          </button>
          <button
            type="button"
            onClick={() => setVariantType('fabric')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              variantType === 'fabric' ? 'bg-white shadow text-black' : 'text-gray-500'
            }`}
          >
            <Scissors size={13} /> By Fabric
          </button>
        </div>
      </div>

      {/* STEP 1: SELECT COLORS OR FABRICS */}
      <div className="bg-gray-50 rounded-xl border border-gray-100 p-5 mb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
          Step 1 — Select {variantType === 'color' ? 'Colors' : 'Fabrics'}
          {(variantType === 'color' ? selectedColors.length : selectedFabrics.length) > 0 && (
            <span className="ml-2 bg-black text-white px-2 py-0.5 rounded-full text-[10px]">
              {variantType === 'color' ? selectedColors.length : selectedFabrics.length} selected
            </span>
          )}
        </p>

        {variantType === 'color' ? (
          <div className="space-y-4">
            {COLOR_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-2">{group.label}</p>
                <div className="flex flex-wrap gap-2">
                  {group.colors.map((c) => {
                    const isSelected = selectedColors.includes(c.name);
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => toggleColor(c.name)}
                        title={c.name}
                        className={`group relative w-9 h-9 rounded-full border-2 transition-all hover:scale-110 ${
                          isSelected ? 'border-black ring-2 ring-black ring-offset-2 scale-110' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      >
                        {isSelected && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className={`text-xs font-bold ${isLightColor(c.hex) ? 'text-black' : 'text-white'}`}>✓</span>
                          </span>
                        )}
                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                          {c.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="pt-2">
              {!showColorPicker ? (
                <button type="button" onClick={() => setShowColorPicker(true)} className="text-xs text-gray-500 hover:text-black flex items-center gap-1">
                  <Plus size={12} /> Custom color
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <input type="color" value={customColorHex} onChange={(e) => setCustomColorHex(e.target.value)} className="w-9 h-9 rounded-full border-0 cursor-pointer p-0" />
                  <input value={customColorName} onChange={(e) => setCustomColorName(e.target.value)} placeholder="Color name" className="input-field text-sm flex-1" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomColor())} />
                  <button type="button" onClick={addCustomColor} className="px-3 py-2 bg-black text-white text-xs rounded-lg">Add</button>
                  <button type="button" onClick={() => setShowColorPicker(false)} className="text-xs text-gray-400 hover:text-black">Cancel</button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2 mb-3">
              {FABRIC_PRESETS.map((fabric) => {
                const isSelected = selectedFabrics.some(f => f.id === fabric.id);
                return (
                  <button
                    key={fabric.id}
                    type="button"
                    onClick={() => toggleFabric(fabric)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${isSelected ? 'bg-black text-white border-black shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
                  >
                    {fabric.name}
                  </button>
                );
              })}
            </div>

            {/* Custom Fabric Creator */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-4 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Create Custom Fabric</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input value={customFabricName} onChange={(e) => setCustomFabricName(e.target.value)} placeholder="Fabric Name (e.g. Ankara)" className="input-field text-sm" />
                <input value={customFabricPattern} onChange={(e) => setCustomFabricPattern(e.target.value)} placeholder="Pattern (e.g. Midnight Geometry)" className="input-field text-sm" />
              </div>
              
              <div className="flex items-start gap-4">
                <label className="shrink-0 w-20 h-24 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors group">
                  <UploadCloud size={20} className="text-gray-400 group-hover:text-black" />
                  <span className="text-[9px] text-gray-500 font-bold mt-1">UPLOAD</span>
                  <input type="file" multiple accept="image/*" onChange={handleCustomFabricUpload} className="hidden" />
                </label>
                
                <div className="flex flex-wrap gap-2">
                  {customFabricImages.map((img, idx) => (
                    <div key={idx} className="relative w-20 h-24 rounded-lg overflow-hidden border border-gray-100">
                      <img src={img.url} className="w-full h-full object-cover" alt="preview" />
                      <button onClick={() => setCustomFabricImages(prev => prev.filter((_, i) => i !== idx))} className="absolute top-1 right-1 p-1 bg-white/80 rounded-full text-red-500 hover:bg-white"><X size={10} /></button>
                    </div>
                  ))}
                </div>
              </div>

              <button type="button" onClick={addCustomFabric} disabled={!customFabricName.trim()} className="w-full py-2.5 bg-gray-900 text-white text-xs rounded-lg font-bold disabled:opacity-20 transition-opacity">
                Add Fabric to Selection
              </button>
            </div>
          </div>
        )}

        {/* Selected Items Summary Bar */}
        {(variantType === 'color' ? selectedColors.length : selectedFabrics.length) > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-gray-200">
            {variantType === 'color' ? selectedColors.map((name) => (
              <span key={name} className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded-full text-xs">
                <span className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: getColorHex(name) }} />
                {name}
                <button type="button" onClick={() => toggleColor(name)} className="text-gray-400 hover:text-red-500 ml-0.5">×</button>
              </span>
            )) : selectedFabrics.map((f) => (
              <span key={f.id} className="inline-flex items-center gap-2 px-2 py-1 bg-white border border-gray-200 rounded-full text-xs">
                {f.images.length > 0 && <img src={f.images[0].url} className="w-4 h-4 rounded-full object-cover" alt="" />}
                {f.name} {f.patternName && <span className="text-gray-400 italic">({f.patternName})</span>}
                <button type="button" onClick={() => toggleFabric(f)} className="text-gray-400 hover:text-red-500 ml-0.5">×</button>
              </span>
            ))}
            <button type="button" onClick={() => { setSelectedColors([]); setSelectedFabrics([]); }} className="text-[10px] text-red-400 hover:text-red-600 uppercase tracking-wider font-bold ml-1">Clear all</button>
          </div>
        )}
      </div>

      {/* STEP 2: SELECT SIZES (RESTORED) */}
      <div className="bg-gray-50 rounded-xl border border-gray-100 p-5 mb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
          Step 2 — Select Sizes
          {selectedSizes.length > 0 && <span className="ml-2 bg-black text-white px-2 py-0.5 rounded-full text-[10px]">{selectedSizes.length} selected</span>}
        </p>

        {SIZE_GROUPS.map((group) => (
          <div key={group.label} className="mb-3 last:mb-0">
            <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-2">{group.label}</p>
            <div className="flex flex-wrap gap-2">
              {group.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium border transition-all ${selectedSizes.includes(size) ? 'bg-black text-white border-black shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
          <button type="button" onClick={() => setSelectedSizes(SIZE_GROUPS[0].sizes)} className="text-[10px] uppercase tracking-wider text-gray-400 hover:text-black font-bold">Select All Letter</button>
          <span className="text-gray-300">·</span>
          <button type="button" onClick={() => setSelectedSizes(SIZE_GROUPS[1].sizes)} className="text-[10px] uppercase tracking-wider text-gray-400 hover:text-black font-bold">Select All Numeric</button>
          <span className="text-gray-300">·</span>
          <button type="button" onClick={() => setSelectedSizes([])} className="text-[10px] uppercase tracking-wider text-red-400 hover:text-red-600 font-bold">Clear</button>
        </div>
      </div>

      {/* STEP 3: GENERATE */}
      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <div>
          <p className="text-sm font-medium">
            {comboCount > 0 ? <><span className="font-bold text-lg">{comboCount}</span> variant{comboCount !== 1 ? 's' : ''} will be generated</> : <span className="text-gray-400">Select options above</span>}
          </p>
        </div>
        <button type="button" onClick={generateVariants} disabled={comboCount === 0} className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg text-xs font-medium hover:bg-gray-800 disabled:opacity-30 transition-colors">
          <Grid3X3 size={14} /> Generate Variants
        </button>
      </div>

      {/* GENERATED VARIANTS LIST */}
      {variants.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{variants.length} Variant{variants.length !== 1 ? 's' : ''}</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500">Bulk stock:</label>
                <input type="number" min="0" placeholder="Set all" className="w-20 px-2 py-1 border border-gray-200 rounded text-xs text-center" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); bulkSetStock(e.target.value); e.target.value = ''; } }} />
              </div>
              <button type="button" onClick={() => updateField('variants', [])} className="text-[10px] text-red-400 hover:text-red-600 uppercase tracking-wider font-bold">Remove All</button>
            </div>
          </div>

          <div className="space-y-3">
            {variants.map((v, i) => (
              <VariantCard
                key={`${v.attributes?.fabricId || v.color}-${v.size}-${i}`}
                variant={v}
                index={i}
                variantType={v.attributes?.fabricId ? 'fabric' : 'color'}
                onUpdate={(field, val) => updateVariant(i, field, val)}
                onUpdateAttribute={(key, val) => updateAttribute(i, key, val)}
                onDuplicate={() => duplicateVariant(i)}
                onRemove={() => removeVariant(i)}
              />
            ))}
          </div>
        </>
      )}
    </Section>
  );
}

// ============================================================
// VARIANT CARD — MULTI-IMAGE GALLERY (STABLE)
// ============================================================

function VariantCard({ variant, index, variantType, onUpdate, onUpdateAttribute, onDuplicate, onRemove }) {
  const [expanded, setExpanded] = useState(false);
  const colorHex = variantType === 'color' ? getColorHex(variant.color) : null;
  const label = variant.color || 'Untitled';
  const variantMedia = variant.media || [];

  const handleMediaFiles = (e) => {
    const files = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
    const newMediaObjects = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: 'IMAGE',
      altText: `${label} image`
    }));
    onUpdate('media', [...variantMedia, ...newMediaObjects]);
  };

  const removeMedia = (indexToRemove) => {
    onUpdate('media', variantMedia.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow transition-shadow">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex items-center gap-1.5 shrink-0">
          {variantType === 'color' ? (
            <span className="w-6 h-6 rounded-full border border-gray-300" style={{ backgroundColor: colorHex }} />
          ) : (
            <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center">
              <Scissors size={14} className="text-gray-400" />
            </div>
          )}
        </div>

        <button type="button" onClick={() => setExpanded(!expanded)} className="flex items-center gap-2 flex-1 text-left min-w-0">
          <span className="text-sm font-bold truncate">{label}</span>
          <span className="text-xs text-gray-400">—</span>
          <span className="text-sm font-medium">{variant.size || '?'}</span>
          {variantMedia.length > 0 && (
            <span className="ml-2 px-1.5 py-0.5 bg-gray-100 rounded text-[10px] text-gray-500 font-bold uppercase">
              {variantMedia.length} {variantMedia.length === 1 ? 'img' : 'imgs'}
            </span>
          )}
          {expanded ? <ChevronUp size={12} className="text-gray-400 ml-auto" /> : <ChevronDown size={12} className="text-gray-400 ml-auto" />}
        </button>

        <div className="flex items-center gap-1 shrink-0">
          <input
            type="number"
            value={variant.stock || ''}
            onChange={(e) => onUpdate('stock', parseInt(e.target.value) || 0)}
            className="w-16 px-2 py-1 border border-gray-200 rounded text-xs text-center focus:border-black"
            min="0"
            placeholder="Stock"
          />
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button type="button" onClick={onDuplicate} className="p-1 text-gray-400 hover:text-black hover:bg-gray-100 rounded"><Copy size={14} /></button>
          <button type="button" onClick={onRemove} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-5 pt-3 border-t border-gray-100 bg-gray-50/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Field label="Price Override (₦)" compact>
              <input type="number" value={variant.price || ''} onChange={(e) => onUpdate('price', e.target.value)} placeholder="Inherit" className="input-field text-sm" />
            </Field>
            <Field label="Weight (g)" compact>
              <input type="number" value={variant.weight || ''} onChange={(e) => onUpdate('weight', e.target.value)} placeholder="250" className="input-field text-sm" />
            </Field>
            <Field label="Barcode" compact>
              <input value={variant.barcode || ''} onChange={(e) => onUpdate('barcode', e.target.value)} placeholder="Optional" className="input-field text-sm" />
            </Field>
            <Field label="SKU" compact>
              <input value={variant.sku || ''} readOnly placeholder="Auto" className="input-field text-sm bg-gray-100 text-gray-400" />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Field label="Fabric Type" compact>
              <input value={variant.attributes?.fabricType || ''} onChange={(e) => onUpdateAttribute('fabricType', e.target.value)} className="input-field text-sm" />
            </Field>
            <Field label="Pattern Name" compact>
              <input value={variant.attributes?.patternName || ''} onChange={(e) => onUpdateAttribute('patternName', e.target.value)} className="input-field text-sm" />
            </Field>
          </div>

          <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
              <Image size={12} /> Variant Gallery
            </h4>
            <div className="flex flex-wrap gap-4">
              {variantMedia.map((m, idx) => (
                <div key={idx} className="relative group w-24 h-32 rounded-lg border overflow-hidden shrink-0">
                  <img src={m.url} className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={() => removeMedia(idx)} className="bg-white text-red-600 p-2 rounded-full"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
              <label className="w-24 h-32 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-black transition-all shrink-0">
                <Plus size={20} className="text-gray-400" />
                <span className="text-[9px] text-gray-500 font-bold mt-1 uppercase">Add Photo</span>
                <input type="file" multiple accept="image/*" onChange={handleMediaFiles} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// HELPERS
// ============================================================
function getColorHex(name) {
  const found = ALL_COLORS.find((c) => c.name.toLowerCase() === name.toLowerCase());
  return found ? found.hex : '#cccccc';
}

function isLightColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 155;
}