# Blade & Quill Art Academy — Project Notes


## Summary (what we know so far)
Blade & Quill refers to Corinne’s brand + website project, associated with the domain [**bladeandquillacademy.com**](<http://bladeandquillacademy.com>).
This page consolidates notes and decisions captured across meeting notes + manual notes.
---
## Project goals / scope
From the working Statement of Work notes, the project includes:
- **Website redesign + build** on an agreed platform, including a **CMS** so Corinne can update content.
- **Information architecture**: sitemap, navigation, page structure, and reusable page patterns/templates.
- **Visual style + brand guide**: typography, color palette, usage rules, and key UI components.
- **E-commerce setup** for:
	- **Physical products** (books, and optionally merch later)
	- **Digital downloads**
	- Platform decision discussed as **Shopify** or **Gumroad** (TBD during discovery)
- **Social media icon integration** (links and placement across the site)
**Assumptions / TBD**
- Final platform selection and fees are client-owned (e.g., Shopify, Gumroad, Squarespace, etc.).
- Exact product types, shipping needs, and tax requirements to be confirmed.
---
## Brand + design direction
### Early direction (March discussion)
- Keep **Krita-derived brand colors**
- Font preference: **Sansita** (important to Corinne; discussed as available under Open Font License 1.1)
- Primary design inspiration: [**Proko.com**](<http://Proko.com>) style (clean, education-focused)
- Preference for subtle, professional animations (not flashy)
- Corinne to create a **custom drawn quill logo**
### Design review outcomes (April 3 review; logged April 10)
Three options were reviewed; the selected direction became:
- **Typography from Option 1**
	- Young Seraph for titles
	- Gil Sands (similar to Montserrat) for body
- Combined with **Option 2’s color scheme**
	- Gradients + primary colors
	- Gradient buttons
- Preference callouts:
	- Keep brand colors for recognition
	- Larger hero image version preferred over circular image
---
## Content strategy & information architecture (IA)
### Simplification goals
- Reduce confusing / overly nested navigation (noted as a pain point in Squarespace).
- Reorganize content so users can find things more easily.
### Remove / keep decisions
- **Remove the tutorials section** from the website (and/or remove tutorial pages), with the intent to link out to YouTube rather than hosting a large tutorials area on-site.
- It’s okay to **embed the most recent YouTube video** on the homepage (with a link to the channel).
- “Free guides” / resources remain important (a major traffic driver via YouTube).
- Add/maintain sections discussed:
	- Shop (books, etc.)
	- Digital downloads
	- Gallery concepts (with Pinterest/Instagram as options)
	- Blog / “learn how to” content
	- Portfolio section aimed at **literary agents** (mentioned in March)
---
## CMS / build approach (as discussed)
- CMS should feel easy to edit (Squarespace-like ease of editing was explicitly valued).
- Tina CMS was demonstrated, including “live editing” and immediate saving.
- Existing content migration was discussed as already underway / successful.
---
## Analytics (important requirement)
- Analytics are “very important” to Corinne.
- **GA4 Measurement ID:** `G-50YS8RZ7HL` (same property as Squarespace `bladeandquillartacademy.com`).
- Public site fires page views + conversion events (`purchase`, `amazon_click`, `dummy_book_request`).
- Owner Studio at `/insights` (Tina login required): sessions, bounce rate, Stripe sales, Amazon clicks, dummy-book requests, recent orders. Tina sidebar → Insights.
- Suggested experiment: remove tutorials from current Squarespace site and monitor impact on visits.
---
## Traffic & audience signals captured in notes
### Website traffic (two snapshots recorded)
- March: ~**60 visits/day** average (range noted as 5–102), 1,700+ visits YTD (mostly desktop with significant mobile).
- April: ~**20 visits/day** (~160/week, ~2000/month) noted via Google Analytics.
### YouTube as primary driver
- YouTube channel described as a major source of traffic (nearly 1.5M views from 65 countries; engagement and subscriber growth mentioned).
---
## E-commerce, monetization, and platform constraints
### What Corinne sells / wants to sell
- Digital guides / ebooks
- Video courses
- Lilou and Luna books (interest in moving away from Amazon)
- Possible merch later
### Constraints & concerns
- Amazon royalties cited as low (example: $16 book → $4.50 received).
- Prior Shopify experience described as complicated (tax issues across states).
- Gumroad currently used; Shopify and Gumroad were both discussed as candidates depending on needs.
### Support / donations
- Ko-fi (“Buy me a coffee”) support option is part of the current ecosystem (noted supporter count in March notes).
---
## Social / integrations
- Remove **Twitter/X** and **Facebook**.
- Keep **Pinterest** connected (used for ad campaigns; follower count noted in meeting).
- Keep YouTube as primary; Instagram/TikTok also referenced as relevant.
- Email list noted as currently managed via Google/Squarespace → Google Sheets; email tooling costs/pain were mentioned.
---
## Timeline & costs noted
- Target completion discussed: before **August 21** (Squarespace renewal date).
- Squarespace cost noted: **$276/year**.
- Additional annual costs captured (domain, Canva Pro, Microsoft 365) and approximate annual revenue were discussed in March notes.
- “3 months is a lot of time” was noted as a sentiment/constraint.
---
## Open items / action items captured in notes (non-exhaustive)
- Propose / finalize simplified IA (navigation, page structure, page patterns)
- Confirm design system decisions (fonts, colors, animation specs)
- Confirm platform + integrations for e-commerce + courses (Shopify API or alternatives)
- Corinne: backup all existing content before migration
- Corinne: explore Patreon (membership features)
- Corinne: create custom quill logo
- Apply selected styling direction to templates (e.g., blog template)
- ~~Integrate Google Analytics (and/or create an analytics page)~~ — done (`G-50YS8RZ7HL` + `/insights`)
- Content experiments: remove tutorials on current site and monitor impact

<empty-block/>

> **For Cursor:** Read this file when working on Corinne's site. It captures brand context, site structure, and owner notes. **Paste new notes into the sections marked below** — keep factual project details up to date when the site changes.

**Owner:** Corinne Hadaway  
**Brand:** Blade & Quill Art Academy  
**Repo:** `artifacts/blade-quill/` (frontend) in [blade-quill-art-academy](https://github.com/njt-design/blade-quill-art-academy)

---

## About Corinne & the brand

Corinne is a **French author and illustrator** who runs Blade & Quill Art Academy — an art-education brand focused on **digital painting in Krita**, character design, and chibi-style illustration.

**Signature work:** *Lheeloo & Luna* (illustrated book).  
**Roles she identifies with:** Author, illustrator, educator, Krita artist.

**Primary channels:**
- This website (shop, gallery, blog, downloads, classes promo)
- YouTube: [Blade & Quill Art Academy](https://www.youtube.com/c/BladeQuillartacademy) — new videos roughly bi-weekly
- Amazon (book): [Lheeloo & Luna](https://www.amazon.com/dp/1733168451)
- Ko-fi: [bladeandquill](https://ko-fi.com/bladeandquill)

**Tone (from existing copy):** Warm, encouraging, practical — aimed at artists learning Krita from beginner through intermediate skill levels.

---

## What the website does

| Area | Purpose |
|------|---------|
| **Shop** | Physical books, digital ebooks/guides (Stripe checkout) |
| **Gallery** | Showcase artwork |
| **Downloads** | Free resources (brushes, assets, etc.) |
| **Blog** | News, art tips, behind-the-scenes (Tina markdown posts) |
| **About / Contact** | Bio, skills, contact form |
| **Homepage** | Hero, books, Krita classes CTA, featured YouTube tutorial, recent blog, newsletter |
| **CMS** | TinaCMS at `/admin` for editing copy and content |
| **Design system** | Internal page at `/design-system` (dev) |

**Not a public page (removed):** Standalone `/tutorials` listing — tutorial discovery is via homepage featured embed + YouTube. Tina `tutorials` collection may still exist for CMS/API data.

**Planned / placeholder routes:** `/classes` (linked from homepage; page may 404 until built).

---

## Site map (public routes)

```
/                 Home
/shop             Shop
/shop/:slug       Product detail (Tina `content/products/*.json`; numeric IDs still work)
/cart             Cart
/education        Education landing (newest YouTube video + gallery/downloads previews)
/gallery          Gallery
/downloads        Downloads
/blog             Blog list
/blog/:slug       Blog post
/about            About Corinne
/contact          Contact
/important-links-page   Standalone review-link hub (launched on temp domain)
/p/:slug          Marketing landing pages (Tina)
/preview/:slug    Homepage style previews (dev)
/design-system    Component showcase (dev)
```

**Navbar:** Shop (CTA), Education, Blog, About, Publishers, Contact  
**Footer:** Same pages + social links (YouTube, Instagram, Amazon, Ko-fi) + admin entry

---

## Homepage structure (current)

Order is intentional — do not reorder without explicit request:

1. **Hero** — Word-reveal headline, rotating roles, shop + YouTube CTAs, marquee strip
2. **Books & Ebooks** — Shop products (physical/digital), snap carousel on mobile
3. **Krita Classes** — Enrollment panel (`/classes` CTA)
4. **Featured Video Tutorial** — One embedded YouTube lesson from API
5. **Recent Blog Posts** — Latest 3 posts
6. **Newsletter** — Email capture (toast only; no backend yet)

Content source: `content/home.json` + Tina `home` collection.

---

## Design & technical constraints

See also `.cursorrules` for implementation rules.

- **Fonts:** Young Serif (display / h1 only), Quicksand (body, headings)
- **Colors:** Semantic tokens + brand (`orange`, `amber`, `violet`, `rose`, `charcoal`) — no raw hex in components
- **Homepage utilities:** `.home-section`, `.home-card`, `.home-panel`, `.home-media-mask`, marquees, scroll effects — shop/blog pages still use `.gumroad-card`
- **Reduced motion:** All scroll/marquee effects must respect `prefers-reduced-motion`

**Dev server:**
```bash
pnpm --filter @workspace/blade-quill run dev
# App: http://localhost:3000  (proxy) or http://localhost:3001 (Vite direct)
# Tina: http://localhost:3000/admin/index.html
```

---

## Content files (quick reference)

| File | What it controls |
|------|------------------|
| `content/home.json` | Homepage sections |
| `content/about.json` | About page |
| `content/posts/*.json` | Blog posts |
| `content/tutorials.json` | Tutorials page copy (CMS; no public page) |
| `tina/config.ts` | Tina schema & field labels |

---

## Your notes

*Paste Corinne's feedback, meeting notes, copy drafts, priorities, and decisions below. Cursor should treat this section as the source of truth for product direction when it conflicts with older chat context.*

### Vision & goals

<!-- Paste here -->

### Audience

<!-- Paste here -->

### Copy & messaging

<!-- Paste here -->

### Homepage / design feedback

<!-- Paste here -->

### Shop & products

- **Tina admin:** Sidebar → **Shop Products** — one JSON file per product under `content/products/`. Filename becomes the URL slug (`/shop/your-file-name`).
- **Product ID:** Numeric `productId` field — used for cart and Stripe checkout when the API is running.
- **Shop page copy:** Still edited under **Shop Page** (`content/shop.json`).
- **API fallback:** If no Tina product files exist, the site falls back to the Express API / `FALLBACK_PRODUCTS`.

<!-- Paste here -->

### Classes & education

<!-- Paste here -->

### Blog & content calendar

<!-- Paste here -->

### Integrations & tools

<!-- e.g. email provider, analytics, domain, hosting -->

<!-- Paste here -->

### Open questions

<!-- Paste here -->

### Decisions log

| Date | Decision | Notes |
|------|----------|-------|
| | | |

---

## Changelog (optional)

*Record major site changes here so future sessions have context.*

| Date | Change |
|------|--------|
| 2026-05 | Homepage redesign: Proko-style section order, Nestig polish, cinematic scroll |
| 2026-05 | Removed public `/tutorials` page; nav link removed; CTAs → YouTube |
| 2026-05 | Fixed Footer `FaAmazon` icon (was breaking entire app load) |
| 2026-07 | Header menu + footer link columns now CMS-driven via Tina "Navigation" document (`content/navigation/main.json`); supports reordering, one-level dropdowns, and linking to any page |
| 2026-09 | Added `/education` landing page: hero, auto-updating "Newest video" YouTube feature (`/api/youtube-latest`, no API key), Gallery + Downloads preview sections. Gallery/Downloads removed from the main nav (pages still live at `/gallery` and `/downloads`; footer links kept). New blocks: `featuredVideo`, `galleryPreview`, `downloadsPreview` |
