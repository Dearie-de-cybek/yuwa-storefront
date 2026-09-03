import { prisma } from '@/server/db';

const ID = 'singleton';

export const get = async () => {
  let s = await prisma.storeSetting.findUnique({ where: { id: ID } });
  if (!s) s = await prisma.storeSetting.create({ data: { id: ID } });
  return s;
};

export const update = async (data) => {
  return prisma.storeSetting.upsert({
    where: { id: ID },
    update: {
      storeName: data.storeName,
      currency: data.currency,
      supportEmail: data.supportEmail,
    },
    create: {
      id: ID,
      storeName: data.storeName || 'YUWA',
      currency: data.currency || 'NGN',
      supportEmail: data.supportEmail || 'help@yuwa.com',
    },
  });
};
