import { useRef } from 'react';
import { Section, IconButton, AddButton } from './ui';
import { Plus, Trash2, ChevronUp, ChevronDown, Image as ImageIcon, Film, Upload } from 'lucide-react';

export default function MediaTab({ media, updateField }) {

  // ── Handlers ──
  const addMedia = (url, type = 'IMAGE') => {
    updateField('media', [
      ...media,
      { url, altText: '', type, position: media.length },
    ]);
  };

  const updateMedia = (index, field, value) => {
    const updated = media.map((m, i) => (i === index ? { ...m, [field]: value } : m));
    updateField('media', updated);
  };

  const removeMedia = (index) => {
    updateField(
      'media',
      media.filter((_, i) => i !== index).map((m, i) => ({ ...m, position: i }))
    );
  };

  const moveMedia = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= media.length) return;
    const arr = [...media];
    [arr[index], arr[target]] = [arr[target], arr[index]];
    updateField('media', arr.map((m, i) => ({ ...m, position: i })));
  };

  // ── File picker handler ──
  // For now, this creates an object URL preview.
  // In production, you'd upload to your CDN and use the returned URL.
  const fileInputRef = useRef(null);
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const isVideo = file.type.startsWith('video/');
      // In production: upload file to CDN, get back URL
      // For dev: use object URL as preview
      const url = URL.createObjectURL(file);
      addMedia(url, isVideo ? 'VIDEO' : 'IMAGE');
    });
    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  return (
    <Section
      title="Product Media"
      subtitle="First image is the hero. Click 'Add' or drag to reorder."
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* ── Upload area ── */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="w-full border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center gap-3 hover:border-gray-400 hover:bg-gray-50/50 transition-colors group"
      >
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
          <Upload size={20} className="text-gray-400" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600">Click to upload images or video</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP, MP4 — Max 10MB</p>
        </div>
      </button>

      {/* ── URL input for CDN links ── */}
      <div className="flex gap-2">
        <input
          id="media-url-input"
          type="text"
          placeholder="Or paste a CDN image URL..."
          className="input-field flex-1 text-sm"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const url = e.target.value.trim();
              if (url) {
                addMedia(url);
                e.target.value = '';
              }
            }
          }}
        />
        <button
          type="button"
          onClick={() => {
            const input = document.getElementById('media-url-input');
            const url = input?.value?.trim();
            if (url) {
              addMedia(url);
              input.value = '';
            }
          }}
          className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          Add URL
        </button>
      </div>

      {/* ── Media grid ── */}
      {media.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {media.map((m, i) => (
            <MediaCard
              key={i}
              item={m}
              index={i}
              isFirst={i === 0}
              isLast={i === media.length - 1}
              onUpdate={(field, val) => updateMedia(i, field, val)}
              onRemove={() => removeMedia(i)}
              onMoveUp={() => moveMedia(i, -1)}
              onMoveDown={() => moveMedia(i, 1)}
            />
          ))}
        </div>
      )}
    </Section>
  );
}

// ── Individual media card ──
function MediaCard({ item, index, isFirst, isLast, onUpdate, onRemove, onMoveUp, onMoveDown }) {
  return (
    <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden group">
      {/* Preview */}
      <div className="relative aspect-square bg-gray-200">
        {item.url ? (
          item.type === 'VIDEO' ? (
            <video src={item.url} className="w-full h-full object-cover" muted />
          ) : (
            <img src={item.url} alt={item.altText || ''} className="w-full h-full object-cover" />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <ImageIcon size={32} />
          </div>
        )}

        {/* Hero badge */}
        {isFirst && (
          <span className="absolute top-2 left-2 text-[10px] font-bold uppercase bg-black text-white px-2 py-0.5 rounded">
            Hero
          </span>
        )}

        {/* Type badge */}
        <span className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded px-1.5 py-0.5 text-[10px] font-medium">
          {item.type === 'VIDEO' ? <Film size={10} className="inline mr-0.5" /> : <ImageIcon size={10} className="inline mr-0.5" />}
          {item.type}
        </span>

        {/* Overlay actions on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <IconButton onClick={onMoveUp} icon={ChevronUp} disabled={isFirst} title="Move up" />
          <IconButton onClick={onMoveDown} icon={ChevronDown} disabled={isLast} title="Move down" />
          <IconButton onClick={onRemove} icon={Trash2} danger title="Remove" />
        </div>
      </div>

      {/* Alt text input */}
      <div className="p-3">
        <input
          value={item.altText || ''}
          onChange={(e) => onUpdate('altText', e.target.value)}
          placeholder="Alt text..."
          className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-black transition-colors"
        />
      </div>
    </div>
  );
}