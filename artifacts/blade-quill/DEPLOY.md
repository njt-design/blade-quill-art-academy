# Client preview on Vercel

Static preview of the Blade & Quill frontend (Tina content from the repo; the Express API is not deployed — shop/gallery use fallbacks). Exception: **the contact form works in production** via a Vercel serverless function (`api/contact.ts` at the repo root) that emails submissions through Resend.

## How deploys work (git-connected)

The Vercel project is connected to the GitHub repo (`njt-design/blade-quill-art-academy`, production branch `main`). Every push to `main` triggers a production deploy automatically — including commits made by Tina Cloud when content is saved in `/admin`.

**CMS save → live flow:**

1. Client saves in `/admin` → Tina Cloud commits to GitHub `main` ("TinaCMS content update").
2. **Immediately:** the live site re-fetches the saved content from the Tina Cloud content API (runtime GraphQL, read-only token). A page refresh shows the change in seconds — no rebuild wait.
3. **In parallel:** GitHub push triggers a Vercel production build (`build:static`, ~30s build + propagation). This refreshes the bundled JSON fallback in the JS bundle.

The bundled content (`import.meta.glob` in `src/lib/page-content.ts`) still renders first for an instant, flash-free load. The runtime fetch (`src/lib/tina-live.ts`) swaps in fresh data silently. If Tina Cloud is unreachable, visitors still see the last bundled version from the most recent deploy.

**Important:** because Tina Cloud commits directly to `main`, run `git pull` before starting local work, and expect `content/` to change out from under you while the client is editing.

## Manual deploy (optional)

Git auto-deploy is the primary flow. Manual CLI deploys still work from the monorepo root:

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
| `TINA_TOKEN` | Vercel Dashboard | Yes — read-only token from Tina Cloud (used by Tina admin build) |
| `TINA_PUBLIC_READONLY_TOKEN` | Vercel Dashboard | Yes — same read-only token as `TINA_TOKEN`; injected into the browser bundle for runtime content fetches |
| `TINA_BRANCH` | Vercel Dashboard | No — defaults to `main` in `tina/config.ts` |
| `RESEND_API_KEY` | Vercel Dashboard | Yes — API key from [resend.com](https://resend.com); used by `api/contact.ts` to send contact form email |
| `CONTACT_TO_EMAIL` | Vercel Dashboard | Yes — inbox that receives contact form messages (Corinne's email) |
| `CONTACT_FROM_EMAIL` | Vercel Dashboard | Yes — verified Resend sender, e.g. `Blade & Quill <contact@bladeandquillartacademy.com>` (use `onboarding@resend.dev` until the domain is verified) |
| `RESEND_AUDIENCE_ID` | Vercel Dashboard | Yes — id of the Resend Audience that stores newsletter subscribers (Resend dashboard → Audiences) |
| `PORT` | Hardcoded in `build:static` | No — set to `3001` in the script |
| `BASE_PATH` | Hardcoded in `build:static` | No — set to `/` in the script |

## Contact form email (Resend)

`POST /api/contact` is served by the Vercel function [`api/contact.ts`](../../api/contact.ts) (the SPA rewrite in `vercel.json` excludes `api/`). It validates `{ name, email, message }` and sends the message to `CONTACT_TO_EMAIL` via Resend with the guest's address as Reply-To, so replies go straight to the guest.

Setup (one time):

1. Create a Resend account and API key.
2. Verify the sending domain in Resend (DNS records). Until verified, set `CONTACT_FROM_EMAIL=onboarding@resend.dev` — Resend then only delivers to the account owner's email.
3. Add `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL` in Vercel project settings.

Local dev is unchanged: Vite proxies `/api` to the Express api-server, which stores submissions in Supabase.

## Newsletter signups (Resend Audience)

`POST /api/newsletter` is served by the Vercel function [`api/newsletter.ts`](../../api/newsletter.ts). It validates the email and stores it as a contact in the Resend Audience identified by `RESEND_AUDIENCE_ID` — no separate database. Duplicate signups return success. Both newsletter forms (the dark "Stay in the Loop" panel and the footer "Join" form) post here and show inline success/error feedback.

Setup: in the Resend dashboard create an Audience (**Audiences → Create**), copy its id, and add it as `RESEND_AUDIENCE_ID` in Vercel project settings. Subscribers can then be emailed with Resend Broadcasts.

Note: the newsletter route only exists as a Vercel function — in local dev the Express api-server has no `/api/newsletter` route, so signups 404 locally.

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

**Warning — the dev server clobbers the pre-built admin.** Running `pnpm dev` (`tinacms dev`) rewrites `public/admin/index.html` to a dev-mode version that loads scripts from `localhost:4001`, and replaces `public/admin/.gitignore`. Committing those dev-mode files breaks `/admin` in production ("Failed loading TinaCMS assets"). Before committing, discard them:

```bash
git restore artifacts/blade-quill/public/admin/
```

Only commit `public/admin/` when intentionally regenerating it via `pnpm run build:deploy`.

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
