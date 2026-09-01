# Blade & Quill — Design Audit (September 2026)

A code-level audit of the live site's visual system, taken before rebuilding the
public design-system page (`/design-system`). The goal of the rebuild: the page
should mirror **what actually ships**, and every entry should carry the admin
details Corinne needs (image dimensions, file types, character limits, where
each block is used).

Site source: `artifacts/blade-quill/`. Styling source of truth: `src/index.css`
(Tailwind v4 `@theme` — there is no `tailwind.config.*`).

---

## 1. Current visual language

- **Palette (2026 rebrand):** blush paper background `#DFD2CC`, ink foreground
  `#2E2222`, maroon primary/CTA `#9A5151`, gold accent `#D9B783`, brown deep
  surfaces `#714B4B`, taupe muted text `#776562`. Each brand color has a
  `-deep` variant; there are 4-step ink and paper scales.
- **Typography:** Young Serif for `h1`/display only; Quicksand (300–700) for
  `h2`–`h6` and body (18px / 1.6, weight 500); JetBrains Mono for eyebrows and
  micro-labels. Loaded from Google Fonts in `index.html`.
- **Texture & motion:** fixed SVG-noise paper grain over the whole page
  (`body::before`, multiply blend), page-turn route transition, scroll reveals
  (`.reveal`, `WordReveal`), floating "drift" art tiles, hover peels/lifts.
  All motion is neutralized under `prefers-reduced-motion`.
- **Shape language:** flat and minimal — no glows or glassmorphism (navbar
  excepted). Radii 4/10/18/28px, brown-tinted shadows, in-palette gradients
  only (`--g-cta`, `--g-warm`, `--g-dawn`, `--g-paper`, …).
- **Theme:** light-first. `.dark` tokens exist and work, but the toggle is only
  exposed on `/design-system`; the public site always renders light.

## 2. Page & block inventory

Pages are JSON block compositions (`content/pages/*.json`) rendered by
`src/pages/blocks/BlockRenderer.tsx`. **39 block templates** exist in
`tina/blocks.ts`; where they're used today:

| Family | Blocks | Used on |
|--------|--------|---------|
| Heroes & headers (8) | homeHero, aboutHero, hero, heroSplitImage, heroFullBleed, heroFloatingImages, heroImageGrid, pageHeader | `/` (homeHero), `/about` (aboutHero), `/p/summer-workshop` (hero), gallery/downloads/contact/publishers (pageHeader). The 4 showcase heroes are available but unused on live pages. |
| Content (12) | text, story, timeline, statsRow, featureGrid, cardRow, pillars, imageGallery, imageSpotlight, imageSideBySide, imageMasonry, videoEmbed | `/about` (story, timeline, statsRow, cardRow), `/` (pillars), `/publishers` + `/p/*` (imageGallery, text, videoEmbed, featureGrid). imageSpotlight / imageSideBySide / imageMasonry unused so far. |
| Commerce & media (9) | featuredBook, featuredRelease, productStrip, shopCatalog, galleryGrid, downloadsGrid, tutorialsStrip, classesPitch, blogFeed | `/` (featuredBook, productStrip, tutorialsStrip, blogFeed, kofiSupport), `/shop` (shopCatalog), `/gallery` (galleryGrid), `/downloads` (downloadsGrid), `/important-links-page` (featuredRelease). classesPitch unused. |
| CTAs & forms (8) | ctaBand, bigCta, newsletterSignup, contactInfo, contactForm, dummyBookRequest, kofiSupport, reviewLinks | `/contact` (contactInfo, contactForm), `/about` (bigCta), `/publishers` (dummyBookRequest, socialLinks), `/p/*` (ctaBand), `/important-links-page` (reviewLinks, kofiSupport) |
| Standalone extras (2) | marquee, socialLinks | `/important-links-page` |

Data-driven blocks (shopCatalog, productStrip, blogFeed, galleryGrid,
downloadsGrid) pull from the Tina collections (products, posts, gallery), not
from block fields.

## 3. Image conventions in practice

- **Storage:** everything under `public/images/` (Tina media root
  `images/`). Bulk of artwork migrated from Squarespace lives in
  `public/images/squarespace/**`. Downloads/PDFs in `public/files/`.
- **Formats:** ~84 PNG, ~65 JPG, ~45 SVG, only 3 WebP (the homepage hero
  cutouts). No AVIF.
- **Fit rules:** artwork and product previews use `object-contain` (never
  crop — `.img-fit`); marketing tiles (`ArtTile`, pillars media, full-bleed
  heroes) use `object-cover`.
- **Fixed aspects by surface:** imageGallery `1:1`; downloadsGrid `4:3`;
  imageSpotlight selectable `16:10 / 1:1 / 3:4 / 21:9`; videoEmbed `16:9`;
  pillars media fixed 220–240px tall; galleryGrid natural-ratio masonry.
- **Lazy loading:** `ArtTile` always; gallery grid, masonry, spotlight and
  hero-mosaic selectively; hero/decorative images eager.
- **No responsive pipeline:** no `srcSet`, no `sizes`, no CDN transforms —
  single `<img src>` or CSS backgrounds. Oversized uploads ship at full weight.

## 4. Design-system page — gaps found (fixed by this rebuild)

1. **Coverage:** documented only 8 of 39 blocks; none of the brand components
   (`Btn`, `ProductCard`, `ArtTile`, `Polaroid`, `TutorialThumb`, `BookCover`,
   `QuillMark`, `WordReveal`, `InkUnderline`) appeared.
2. **Tokens:** the Tokens section showed 5 brand swatches + 9 semantic chips +
   4 type samples + 6 utilities — omitting `-deep` variants, ink/paper scales,
   all 7 gradients, radii, shadows, easings/timings, dark-mode values, and
   ~20 live utility classes (`.eyebrow`, `.grad-text`, `.card-peel`,
   `.link-ink`, `.bq-container`, reveal/marquee helpers…).
3. **Accuracy bugs:** `ButtonDemo` rendered a `destructive` variant that
   doesn't exist in `ui/button.tsx` (real variants: default, secondary,
   outline, ghost, link, accent); block demo fixtures used off-palette
   `placehold.co` placeholder images from the pre-rebrand colors.
4. **No admin guidance:** image dimensions, file types, character limits and
   CMS locations existed only in scattered Tina field descriptions and
   `docs/EDITING-GUIDE.md` — never on the page itself.
5. **Missing primitives:** shipped `ui/` components absent from the registry:
   form, field, item, menubar, sonner/toast, chart, sidebar.

## 5. Site inconsistencies observed (documented, NOT changed in this pass)

These are follow-up candidates; the design-system page now documents the site
as it is, including these:

1. **Legacy utility classes still in production** — `index.css` marks
   `.gumroad-card`, `.thumb-card`, `.tag-pill`, `.chip`, `.home-*` helpers as
   "to be retired by PRs 2–5" but they're still referenced by shipped
   components. The rebuilt Tokens section labels them **Legacy**.
2. **Mixed containers** — newer sections use `.bq-container` (1280px); older
   blocks still use Tailwind `container mx-auto max-w-3xl/4xl`, so section
   gutters vary slightly page to page.
3. **Legacy color aliases in use** — `orange`, `amber`, `rose`, `violet`,
   `moss` are repointed at the 2026 palette; new code should use the new names.
4. **No responsive images** — every image ships at original size; converting
   heavy PNG/JPG artwork to WebP and adding `srcSet`/`sizes` (or a transform
   service) is the single biggest performance win available.
5. **homeHero art is hardcoded** — the three floating cutouts
   (`/images/hero/*.webp`) are not CMS-editable, unlike every other image slot.
6. **Non-conforming media filenames** — a few root-level uploads have spaces /
   mixed case (`Screenshot 2026-05-12…`, `PNG Images Only/`), against the
   kebab-case convention.
7. **Gallery metadata is thin** — items carry title/image/description only; no
   structured medium, year, or dimensions (years live inside free text).

## 6. Recommended follow-ups (separate passes)

In rough priority order:

1. WebP/AVIF conversion + `srcSet`/`sizes` for gallery, products, and blog
   covers (biggest visitor-facing win).
2. Migrate remaining legacy utility classes and mixed containers to the
   current vocabulary (`.bq-container`, `.card-peel`, `.eyebrow`, …).
3. Make the homeHero floating images CMS-editable (three image fields).
4. Add optional structured gallery metadata (year, medium) to the Tina gallery
   collection.
5. Clean up non-kebab-case files at the `public/images/` root.
