import { prisma } from '@/server/db';

const VALID_OCCASIONS = ['WEDDING', 'PROM', 'DINNER', 'EVERYDAY'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Join the waitlist for a not-yet-launched occasion. Idempotent per email+occasion.
export const join = async (email, occasion) => {
  if (!email || !EMAIL_RE.test(email)) return { error: 'invalid_email' };
  if (!VALID_OCCASIONS.includes(occasion)) return { error: 'invalid_occasion' };

  const entry = await prisma.waitlistEntry.upsert({
    where: { email_occasion: { email, occasion } },
    update: {},
    create: { email, occasion },
  });

  return { entry };
};
