// Pure helpers usable from both server components and client components.

const PRESET_COLORS = [
  { name: 'Emerald', value: '#50C878' },
  { name: 'Indigo', value: '#3F51B5' },
  { name: 'Gold', value: '#D4A017' },
  { name: 'Ivory', value: '#FFFFF0' },
  { name: 'Burgundy', value: '#800020' },
  { name: 'Royal Blue', value: '#4169E1' },
  { name: 'Coral', value: '#FF7F50' },
  { name: 'Champagne', value: '#F7E7CE' },
  { name: 'Black', value: '#1A1A1A' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Teal', value: '#008080' },
  { name: 'Plum', value: '#8E4585' },
  { name: 'Clay', value: '#C15B28' },
  { name: 'Noir', value: '#000000' },
];

export const getColorHex = (colorName) => {
  const found = PRESET_COLORS.find((c) => c.name.toLowerCase() === colorName?.toLowerCase());
  return found ? found.value : '#cccccc';
};

const PLACEHOLDER = 'https://via.placeholder.com/600x800?text=No+Image';

// Map a productService list item into the shape ProductCard / Shop expects.
export function mapProductList(p) {
  const raw = p.variants || [];
  const sizes = [...new Set(raw.map((v) => v.size).filter(Boolean))];
  const colors = [...new Set(raw.map((v) => v.color).filter(Boolean))];

  let variants = colors.map((color) => {
    const v = raw.find((x) => x.color === color);
    return { id: v?.id || color, colorName: color, type: 'color', value: getColorHex(color), image: p.image || PLACEHOLDER };
  });
  if (variants.length === 0) {
    variants = [{ id: 'default', colorName: 'Default', type: 'color', value: '#E5E5E5', image: p.image || PLACEHOLDER }];
  }

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category?.name || 'Uncategorized',
    fabric: p.material || 'Mixed',
    price: p.price,
    compareAt: p.compareAt,
    sizes,
    colors,
    tag: p.featured ? 'Featured' : p.compareAt ? 'Sale' : null,
    variants,
    image: p.image || PLACEHOLDER,
  };
}
