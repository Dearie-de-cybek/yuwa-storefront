# YUWA Storefront

Next.js 15 storefront + admin, Prisma/PostgreSQL, Cloudinary media, Resend email.

## Local dev

```
npm install
cp .env.example .env   # fill in DATABASE_URL, JWT_SECRET, etc.
npm run prisma:migrate
npm run dev
```

## Deploying to Railway

1. Create a Railway project, add a **Postgres** plugin.
2. Deploy this repo as a service; set `DATABASE_URL` to `${{Postgres.DATABASE_URL}}`.
3. Set the remaining env vars from `.env.example` (`JWT_SECRET`, `RESEND_API_KEY`,
   `RESEND_FROM_EMAIL`, `CLOUDINARY_*`).
4. Railway runs `npm run build` then `npm run start`; `start` applies pending
   Prisma migrations (`prisma migrate deploy`) before booting `next start`.
