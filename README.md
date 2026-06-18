# White House Store

Bilingual Arabic/English Next.js storefront and admin panel for a premium men's fashion shop.

## Setup

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD`.
3. Install dependencies:

```bash
npm install
```

4. Create the MySQL schema and seed starter content:

```bash
npm run prisma:migrate
npm run prisma:seed
```

5. Run the app:

```bash
npm run dev
```

Arabic storefront is available at `/`, English at `/en`, and admin at `/admin`.

## Notes

- Orders are saved to MySQL before the WhatsApp click-to-chat URL is returned.
- Public pages never display internal product codes.
- Admin image uploads are stored in `public/uploads`.
- Public read pages render starter seed data only when `USE_SEED_FALLBACK=true` or `DATABASE_URL` is not configured. Admin pages and all mutations require MySQL and show an error when the database is unavailable.
- Local admin uploads are stored in `public/uploads`. For serverless production deployments, use persistent object storage such as S3 or Cloudinary.
