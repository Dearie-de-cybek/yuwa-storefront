import { prisma } from '@/server/db';

const _format = (p) => ({
  id: p.id,
  imageUrl: p.imageUrl,
  city: p.city,
  handle: p.handle,
  caption: p.caption,
  product: p.product ? { id: p.product.id, name: p.product.name } : null,
  createdAt: p.createdAt,
});

// Public: active posts, newest first.
const list = async () => {
  const posts = await prisma.communityPost.findMany({
    where: { isActive: true },
    include: { product: { select: { id: true, name: true } } },
    orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
  });
  return posts.map(_format);
};

// Admin: every post (including inactive) for the management view.
const listAll = async () => {
  const posts = await prisma.communityPost.findMany({
    include: { product: { select: { id: true, name: true } } },
    orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
  });
  return posts.map(_format);
};

const create = async ({ imageUrl, city, handle, caption, productId }) => {
  if (!imageUrl || !city) return { error: 'missing_fields' };

  const post = await prisma.communityPost.create({
    data: { imageUrl, city, handle: handle || null, caption: caption || null, productId: productId || null },
    include: { product: { select: { id: true, name: true } } },
  });

  return { post: _format(post) };
};

const remove = async (id) => {
  const post = await prisma.communityPost.findUnique({ where: { id } });
  if (!post) return { error: 'not_found' };

  await prisma.communityPost.delete({ where: { id } });
  return { success: true };
};

const toggleActive = async (id) => {
  const post = await prisma.communityPost.findUnique({ where: { id } });
  if (!post) return { error: 'not_found' };

  const updated = await prisma.communityPost.update({
    where: { id },
    data: { isActive: !post.isActive },
    include: { product: { select: { id: true, name: true } } },
  });

  return { post: _format(updated) };
};

export { list, listAll, create, remove, toggleActive };
