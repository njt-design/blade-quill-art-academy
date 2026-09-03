# Editing your site (Corinne’s guide)

A one-page guide to changing Blade & Quill content without touching code.

## Your bookmark (always use this)

**Editor:** [https://blade-quill-art-academy.vercel.app/admin](https://blade-quill-art-academy.vercel.app/admin)

While `bladeandquillartacademy.com` shows the Under Construction page, editing still works on the Vercel URL above. The footer “Edit site” link on the live preview also goes there. Prefer this bookmark over guessing `/admin` on other domains.

Sign in with the Tina Cloud account Nick set up for you.

## What each sidebar section means

| Sidebar | What you edit |
|---------|----------------|
| **Main Pages** | Home, About, Shop, Education, Gallery, Downloads, Contact, etc. (can’t delete these) |
| **Featured Pages** | Extra pages you create (events, promos, link-in-bio) |
| **Blog Posts** | Blog articles |
| **Shop Products** | Product name, price, image, stock — prices here drive Stripe checkout |
| **Menu & Footer** | Header menu + footer link columns |
| **Insights** (Dashboard) | Traffic & sales glance (not for editing pages) |

## Everyday editing (click → sidebar)

Tina works a little differently from Squarespace:

1. Open the bookmark and sign in.
2. Click a page, post, or product in the sidebar.
3. The right side shows a live preview of the site. **Click the text or image** you want to change — that **selects** it and opens the matching fields in the Tina sidebar (you usually type in the sidebar, not directly on the page).
4. As you edit in the sidebar, the **preview updates live**.
5. Click **Save**.

### Did it save?

- Yes — Tina writes a commit to GitHub. You should see a brief confirmation in the editor.
- Keep a second browser tab open on the **public** site (`blade-quill-art-academy.vercel.app`, not the under-construction domain). After Save, switch to that tab (or click it) — a small status pill appears **if you’re still signed into the editor in that browser**, and the page refreshes the content within a few seconds without waiting for a full deploy.
- Pill messages you might see:
  - “Checking for saved updates…” / “Waiting for your save to finish publishing…” — still catching up (usually seconds).
  - “Showing your latest saved content” — you’re looking at the saved version.
  - “Live refresh unavailable…” — rare; wait ~50s for the automatic rebuild, or hard-refresh later.
- A full site rebuild also runs in the background (~50 seconds). Even if live refresh hiccups, the save is in GitHub and will appear after that deploy.

If you’re unsure: focus or refresh the public tab. If the change is there, you’re done.

## Common tasks

### Change homepage copy or a section

1. **Main Pages → Home**
2. Click the section in the preview, or open **Page Sections** in the form.
3. Edit headings/buttons/images. Drag sections to reorder.
4. Save.

### Changing text size and style

Most page sections have a **Text Style** group near the bottom of the form. Leave everything on **Default** to keep the design as-is. Or pick:

| Control | What it does |
|---------|----------------|
| **Heading Size** | Smaller / Larger / Extra Large — scales that section’s heading (mobile stays readable) |
| **Heading Type** | Page Title (H1) / Section Heading (H2) / Sub-heading (H3) — for structure/SEO; size is separate |
| **Heading Font** | Serif (Young Serif) or Sans (Quicksand) |
| **Text Alignment** | Left or Center |
| **Body Text Size** | Large — for the supporting text under the heading |

Changes show live in the preview. Save when you’re happy. If a section looks wrong, set the controls back to Default.

### Add a blog post

1. **Blog Posts →** create new.
2. Fill Title, Excerpt, Cover Image (upload into `images/blog/` when possible), and Publish Date.
3. Build the article with **Post Sections** (same idea as page sections):
   - **Heading** — section title (optional number for “1. …”)
   - **Text** — paragraphs, lists, links, inline images
   - **Spacer** — breathing room between sections (not a page break)
   - **Divider** — a soft line or dots between topics
   - **Image** / **Image Pair** / **Gallery** — captioned photos
   - **Video** — YouTube embed
   - **Callout / Tip** — highlighted tip box
   - **End CTA** — soft call-to-action at the end
4. Drag sections to reorder. Optionally turn on **Show Table of Contents** to auto-list your Heading sections under the excerpt.
5. Save. It appears at `/blog/your-title`.

### Add or edit a shop product

1. **Shop Products**
2. Edit Name, Description, **Price (USD)**, Category, Cover Image (prefer `images/products/`).
3. Toggle **In Stock** / **Featured** as needed.
4. For digital products, set **Download URL** (e.g. `/files/…`).
5. **Product ID (advanced):** only when creating a *new* product — pick the next unused number and never renumber old ones.
6. Save. Preview at `/shop/your-product-slug`. You can click the title, price, description, and image in the preview to edit.

### Change the menu or footer

1. **Menu & Footer → main**
2. Edit Menu Items (header) or Footer Columns.
3. Prefer **Link Type → Site page** so links can’t typo. Use **Site link** for `/blog` or `/cart`. Use **External URL** for YouTube/Amazon/etc.
4. Save. Preview opens on the homepage.

## Images

- Upload through Tina’s media library (the image field picker).
- Suggested folders: `images/pages/`, `images/products/`, `images/blog/`, `images/gallery/`, `images/nav/`.
- Heroes: wide landscape (~1920×1080). Blog covers: ~1600×900 (16:9). Products: square or tall portrait, ≥1200px wide. Gallery artwork: ≥1200px on the long edge.
- Field descriptions show character limits — if the editor warns “Too long”, shorten so the design still fits.
- **Full reference:** [blade-quill-art-academy.vercel.app/design-system](https://blade-quill-art-academy.vercel.app/design-system) shows every page section with its image sizes, file types, and character limits (see the **Images & Media** section at the bottom for the complete upload guide).

## If something looks broken

1. Confirm you’re on **blade-quill-art-academy.vercel.app/admin** (not the under-construction domain alone).
2. Hard-refresh the browser (Cmd+Shift+R).
3. Sign out of Tina, sign back in.
4. If `/admin` shows “Failed loading TinaCMS assets” or errors after login — stop and message Nick. That usually means a developer rebuild step was skipped; it’s not something you caused by editing content.

## Who to call

Content questions or “I saved but don’t see it”: Nick.  
Tina login / password reset: Nick (or Tina Cloud account email).

---

*Tip: keep one browser tab on `/admin` and another on the public site (`blade-quill-art-academy.vercel.app`). After Save, switch to the public tab — it should pick up the change within a few seconds (no hard refresh required). Do not check `bladeandquillartacademy.com` until the Under Construction gate is removed.*
