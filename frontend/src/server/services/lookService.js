import { prisma } from '@/server/db';

// Fixed presentation order regardless of how items were inserted.
const SLOT_ORDER = ['DRESS', 'HEADWRAP', 'BAG', 'JEWELLERY', 'SHOES', 'OTHER'];

const ITEMS_INCLUDE = {
  include: {
    product: {
      include: {
        media: { where: { position: 0 }, take: 1 },
        // One default variant per item so "Shop The Look" can add every
        // piece to the cart in a single click, same convention as
        // ProductCard's own quick-add (which uses variants[0]).
        variants: { where: { isActive: true }, take: 1, orderBy: { createdAt: 'asc' } },
      },
    },
  },
};

const _formatItem = (item) => {
  const variant = item.product.variants[0] || null;
  return {
    slot: item.slot,
    position: item.position,
    product: {
      id: item.product.id,
      name: item.product.name,
      slug: item.product.slug,
      price: variant?.price ? parseFloat(variant.price) : parseFloat(item.product.price),
      image: item.product.media[0]?.url || null,
    },
    defaultVariant: variant
      ? { id: variant.id, color: variant.color, size: variant.size, inStock: variant.stock > 0 }
      : null,
  };
};

const _formatLook = (look) => {
  const items = look.items
    .slice()
    .sort((a, b) => SLOT_ORDER.indexOf(a.slot) - SLOT_ORDER.indexOf(b.slot))
    .map(_formatItem);

  return {
    id: look.id,
    name: look.name,
    slug: look.slug,
    items,
    total: items.reduce((sum, i) => sum + i.product.price, 0),
  };
};

/**
 * Find the active Look(s) a given product belongs to (as any slot, not
 * just DRESS), with sibling items populated. Returns [] if the product
 * isn't styled into any Look yet.
 */
const findByProduct = async (productId) => {
  const looks = await prisma.look.findMany({
    where: { isActive: true, items: { some: { productId } } },
    include: { items: ITEMS_INCLUDE },
  });

  return looks.map(_formatLook);
};

export { findByProduct };
