# Blade & Quill Art Academy

Full-stack website for Corinne's Blade & Quill Art Academy — an online art education brand. The site showcases artwork, sells physical/digital products, embeds YouTube tutorials, and provides free resources.

## Stack

- **Monorepo**: pnpm workspaces
- **Node.js**: 24+
- **Frontend**: React 19, Vite, Tailwind CSS v4, shadcn/ui, Framer Motion
- **CMS**: TinaCMS (file-based, Git-backed)
- **API**: Express 5, PostgreSQL + Drizzle ORM
- **Payments**: Stripe Checkout Sessions (Tina Shop Product prices → live `price_data`; no Stripe catalog to maintain)
- **Validation**: Zod, drizzle-zod
- **Codegen**: Orval (from OpenAPI spec)

## Structure

```
├── artifacts/
│   ├── blade-quill/        # React + Vite frontend (served at /)
│   ├── api-server/         # Express API server (served at /api)
│   └── mockup-sandbox/     # Component preview sandbox
├── api/                    # Vercel serverless (contact, newsletter, Stripe checkout)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   ├── checkout/           # Shared Stripe + Tina product checkout core
│   └── db/                 # Supabase client + SQL schema
└── scripts/
    └── src/seed.ts         # Database seeder
```

## Environment Variables

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `STRIPE_SECRET_KEY` | Stripe test/live secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret for `/api/stripe/webhook` |
| `TINA_PUBLIC_CLIENT_ID` | Tina Cloud client id (checkout product lookup) |
| `TINA_TOKEN` | Tina Cloud read token |

Copy `.env.example` to `.env` in the repo root and fill in the values before seeding or running the API. Edit shop prices in Tina **Shop Products** — see `artifacts/blade-quill/DEPLOY.md` for the one-time Stripe webhook setup.

## Local Development

```bash
pnpm install

# Start the frontend (includes TinaCMS dev server)
pnpm --filter @workspace/blade-quill run dev

# Start the API server
pnpm --filter @workspace/api-server run dev

# Seed the database (requires .env with Supabase credentials)
pnpm --filter @workspace/scripts run seed

# Re-run codegen after OpenAPI changes
pnpm --filter @workspace/api-spec run codegen

# Push DB schema changes
pnpm --filter @workspace/db run push

# Typecheck everything
pnpm run typecheck
```

## GitHub

**https://github.com/njt-design/blade-quill-art-academy**
