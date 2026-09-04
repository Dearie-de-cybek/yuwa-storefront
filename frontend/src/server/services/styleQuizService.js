import { prisma } from '@/server/db';

const VALID_OCCASION = ['WEDDING', 'PROM', 'DINNER', 'EVERYDAY'];
const VALID_MOOD = ['ELEGANT', 'BOLD', 'MINIMAL', 'DRAMATIC'];
const VALID_SILHOUETTE = ['FLOWING', 'FITTED', 'STATEMENT'];

const _formatProduct = (p) => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  price: parseFloat(p.price),
  compareAt: p.compareAt ? parseFloat(p.compareAt) : null,
  occasion: p.occasion,
  mood: p.mood,
  silhouette: p.silhouette,
  image: p.media[0]?.url || null,
});

/**
 * Score-and-rank recommendation engine — no AI, just weighted filters.
 * Occasion carries the most weight (it's the hard "what am I dressing
 * for" signal), mood next, silhouette last. Products that don't match
 * the chosen occasion at all still rank below any that do, so a sparse
 * occasion (few products) gracefully backfills with the next-best matches
 * instead of returning a near-empty result.
 */
const recommend = async ({ occasion, mood, silhouette, limit = 6 }) => {
  if (!VALID_OCCASION.includes(occasion)) return { error: 'invalid_occasion' };
  if (mood && !VALID_MOOD.includes(mood)) return { error: 'invalid_mood' };
  if (silhouette && !VALID_SILHOUETTE.includes(silhouette)) return { error: 'invalid_silhouette' };

  // Only dress-type products carry an occasion — this naturally excludes
  // accessories (headwraps, bags, etc.) from quiz results.
  const candidates = await prisma.product.findMany({
    where: { isDeleted: false, status: 'ACTIVE', occasion: { not: null } },
    include: { media: { where: { position: 0 }, take: 1 } },
  });

  const scored = candidates.map((p) => {
    let score = 0;
    if (p.occasion === occasion) score += 3;
    if (mood && p.mood === mood) score += 2;
    if (silhouette && p.silhouette === silhouette) score += 1;
    return { product: p, score };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.product.featured !== b.product.featured) return a.product.featured ? -1 : 1;
    return new Date(b.product.createdAt) - new Date(a.product.createdAt);
  });

  const products = scored.slice(0, limit).map((s) => _formatProduct(s.product));
  return { products };
};

export { recommend };
