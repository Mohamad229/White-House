# White House Store

Bilingual Arabic/English Next.js storefront and admin panel for a premium men's fashion shop.

## Setup

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `AUTH_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `BLOB_READ_WRITE_TOKEN`.
3. Install dependencies:

```bash
npm install
```

4. Create the PostgreSQL schema and seed starter content:

```bash
npm run prisma:migrate
npm run prisma:seed
```

For hosted or production databases, run the checked-in migrations without creating a new migration:

```bash
npm run prisma:deploy
npm run prisma:seed
```

To move an existing local database to PostgreSQL:

```bash
npm run data:export
npm run prisma:generate
npm run prisma:deploy
npm run data:import
npm run uploads:migrate
```

Run `data:export` before replacing a local MySQL `DATABASE_URL`. Run the later commands after `.env` points to the PostgreSQL/Neon database and includes `BLOB_READ_WRITE_TOKEN`.

5. Run the app:

```bash
npm run dev
```

Arabic storefront is available at `/`, English at `/en`, and admin at `/admin`.

## Notes

- Orders are saved to PostgreSQL before the WhatsApp click-to-chat URL is returned.
- Public pages never display internal product codes.
- Admin image uploads are stored in Vercel Blob and saved as public URLs in PostgreSQL. Server uploads accept images under 4 MB.
- Public read pages render starter seed data only when `USE_SEED_FALLBACK=true` or `DATABASE_URL` is not configured. Admin pages and all mutations require PostgreSQL and show an error when the database is unavailable.
- Keep static brand assets in `public/brand`. Uploaded product/category images should go through the admin upload API so they are stored in Blob.
