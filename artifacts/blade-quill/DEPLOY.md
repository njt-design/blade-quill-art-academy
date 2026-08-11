# Client preview on Vercel

Static Blade & Quill frontend (Tina content from the repo). The Express api-server is **not** deployed — gallery/tutorials use Tina or fallbacks. Production serverless functions under repo-root `api/` handle **contact**, **newsletter**, **Stripe checkout** (prices come from Tina Shop Products), and **Owner Insights** (`/api/insights`).

## How deploys work (git-connected)

The Vercel project is connected to the GitHub repo (`njt-design/blade-quill-art-academy`, production branch `main`). Every push to `main` triggers a production deploy automatically — including commits made by Tina Cloud when content is saved in `/admin`.

**CMS save → live flow:**

1. Client saves in `/admin` → Tina Cloud commits to GitHub `main` ("TinaCMS content update").
2. **Immediately:** the live site re-fetches the saved content from the Tina Cloud content API (runtime GraphQL, read-only token). Focusing or switching to an already-open public tab (or a soft refresh) shows the change in seconds — no rebuild wait. Signed-in editors also get ~2 minutes of background polling so saves land without a hard refresh.
3. **In parallel:** GitHub push triggers a Vercel production build (`build:static`, ~30s build + propagation). This refreshes the bundled JSON fallback in the JS bundle.

The bundled content (`import.meta.glob` in `src/lib/page-content.ts`) still renders first for an instant, flash-free load. The runtime fetch (`src/lib/tina-live.ts` + `use-live-tina` / `use-live-content` / `use-live-refresh`) swaps in fresh data silently and re-runs on focus/visibility. If Tina Cloud is unreachable, visitors still see the last bundled version from the most recent deploy.

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

| Variable                     | Where to set                | Required                                                                                                                                                                                                                                                                  |
| ---------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TINA_PUBLIC_CLIENT_ID`      | Vercel Dashboard            | Yes — from [app.tina.io](https://app.tina.io) project settings                                                                                                                                                                                                            |
| `TINA_TOKEN`                 | Vercel Dashboard            | Yes — read-only token from Tina Cloud (used by Tina admin build)                                                                                                                                                                                                          |
| `TINA_PUBLIC_READONLY_TOKEN` | Vercel Dashboard            | Yes — same read-only token as `TINA_TOKEN`; injected into the browser bundle for runtime content fetches                                                                                                                                                                  |
| `TINA_BRANCH`                | Vercel Dashboard            | No — defaults to `main` in `tina/config.ts`                                                                                                                                                                                                                               |
| `RESEND_API_KEY`             | Vercel Dashboard            | Yes — API key from [resend.com](https://resend.com); used by `api/contact.ts` to send contact form email                                                                                                                                                                  |
| `CONTACT_TO_EMAIL`           | Vercel Dashboard            | Yes — inbox that receives contact form messages. Use the branded address (e.g. `Corinne@bladeandquillartacademy.com`) once inbound forwarding is live so Gmail replies default to the branded From (see [docs/email-reply-privacy.md](../../docs/email-reply-privacy.md)) |
| `CONTACT_FROM_EMAIL`         | Vercel Dashboard            | Yes — verified Resend sender, e.g. `Blade & Quill <contact@bladeandquillartacademy.com>` (use `onboarding@resend.dev` until the domain is verified)                                                                                                                       |
| `RESEND_AUDIENCE_ID`         | Vercel Dashboard            | Yes — id of the Resend Audience that stores newsletter subscribers (Resend dashboard → Audiences)                                                                                                                                                                         |
| `RESEND_WEBHOOK_SECRET`      | Vercel Dashboard            | Yes for inbound email — signing secret of the Resend `email.received` webhook used by `api/inbound.ts`                                                                                                                                                                    |
| `INBOUND_FORWARD_TO_EMAIL`   | Vercel Dashboard            | Yes for inbound email — private inbox that receives mail forwarded from the branded domain addresses                                                                                                                                                                      |
| `STRIPE_SECRET_KEY`          | Vercel Dashboard            | Yes — from Stripe Developers → API keys (test or live)                                                                                                                                                                                                                    |
| `STRIPE_WEBHOOK_SECRET`      | Vercel Dashboard            | Yes — from Stripe webhook endpoint for `/api/stripe/webhook`                                                                                                                                                                                                              |
| `SUPABASE_URL`               | Vercel Dashboard            | Yes — orders storage for checkout                                                                                                                                                                                                                                         |
| `SUPABASE_SERVICE_ROLE_KEY`  | Vercel Dashboard            | Yes — server-side Supabase key (never expose to the browser)                                                                                                                                                                                                              |
| `VITE_GA_MEASUREMENT_ID`     | Vercel Dashboard            | No — defaults to Corinne's existing `G-50YS8RZ7HL` (Squarespace property)                                                                                                                                                                                                 |
| `GA_PROPERTY_ID`             | Vercel Dashboard            | Yes for Insights — numeric GA4 property ID (Admin → Property settings)                                                                                                                                                                                                    |
| `GA_SERVICE_ACCOUNT_JSON`    | Vercel Dashboard            | Yes for Insights — GCP service account JSON (raw or base64) with Viewer on that property                                                                                                                                                                                  |
| `PORT`                       | Hardcoded in `build:static` | No — set to `3001` in the script                                                                                                                                                                                                                                          |
| `BASE_PATH`                  | Hardcoded in `build:static` | No — set to `/` in the script                                                                                                                                                                                                                                             |

## Contact form email (Resend)

`POST /api/contact` is served by the Vercel function [`api/contact.ts`](../../api/contact.ts) (the SPA rewrite in `vercel.json` excludes `api/`). It validates `{ name, email, message }` and sends the message to `CONTACT_TO_EMAIL` via Resend with the guest's address as Reply-To, so replies go straight to the guest.

Setup (one time):

1. Create a Resend account and API key.
2. Verify the sending domain in Resend (DNS records). Until verified, set `CONTACT_FROM_EMAIL=onboarding@resend.dev` — Resend then only delivers to the account owner's email.
3. Add `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL` in Vercel project settings.

Local dev is unchanged: Vite proxies `/api` to the Express api-server, which stores submissions in Supabase.

## Branded inbox & reply privacy (Resend Inbound)

When Corinne replies to a contact form email from her personal mailbox, the guest sees her personal address. To keep replies branded, the domain receives mail through **Resend Inbound**: an MX record routes `@bladeandquillartacademy.com` mail to Resend, which fires an `email.received` webhook served by [`api/inbound.ts`](../../api/inbound.ts). That function verifies the webhook signature (`RESEND_WEBHOOK_SECRET`) and forwards the full message to `INBOUND_FORWARD_TO_EMAIL` (her private inbox). She replies from Gmail using "Send mail as" over Resend SMTP, so the guest only ever sees the branded address.

Full setup checklist (MX record, webhook, Gmail SMTP, env switches, caveats): [docs/email-reply-privacy.md](../../docs/email-reply-privacy.md). The webhook endpoint is `https://blade-quill-art-academy.vercel.app/api/inbound` — the custom domain blocks `/api/*` until launch.

## Newsletter signups (Resend Audience)

`POST /api/newsletter` is served by the Vercel function [`api/newsletter.ts`](../../api/newsletter.ts). It:

1. Validates the email and stores it as a contact in the Resend Audience (`RESEND_AUDIENCE_ID`).
2. Sends a confirmation email from `CONTACT_FROM_EMAIL` to the subscriber, with a signed **unsubscribe** link.
3. Treats duplicate / re-subscribe as success (and clears any prior `unsubscribed` flag).

`GET /api/newsletter/unsubscribe?email=…&token=…` ([`api/newsletter/unsubscribe.ts`](../../api/newsletter/unsubscribe.ts)) verifies the HMAC token and marks the contact `unsubscribed: true` in Resend, then shows a simple confirmation page. Future Resend Broadcasts respect that flag. Broadcast emails Corinne sends from the Resend dashboard also include Resend's own unsubscribe controls.

Both newsletter forms (the dark "Stay in the Loop" panel and the footer "Join" form) post to `/api/newsletter` and show inline success/error feedback.

Setup: in the Resend dashboard create an Audience (**Audiences → Create**), copy its id, and add it as `RESEND_AUDIENCE_ID` in Vercel project settings. Optional: set `NEWSLETTER_UNSUBSCRIBE_SECRET` for signed unsubscribe links (defaults to `RESEND_API_KEY`).

Note: the newsletter routes only exist as Vercel functions — in local dev the Express api-server has no `/api/newsletter` route, so signups 404 locally. Until a custom domain is verified in Resend, confirmation emails from `onboarding@resend.dev` only deliver to the Resend account owner's inbox.

## Stripe checkout (Tina prices)

Guests pay through **Stripe Checkout Sessions**. Product **name, price, stock, and download URL are edited in Tina** (`/admin` → Shop Products). Checkout reads the live Tina Cloud catalog and charges that price with inline `price_data` — Corinne never creates Products/Prices in the Stripe dashboard.

| Route                       | Function                                                   |
| --------------------------- | ---------------------------------------------------------- |
| `POST /api/checkout`        | [`api/checkout.ts`](../../api/checkout.ts)                 |
| `GET /api/checkout/success` | [`api/checkout/success.ts`](../../api/checkout/success.ts) |
| `POST /api/stripe/webhook`  | [`api/stripe/webhook.ts`](../../api/stripe/webhook.ts)     |
| `GET /api/download/:token`  | [`api/download/[token].ts`](../../api/download/[token].ts) |

Shared logic lives in [`lib/checkout`](../../lib/checkout). Local Express uses the same package via Vite’s `/api` proxy.

Checkout is built for catalogs of **30–100+ products**: the API resolves a single product via Tina path/`productId` filter (not a full catalog scan), and the live shop list paginates Tina connections. Pass `productSlug` from the storefront when available for the fastest lookup.

### One-time Stripe setup (then stop)

1. Create / log into Corinne’s Stripe account.
2. Developers → API keys → copy **Secret key** → Vercel env `STRIPE_SECRET_KEY` (and root `.env` for local).
3. Developers → Webhooks → Add endpoint: `https://<your-production-domain>/api/stripe/webhook`  
   Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`.
4. Copy the webhook signing secret → Vercel env `STRIPE_WEBHOOK_SECRET` (and `.env`).
5. Ensure Supabase has the latest [`lib/db/sql/schema.sql`](../../lib/db/sql/schema.sql) applied (orders snapshot columns — run the whole file in the Supabase SQL Editor). Set `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` on Vercel.
6. Tina tokens (`TINA_PUBLIC_CLIENT_ID`, `TINA_TOKEN`) must already be set so checkout can load Shop Products.

Smoke test locally after schema + Stripe test keys are in `.env`:

```bash
pnpm --filter @workspace/scripts run test:checkout
```

Expect `TINA_OK`, `SCHEMA_OK`, and `STRIPE_OK` (or `STRIPE_SKIPPED` if the key is still a placeholder).

After that, change prices only in Tina. Use Stripe Dashboard only for payouts, disputes, or switching test → live keys.

Local: put the same Stripe + Supabase + Tina vars in `.env`, run Express (`pnpm --filter @workspace/api-server run dev`) and the Vite app.

## Google Analytics + Owner Insights

The public site loads **GA4 Measurement ID `G-50YS8RZ7HL`** (same as the live Squarespace site) so engagement history stays continuous through cutover. SPA page views and conversion events fire from the browser:

| Event                | When                                |
| -------------------- | ----------------------------------- |
| `page_view`          | Every client-side route change      |
| `purchase`           | Stripe order success page           |
| `amazon_click`       | Outbound Amazon book / review links |
| `dummy_book_request` | Publisher dummy-book form success   |

**One-time GA4 console setup**

1. Open [Google Analytics](https://analytics.google.com/) for Corinne's property.
2. Admin → Events → mark `purchase`, `amazon_click`, and `dummy_book_request` as **key events**.
3. Create a GCP service account, download its JSON key, and add the service account email as a **Viewer** on the GA4 property (Admin → Property access management).
4. Copy the numeric **Property ID** (Admin → Property settings) into Vercel as `GA_PROPERTY_ID`.
5. Paste the service account JSON (or base64 of it) into Vercel as `GA_SERVICE_ACCOUNT_JSON`.

**Owner Studio (`/insights`)**

- Tina-authenticated page showing sessions, bounce rate, Stripe paid sales, Amazon clicks, dummy-book requests, a sessions sparkline, and recent orders.
- Corinne workflow: sign in at **`https://blade-quill-art-academy.vercel.app/admin`** (Tina Cloud) → open **Insights** in the Tina sidebar. That screen mints a session cookie and embeds `/insights`. Prefer staying on the `*.vercel.app` host while the apex domain is still under construction — admin login on vercel.app does not share cookies/localStorage with `bladeandquillartacademy.com`.
- API: `GET /api/insights?clientID=…&range=7|28|90` accepts `Authorization: Bearer <tina id_token>` or the `bq_insights` cookie from `POST /api/insights/session` ([`api/insights.ts`](../../api/insights.ts)). Shared logic lives in [`lib/insights`](../../lib/insights).
- After changing the Insights Tina screen in `tina/config.ts`, regenerate admin (`tinacms build …`) and deploy so `/admin` picks up the new UI.

Products / prices stay in Tina (**Shop Products**). Insights is the glanceable analytics + Stripe orders surface — not a second product editor.

Note: Squarespace used Consent Mode (analytics denied until cookies accepted). This site loads gtag without a consent banner, so absolute counts may differ slightly from the old site even with the same Measurement ID.

## Editing guide (for Corinne)

See [docs/EDITING-GUIDE.md](../../docs/EDITING-GUIDE.md) — bookmark, sidebar map, save feedback, and troubleshooting.

**Canonical editor URL (while the real domain is under construction):**  
https://blade-quill-art-academy.vercel.app/admin

`bladeandquillartacademy.com/admin` redirects there. Do not send Corinne to per-deployment `*.vercel.app` preview URLs for editing.

## Tina admin guardrails

Repo scripts keep `/admin` from drifting after schema changes:

| Command                      | Purpose                                                                      |
| ---------------------------- | ---------------------------------------------------------------------------- |
| `pnpm run check:tina`        | Fail if admin points at localhost or schema changed without lock/admin regen |
| `pnpm run check:tina:staged` | Same, for staged files (wired via `.githooks/pre-commit`)                    |
| `pnpm postinstall`           | Symlink `artifacts/blade-quill/.env` → repo-root `.env` + install git hooks  |

After any change to `tina/config.ts` or `tina/blocks.ts`:

```bash
cd artifacts/blade-quill
pnpm run build:deploy
git add tina/__generated__/ tina/tina-lock.json public/admin/
```

## Pre-building the Tina admin

`tinacms build` fails on Vercel's Linux build environment due to an esbuild platform bug (`Unterminated string literal`). The admin SPA and generated types are **pre-built locally** and committed to the repo.

**Env file location:** The Tina CLI only reads `artifacts/blade-quill/.env` (sibling of the `tina/` folder). Credentials live in the **repo-root** `.env`, so symlink once:

```bash
ln -sf ../../.env artifacts/blade-quill/.env
```

Without that symlink, the CLI gets empty `clientId`/`token` (`401` / `ERR_CLOUD_CHECK_FAILED`). Builds that then use `--skip-cloud-checks` can leave `tina/tina-lock.json` stale. **A stale lock breaks `/admin` login** — Tina Cloud indexes the lock, and a mismatch with the committed admin SPA causes auth/schema errors after sign-in. Always commit an updated `tina/tina-lock.json` with schema changes (verify new template names appear in the lock before pushing).

After any schema change in `tina/config.ts` or `tina/blocks.ts` (including `cmsCallback` screens like Insights), regenerate and commit:

```bash
cd artifacts/blade-quill
# If Tina Cloud hasn't indexed the latest schema yet, add --skip-cloud-checks:
# pnpm exec tinacms build --local --noTelemetry --datalayer-port 9100 --skip-cloud-checks
pnpm run build:deploy
git add tina/__generated__/ tina/tina-lock.json public/admin/
git commit -m "Regenerate Tina admin after schema change"
```

Production builds use `build:static` (Vite only). Tina content ships from committed `content/` and `tina/__generated__/`.

**Warning — the dev server clobbers the pre-built admin.** Running `pnpm dev` (`tinacms dev`) rewrites `public/admin/index.html` to a dev-mode version that loads scripts from `localhost:4001`, and replaces `public/admin/.gitignore`. Committing those dev-mode files breaks `/admin` in production ("Failed loading TinaCMS assets"). Before committing, discard them:

```bash
git restore artifacts/blade-quill/public/admin/
```

Only commit `public/admin/` when intentionally regenerating it via `pnpm run build:deploy`. Note: `tinacms build` also overwrites `public/admin/.gitignore` — restore the intentional empty one from git after regenerating so assets stay trackable.

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

## Official domain migration (Squarespace → Vercel)

`bladeandquillartacademy.com` moves from Squarespace hosting to this Vercel project. Apex is canonical (`www` redirects to apex). There are no MX records to preserve.

While cutover is in progress, a host-scoped rewrite in repo-root [`vercel.json`](../../vercel.json) serves [`public/under-construction.html`](./public/under-construction.html) for `(www.)?bladeandquillartacademy.com`. The full site stays available on `blade-quill-art-academy.vercel.app`. `newrelease.bladeandquillartacademy.com` is unchanged.

### Phase A — DNS cutover (domain shows Under Construction)

1. Vercel Dashboard → **blade-quill-art-academy** → **Settings → Domains**.
2. Add `bladeandquillartacademy.com` as the primary production domain.
3. Add `www.bladeandquillartacademy.com` and set it to **redirect to** `bladeandquillartacademy.com` (301).
4. Copy the DNS values Vercel shows (typically apex **A** → `76.76.21.21`, and `www` **CNAME** → `cname.vercel-dns.com`). Confirm against the dashboard — values can change.
5. Squarespace → **Domains** → `bladeandquillartacademy.com` → **DNS settings**:
   - Delete the Squarespace preset apex **A** records (`198.185.159.144/145`, `198.49.23.144/145`).
   - Delete the `www` **CNAME** to `ext-sq.squarespace.com`.
   - Add the Vercel apex **A** record and `www` **CNAME**.
   - Leave the existing `newrelease` **CNAME** → `blade-quill-art-academy.vercel.app` alone.
6. Wait for propagation (apex TTL was ~4h). Verify:
   - Vercel shows a valid SSL cert for apex + www.
   - `https://bladeandquillartacademy.com` and `https://www.bladeandquillartacademy.com` show the Under Construction page.
   - `https://blade-quill-art-academy.vercel.app` still serves the full site.
   - `https://newrelease.bladeandquillartacademy.com` still serves Important Links.

Squarespace keeps answering until each resolver’s cache expires — no hard downtime window.

### Phase B — Transfer registration to Vercel

Do this only after Phase A is stable. Transferring the registrar does not change resolution if DNS records are recreated correctly.

1. Squarespace → Domains → domain → **Transfer**: unlock the domain and copy the EPP/auth code. Transfers are blocked within 60 days of registration/prior transfer — check the panel.
2. Vercel Dashboard → **Domains → Transfer In**: enter the domain + auth code and pay the 1-year renewal (~$20 for `.com`).
3. In the transfer / Vercel DNS setup, recreate:
   - Apex **A** → Vercel (per dashboard)
   - `www` **CNAME** → Vercel (or keep as redirect hostname on the project)
   - `newrelease` **CNAME** → `blade-quill-art-academy.vercel.app`
4. Approve the outbound transfer in Squarespace so it finishes in minutes instead of 5–7 days. Do **not** cancel Squarespace website/domain services before the transfer completes.
5. After transfer succeeds: cancel the Squarespace **website** subscription (the domain leaves Squarespace automatically).

### Phase C — Launch flip (remove Under Construction)

When ready for the real homepage:

1. Remove the host-scoped under-construction rewrite from repo-root [`vercel.json`](../../vercel.json) (the HTML file can stay harmlessly or be deleted).
2. Push to `main` (or `vercel deploy --prod`). Production build ~30s; the domain serves the real site with no DNS change.

### Phase D — Post-migration checklist

- **Stripe**: Point the webhook endpoint at `https://bladeandquillartacademy.com/api/stripe/webhook` (events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`). If this is a new endpoint, update Vercel env `STRIPE_WEBHOOK_SECRET`.
- **Resend**: Verify `bladeandquillartacademy.com` in Resend (add DKIM/SPF TXT records in Vercel DNS). Then set `CONTACT_FROM_EMAIL` to something like `Blade & Quill <contact@bladeandquillartacademy.com>`. Also enable **Receiving** on the domain and add the inbound MX record so branded addresses receive mail (safe — the domain has no other MX records); full steps in [docs/email-reply-privacy.md](../../docs/email-reply-privacy.md).
- **Tina Cloud**: At [app.tina.io](https://app.tina.io), add `https://bladeandquillartacademy.com` to the project Site URLs so `/admin` login works on the production domain.
- **GA4**: No change — the site already uses measurement ID `G-50YS8RZ7HL`.
- **newrelease teardown** (optional, later): 301 the temp subdomain to the main site and remove its host rewrite/redirect from `vercel.json` (see Temporary domain teardown above).
