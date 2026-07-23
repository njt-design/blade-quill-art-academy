# Blade & Quill Art Academy

Full-stack website for Corinne's Blade & Quill Art Academy — an online art education brand. The site showcases artwork, sells physical/digital products, embeds YouTube tutorials, and provides free resources.

## Stack

- **Monorepo**: pnpm workspaces
- **Node.js**: 24+
- **Frontend**: React 19, Vite, Tailwind CSS v4, shadcn/ui, Framer Motion
- **CMS**: TinaCMS (file-based, Git-backed)
- **API**: Express 5, PostgreSQL + Drizzle ORM
- **Payments**: Stripe (sandbox mode)
- **Validation**: Zod, drizzle-zod
- **Codegen**: Orval (from OpenAPI spec)

## Structure

```
├── artifacts/
│   ├── blade-quill/        # React + Vite frontend (served at /)
│   ├── api-server/         # Express API server (served at /api)
│   └── mockup-sandbox/     # Component preview sandbox
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
└── scripts/
    └── src/seed.ts         # Database seeder
```

## Environment Variables

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `STRIPE_SECRET_KEY` | Stripe sandbox/live secret key |

Copy `.env.example` to `.env` in the repo root and fill in the values before seeding or running the API.

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
