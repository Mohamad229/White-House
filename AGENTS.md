# Repository Guidelines

## Project Structure & Module Organization

This is a bilingual Next.js storefront and admin panel. App Router pages and API routes live in `app/`: Arabic pages at `/`, English pages under `app/en/`, admin screens under `app/admin/`, and route handlers under `app/api/`. Shared UI belongs in `components/`, with cart and admin pieces in subfolders. Business logic, i18n, formatting, Prisma access, and services live in `lib/`. Database schema and seed data are in `prisma/`. Static brand assets are in `public/brand/`, uploads in `public/uploads/`, and references in `images/`.

## Build, Test, and Development Commands

- `npm install`: install dependencies.
- `npm run dev`: start the local Next.js development server.
- `npm run build`: create a production build.
- `npm run start`: serve the production build.
- `npm run lint`: run Next.js ESLint checks.
- `npm run prisma:generate`: regenerate the Prisma client after schema changes.
- `npm run prisma:migrate`: create or apply a migration.
- `npm run prisma:seed`: seed starter store content and admin data.

Copy `.env.example` to `.env` before database-backed work. Set `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD`.

## Coding Style & Naming Conventions

Use TypeScript with `strict` mode. Prefer named exports for reusable components and helpers. Components use `PascalCase` filenames, such as `ProductCard.tsx`; helpers in `lib/` use focused names, such as `format.ts` or `order-service.ts`. Use the `@/` path alias. Keep Tailwind classes inline for local styling, and move shared behavior into `lib/`. Preserve bilingual fields and locale-aware helpers when changing products, categories, orders, or settings.

## Testing Guidelines

No test framework or `npm test` script is currently configured. Until one is added, run `npm run lint` and `npm run build` before submitting changes. For database changes, also run `npm run prisma:generate` and exercise the affected admin or storefront flow. If tests are introduced, use names like `order-service.test.ts`.

## Commit & Pull Request Guidelines

This workspace does not include Git history, so no project-specific commit convention can be inferred. Use concise imperative commit messages, for example `Add admin product image validation`. Pull requests should include a summary, affected routes or modules, migration notes, environment changes, UI screenshots, linked issues, and manual verification.

## Security & Configuration Tips

Do not commit `.env`, database credentials, auth secrets, or generated uploads unless intentionally adding public seed assets. Public pages may fall back to seed data without a database, but orders and admin mutations require MySQL. Keep internal product codes out of public UI.
