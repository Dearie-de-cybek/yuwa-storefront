import { prisma } from '@/server/db';

const FIT_LABELS = {
  RUNS_SMALL: 'Runs Small',
  SLIGHTLY_SMALL: 'Slightly Small',
  TRUE_TO_SIZE: 'True to Size',
  SLIGHTLY_LARGE: 'Slightly Large',
  RUNS_LARGE: 'Runs Large',
};
const LABEL_TO_FIT = Object.fromEntries(Object.entries(FIT_LABELS).map(([k, v]) => [v, k]));

const _format = (r) => ({
  id: r.id,
  rating: r.rating,
  title: r.title,
  content: r.content,
  fit: r.fit ? FIT_LABELS[r.fit] : null,
  name: r.user ? `${r.user.firstName} ${(r.user.lastName || '').charAt(0)}.`.trim() : 'Anonymous',
  verified: true,
  images: (r.media || []).map((m) => m.url),
  createdAt: r.createdAt,
});

// Approved reviews for a product + summary.
export const listByProduct = async (productId) => {
  const reviews = await prisma.review.findMany({
    where: { productId, isApproved: true },
    include: { user: { select: { firstName: true, lastName: true } }, media: true },
    orderBy: { createdAt: 'desc' },
  });
  const count = reviews.length;
  const average = count ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;
  return {
    reviews: reviews.map(_format),
    summary: { average: Math.round(average * 10) / 10, count },
  };
};

// Create (or update) the current user's review for a product.
export const create = async (userId, productId, data) => {
  const rating = parseInt(data.rating);
  if (!rating || rating < 1 || rating > 5) return { error: 'invalid_rating' };

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return { error: 'product_not_found' };

  const fit = data.fit ? LABEL_TO_FIT[data.fit] || null : null;

  const review = await prisma.review.upsert({
    where: { userId_productId: { userId, productId } },
    update: { rating, title: data.title || null, content: data.content || null, fit },
    create: {
      userId,
      productId,
      rating,
      title: data.title || null,
      content: data.content || null,
      fit,
      isApproved: true, // auto-approve so it shows immediately
    },
    include: { user: { select: { firstName: true, lastName: true } }, media: true },
  });

  return { review: _format(review) };
};
