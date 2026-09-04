# Tina Cloud zstd corruption — diagnosis & workaround (September 2026)

## Symptom

Corinne reported "a ton of issues" in the TinaCMS admin on 2026-09-03:
GraphQL error toasts (e.g. `Unable to find collection for field education`),
partial/stale document lists, and a ghost `content/pages/blog.json` document
that has never existed in the repo.

## Root cause (reproduced)

**Tina Cloud's content API corrupts zstd-compressed responses.** Modern
browsers (Chrome 123+, recent Edge/Firefox) advertise `zstd` in
`Accept-Encoding`. When a Tina Cloud GraphQL response is large enough to
compress, it arrives with `Content-Encoding: zstd` but the body is not a
valid zstd frame — the binary was passed through a UTF-8 text step
server-side, so bytes like `0xB5`/`0xFD` are replaced with U+FFFD
(`ef bf bd`). Browsers fail with `net::ERR_CONTENT_DECODING_FAILED`.

Reproduction:

```bash
# Corrupted (magic should be 28b52ffd, arrives as 28efbfbd):
curl -X POST "https://content.tinajs.io/2.4/content/<CLIENT_ID>/github/main" \
  -H "Content-Type: application/json" -H "X-API-KEY: <READONLY_TOKEN>" \
  -H "Accept-Encoding: zstd" \
  -d '{"query":"{ pageConnection(first: 50) { edges { node { _sys { filename } } } } }"}' \
  -o body.bin
xxd body.bin | head -1   # → 28ef bfbd 2fef bfbd … (corrupted)

# Clean when zstd is not advertised (gzip/identity → uncompressed JSON):
curl -X POST … -H "Accept-Encoding: gzip" …   # → plain JSON, no encoding
```

Control through the same network: `facebook.com` / `instagram.com` zstd
responses arrive with intact `28b52ffd` magic — so the corruption is on
Tina Cloud's side (their API Gateway/Lambda mangles the binary frame), not
the client's network.

Impact:
- **Admin**: larger queries (collection lists, page documents with all block
  fragments) fail intermittently → error toasts, stale/partial lists, failed
  saves. Small responses pass uncompressed, so the admin half-works.
- **Public site**: `tina-live` runtime fetches fail and fall back to bundled
  build-time content (graceful; visitors unaffected).

## Resolution (2026-09-04): Tina Cloud fixed it upstream

Re-tested on 2026-09-04: `content.tinajs.io` no longer emits zstd at all.
With `Accept-Encoding: zstd` it returns identity (plain JSON); with Chrome's
full `gzip, deflate, br, zstd` it returns valid Brotli that decodes cleanly.
The workaround below is therefore no longer needed for the admin — and the
admin half of it turned out to be **broken on its own**:

> Pointing the admin at our domain via `tinaioConfig.contentApiUrlOverride`
> crashes it on boot. Tina's `TinaCMSProvider` runs `parseURL()` on the
> content API URL; that helper only recognises `*.tinajs.io` hosts and
> returns `clientId: null, branch: null` for anything else, so the provider
> throws `Invalid setup. See https://tina.io/docs/r/what-is-tinacloud`
> before rendering. On /admin this surfaces as the generic **"Failed
> loading TinaCMS assets"** placeholder (the inline 2-second check finds an
> empty `#root`). Nobody could reach the login screen from the 2026-09-03
> deploy until this was reverted. Do not reintroduce either override.

Current state:

- `tina/config.ts`: no content API override — the admin talks to Tina
  Cloud directly again. Admin bundle regenerated (`pnpm run build:deploy`).
- `api/tina-proxy.ts` + the `/api/tina/:path*` rewrite are **kept** for the
  public site's live refresh (`src/lib/tina-live.ts`), which is not affected
  by `parseURL` and benefits from a same-origin call. Allowlisted paths:
  GraphQL, branch list/create, index status, events, editorial workflow,
  request status, collection search — all scoped to this client ID.
- Diagnosis tip: when /admin shows "Failed loading TinaCMS assets", load
  `/admin/index.html` in headless Chrome and read the console — the real
  error is an uncaught exception from the admin bundle, not a missing file:
  `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  --headless=new --enable-logging=stderr --v=0 --dump-dom <url>`.

## Original workaround (2026-09-03, superseded)

All Tina Cloud content-API traffic was routed through a same-origin
serverless proxy that negotiates `gzip` upstream (never zstd), so browsers
always receive clean JSON:

- `api/tina-proxy.ts`: proxy to `content.tinajs.io/*`, restricted to this
  project's client ID paths. Open CORS so preview deployments' admins can
  use it. Reached via the vercel.json rewrite `/api/tina/:path*` →
  `/api/tina-proxy?__path=:path*` (zero-config /api functions don't support
  catch-all bracket routes).
- `src/lib/tina-live.ts`: the site's live-refresh fetches
  `/api/tina/2.4/content/<clientId>/github/<branch>` (relative — works on
  every deployment; the bundled-content fallback still covers any proxy
  failure).
- `tina/config.ts`: `tinaioConfig.contentApiUrlOverride` pointed the prebuilt
  admin's content API at `https://blade-quill-art-academy.vercel.app/api/tina`.
  **Reverted — see Resolution above; this broke admin boot.**

Function budget note: the Vercel Hobby plan caps deployments at 12
serverless functions. To make room for the proxy, `api/insights/session.ts`
was folded into `api/insights.ts` (reached via the vercel.json rewrite
`/api/insights/session` → `/api/insights?__route=session`; the public URL is
unchanged). A plain vercel.json rewrite proxy was tried first and abandoned:
Vercel's edge forwards the client's `Accept-Encoding: zstd` upstream and
passes the corrupted response through unchanged.

Local dev (`tinacms dev`) is unaffected — it uses the local datalayer.

## If issues persist after this deploy

1. Hard-refresh the admin (Cmd+Shift+R) or close all site tabs and reopen —
   an admin tab left open across a deploy keeps the old bundle in memory.
2. If a ghost document (e.g. "Blog — content/pages/blog.json") still appears,
   reindex `main` from the Tina Cloud dashboard (project → Settings →
   Reindex) to purge orphaned index records.
3. Interim browser workaround: Chrome `chrome://flags#enable-zstd-content-encoding`
   → Disabled, or use Safari (does not advertise zstd).

## Report to Tina support (draft)

> Tina Cloud content API (`content.tinajs.io`, project client ID
> 66c31af8-a8db-4a0b-9eab-17bd12d7d5e2) returns corrupted zstd responses.
> When the client advertises `Accept-Encoding: zstd`, larger GraphQL
> responses arrive with `Content-Encoding: zstd` but the body has been
> UTF-8-mangled (frame magic `28 b5 2f fd` arrives as `28 ef bf bd 2f ef bf
> bd` — invalid bytes replaced with U+FFFD), so Chrome/Edge/Firefox fail with
> `net::ERR_CONTENT_DECODING_FAILED`. Smaller responses are served
> uncompressed and work. This breaks the Tina admin intermittently on any
> modern browser. Looks like the compression layer (API Gateway/Lambda?)
> stringifies the binary zstd frame as UTF-8 text instead of returning it as
> binary (base64 / isBase64Encoded).
