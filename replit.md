# Blade & Quill Art Academy

## Overview

Full-stack website for Corinne's Blade & Quill Art Academy — an online art education brand. The site showcases her artwork, sells physical/digital products, embeds YouTube tutorials, and provides free resources. Inspired by Proko.com's editorial style with a dark illustrative aesthetic.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle) for API, Vite for frontend
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui + Framer Motion
- **Payments**: Stripe (sandbox mode)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── blade-quill/        # React + Vite frontend (served at /)
│   └── api-server/         # Express API server (served at /api)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/
│   └── src/seed.ts         # Database seeder (run: pnpm --filter @workspace/scripts run seed)
```

## Pages

- `/` — Homepage: hero, featured artwork, products strip, YouTube highlights, about blurb
- `/shop` — Shop: filterable by All / Physical / Digital / Curriculum
- `/shop/:id` — Product detail with Stripe checkout
- `/shop/success` — Order success with download/Gumroad link
- `/gallery` — Masonry grid of cartoon/digital paintings
- `/tutorials` — Curated YouTube video embeds
- `/downloads` — Free coloring pages and resource guides
- `/about` — Corinne's biography
- `/contact` — Contact form (stored in DB)

## API Routes

- `GET /api/products?category=physical|digital|curriculum`
- `GET /api/products/:id`
- `GET /api/gallery`
- `GET /api/tutorials?featured=true`
- `GET /api/downloads`
- `POST /api/checkout` — Creates Stripe checkout session
- `GET /api/checkout/success?session_id=...` — Order fulfillment
- `POST /api/contact`

## Database Schema

- `products` — Physical books, digital downloads, curriculum
- `gallery` — Artwork portfolio items
- `tutorials` — YouTube video IDs and metadata
- `downloads` — Free downloadable resources
- `orders` — Stripe order records
- `contacts` — Contact form submissions

## Environment Variables Required

- `DATABASE_URL` — Auto-provisioned by Replit
- `STRIPE_SECRET_KEY` — **Must be set** for payments to work (Stripe sandbox key)

## Payments (Stripe)

Stripe is integrated but requires `STRIPE_SECRET_KEY` to be added as an environment variable. Corinne needs to:
1. Create a Stripe account at stripe.com
2. Get the test/sandbox secret key from the Stripe dashboard
3. Add it as a secret in this Replit project

Digital products with a `gumroadUrl` will also show a Gumroad button as an alternative.

## Running Locally

```bash
# Start API server
pnpm --filter @workspace/api-server run dev

# Start frontend  
pnpm --filter @workspace/blade-quill run dev

# Re-seed database
pnpm --filter @workspace/scripts run seed

# Re-run codegen after OpenAPI changes
pnpm --filter @workspace/api-spec run codegen

# Push DB schema changes
pnpm --filter @workspace/db run push
```

## TypeScript & Composite Projects

- `lib/*` packages are composite and emit declarations via `tsc --build`
- `artifacts/*` are leaf packages checked with `tsc --noEmit`
- Run `pnpm run typecheck` from root to check everything

## GitHub Repository

The project is mirrored on GitHub at:

**https://github.com/njt-design/blade-quill-art-academy**

- Connected via Replit's GitHub OAuth integration
- `origin` remote is configured to: `git@github.com:njt-design/blade-quill-art-academy.git`
- All 301 files including all artifacts, images, and lock files are pushed
- To push future changes: `node scripts/push-to-github.mjs njt-design/blade-quill-art-academy`
- For a fresh push (diverged history): add the `--force` flag
