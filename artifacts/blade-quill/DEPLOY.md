# Client preview on Vercel

Static preview of the Blade & Quill frontend (Tina content from the repo; API routes are not deployed — shop/gallery use fallbacks).

## Deploy / update

From the monorepo root:

```bash
pnpm install
vercel deploy --prod
```

Preview deployments (per branch/PR):

```bash
vercel deploy
```

## Private access (recommended for client review)

1. Open the project in [Vercel Dashboard](https://vercel.com/dashboard).
2. **Settings → Deployment Protection**.
3. Enable **Password Protection** for Production (and/or Preview).
4. Share the site URL and password with Corinne only.

Optional: add a dedicated hostname under **Settings → Domains** (e.g. `preview.bladeandquill.com`) and point DNS to Vercel.

## Environment variables (Vercel project)

| Variable | Where to set | Required |
|----------|--------------|----------|
| `TINA_PUBLIC_CLIENT_ID` | Vercel Dashboard | Yes — from [app.tina.io](https://app.tina.io) project settings |
| `TINA_TOKEN` | Vercel Dashboard | Yes — read-only token from Tina Cloud |
| `TINA_BRANCH` | Vercel Dashboard | No — defaults to `main` in `tina/config.ts` |
| `PORT` | Hardcoded in `build:static` | No — set to `3001` in the script |
| `BASE_PATH` | Hardcoded in `build:static` | No — set to `/` in the script |

## Pre-building the Tina admin

`tinacms build` fails on Vercel's Linux build environment due to an esbuild platform bug (`Unterminated string literal`). The admin SPA and generated types are **pre-built locally** and committed to the repo.

After any schema change in `tina/config.ts`, regenerate and commit:

```bash
cd artifacts/blade-quill
pnpm run build:deploy
git add tina/__generated__/ public/admin/
git commit -m "Regenerate Tina admin after schema change"
```

Production builds use `build:static` (Vite only). Tina content ships from committed `content/` and `tina/__generated__/`.

No Supabase/Stripe keys are required for the static client preview.

## Temporary domain (Important Links launch)

The Important Links page (`/important-links-page`) can launch early on a standalone domain before the full site cutover.

### Setup

1. Purchase a standalone domain (name TBD).
2. Replace `YOUR-TEMP-DOMAIN.com` in the repo-root [`vercel.json`](../../vercel.json) with the real hostname (currently `newrelease.bladeandquillartacademy.com`).
3. Deploy: `vercel deploy --prod` from the monorepo root.
4. **Vercel Dashboard → Settings → Domains** — add the new domain.
5. Point DNS at your registrar to Vercel (CNAME to `cname.vercel-dns.com`, or A records per Vercel instructions).
6. Verify: temp domain root shows the Important Links page; `/important-links-page` on that domain also works.

The host-specific rewrite in `vercel.json` only affects the temp domain. The main Vercel URL continues to serve the full site.

### Teardown (at full site launch)

1. Point the official domain to Vercel.
2. Keep `/important-links-page` on the same path (book QR codes and social links may reference it).
3. Add a 301 redirect from the temp domain to the official URL (Vercel Dashboard → Domains → redirect).
4. Remove the temp domain from the project and delete the host rewrite from `vercel.json`.
