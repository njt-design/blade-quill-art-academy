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

## Workaround shipped in this repo

All Tina Cloud content-API traffic is routed through a same-origin
serverless proxy that negotiates `gzip` upstream (never zstd), so browsers
always receive clean JSON:

- `api/tina-proxy.ts`: proxy to `content.tinajs.io/*`, restricted to this
  project's client ID paths (GraphQL, branch list/create, index status,
  events feed, editorial workflow, request status, collection search). The
  allowlist must cover every path the tinacms client builds on
  `contentApiBase` — check `contentApiBase` usages in the tinacms dist when
  upgrading tinacms.
  Open CORS so preview deployments' admins can use it. Reached via the
  vercel.json rewrite `/api/tina/:path*` → `/api/tina-proxy?__path=:path*`
  (zero-config /api functions don't support catch-all bracket routes).
- `src/lib/tina-live.ts`: the site's live-refresh fetches
  `/api/tina/2.4/content/<clientId>/github/<branch>` (relative — works on
  every deployment; the bundled-content fallback still covers any proxy
  failure).
- `tina/config.ts`: `tinaioConfig.contentApiUrlOverride` points the prebuilt
  admin's content API at `https://blade-quill-art-academy.vercel.app/api/tina`.
  This keeps Tina Cloud auth (only the content API base changes). Do NOT use
  the top-level `contentApiUrlOverride` — it flips the admin into
  "self-hosted" mode and breaks Tina Cloud login. The admin bundle must be
  regenerated (`pnpm run build:deploy`) for changes to take effect.

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
