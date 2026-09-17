// Config for the "Find Your Signature" persona quiz. Maps its own
// vocabulary onto the existing Occasion/Mood/Silhouette signals (plus a
// free-text material keyword) so it can reuse the same recommendation
// engine as the Style Quiz — no parallel scoring logic, no schema bloat.

export const ENTRANCES = [
  {
    value: 'QUIET_LUXURY',
    label: 'Quiet luxury',
    persona: 'The Quiet Luxury Muse',
    description: "You don't need to shout. Exceptional fabric, restraint, and a presence that lingers after you leave the room.",
    mood: 'ELEGANT',
    silhouette: 'FITTED',
  },
  {
    value: 'EVERYBODY_LOOKS',
    label: 'Everybody looks',
    persona: 'The Showstopper',
    description: 'Every room shifts when you walk in. You dress to be remembered — and you always are.',
    mood: 'BOLD',
    silhouette: 'STATEMENT',
  },
  {
    value: 'SOFT_FEMININE',
    label: 'Soft & feminine',
    persona: 'The Romantic',
    description: 'Soft silhouettes, gentle movement, an old-world femininity that never goes out of style.',
    mood: 'ELEGANT',
    silhouette: 'FLOWING',
  },
  {
    value: 'BOLD_DRAMATIC',
    label: 'Bold & dramatic',
    persona: 'The Statement Queen',
    description: 'Volume, drama, unapologetic presence. You were born for the entrance, not the exit.',
    mood: 'DRAMATIC',
    silhouette: 'STATEMENT',
  },
];

export const OCCASIONS = [
  { value: 'WEDDING', label: 'Wedding', occasion: 'WEDDING' },
  { value: 'DINNER', label: 'Dinner', occasion: 'DINNER' },
  { value: 'CELEBRATION', label: 'Celebration', occasion: 'PROM' },
  { value: 'VACATION', label: 'Vacation', occasion: 'EVERYDAY' },
];

export const TEXTURES = [
  { value: 'SILK', label: 'Silk', keyword: 'silk' },
  { value: 'BROCADE', label: 'Brocade', keyword: 'brocade' },
  { value: 'LACE', label: 'Lace', keyword: 'lace' },
  { value: 'EMBROIDERY', label: 'Embroidery', keyword: 'embroid' },
];

export const entranceByValue = (v) => ENTRANCES.find((e) => e.value === v);
export const occasionByValue = (v) => OCCASIONS.find((o) => o.value === v);
export const textureByValue = (v) => TEXTURES.find((t) => t.value === v);
