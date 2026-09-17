import { prisma } from '@/server/db';

const _format = (p) => ({
  ...p,
  discountValue: parseFloat(p.discountValue),
  minOrderAmount: p.minOrderAmount != null ? parseFloat(p.minOrderAmount) : null,
});

export const list = async () => {
  const promos = await prisma.promotion.findMany({ orderBy: { createdAt: 'desc' } });
  return promos.map(_format);
};

export const create = async (data) => {
  const { title, code, discountType, discountValue, minOrderAmount, maxUses, startDate, endDate } = data;

  if (!title || !code || !discountType || discountValue == null || discountValue === '') {
    return { error: 'missing_fields' };
  }
  if (!['PERCENTAGE', 'FIXED'].includes(discountType)) return { error: 'invalid_type' };

  const exists = await prisma.promotion.findUnique({ where: { code } });
  if (exists) return { error: 'code_exists' };

  const promo = await prisma.promotion.create({
    data: {
      title,
      code: code.toUpperCase(),
      discountType,
      discountValue: parseFloat(discountValue),
      scope: 'GLOBAL',
      minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : null,
      maxUses: maxUses ? parseInt(maxUses) : null,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : new Date(Date.now() + 30 * 864e5),
    },
  });

  return { promo: _format(promo) };
};

export const toggle = async (id) => {
  const promo = await prisma.promotion.findUnique({ where: { id } });
  if (!promo) return { error: 'not_found' };
  const updated = await prisma.promotion.update({ where: { id }, data: { isActive: !promo.isActive } });
  return { promo: _format(updated) };
};

export const remove = async (id) => {
  const promo = await prisma.promotion.findUnique({ where: { id } });
  if (!promo) return { error: 'not_found' };
  await prisma.promotion.delete({ where: { id } });
  return { success: true };
};
