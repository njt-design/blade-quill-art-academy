# Editing your site (Corinne’s guide)

A one-page guide to changing Blade & Quill content without touching code.

## Your bookmark (always use this)

**Editor:** [https://blade-quill-art-academy.vercel.app/admin](https://blade-quill-art-academy.vercel.app/admin)

While `bladeandquillartacademy.com` shows the Under Construction page, editing still works on the Vercel URL above. The footer “Edit site” link on the live preview also goes there. Prefer this bookmark over guessing `/admin` on other domains.

Sign in with the Tina Cloud account Nick set up for you.

## What each sidebar section means

| Sidebar | What you edit |
|---------|----------------|
| **Site Pages** | Home, About, Shop, Gallery, Downloads, Contact, etc. (can’t delete these) |
| **New Pages** | Extra pages you create (events, promos, link-in-bio) |
| **Blog Posts** | Blog articles |
| **Shop Products** | Product name, price, image, stock — prices here drive Stripe checkout |
| **Menu & Footer** | Header menu + footer link columns |
| **Insights** (Dashboard) | Traffic & sales glance (not for editing pages) |

## Everyday editing (click-to-edit)

1. Open the bookmark and sign in.
2. Click a page, post, or product in the sidebar.
3. The right side shows a live preview of the site. **Click the text or image** you want to change.
4. Edit in the form (or inline). Watch the preview update.
5. Click **Save**.

### Did it save?

- Yes — Tina writes a commit to GitHub. You should see a brief confirmation in the editor.
- On the public preview site (same Vercel host), a small status pill appears **if you’re still signed into the editor in that browser**: “Showing your latest saved content” within a few seconds.
- A full site rebuild also runs (~50 seconds). Even if live refresh hiccups, the save is in GitHub and will appear after that deploy.

If you’re unsure: refresh the public page. If the change is there, you’re done.

## Common tasks

### Change homepage copy or a section

1. **Site Pages → Home**
2. Click the section in the preview, or open **Page Sections** in the form.
3. Edit headings/buttons/images. Drag sections to reorder.
4. Save.

### Add a blog post

1. **Blog Posts →** create new.
2. Fill Title, Excerpt, Cover Image (upload into `images/blog/` when possible), Body.
3. Set Publish Date.
4. Save. It appears at `/blog/your-title`.

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
- Suggested folders: `images/pages/`, `images/products/`, `images/blog/`, `images/nav/`.
- Heroes: wide landscape (~1920×1080). Blog covers: ~1600×900 (16:9). Products: square or tall portrait, ≥1200px wide.
- Field descriptions show character limits — if the editor warns “Too long”, shorten so the design still fits.

## If something looks broken

1. Confirm you’re on **blade-quill-art-academy.vercel.app/admin** (not the under-construction domain alone).
2. Hard-refresh the browser (Cmd+Shift+R).
3. Sign out of Tina, sign back in.
4. If `/admin` shows “Failed loading TinaCMS assets” or errors after login — stop and message Nick. That usually means a developer rebuild step was skipped; it’s not something you caused by editing content.

## Who to call

Content questions or “I saved but don’t see it”: Nick.  
Tina login / password reset: Nick (or Tina Cloud account email).

---

*Tip: keep one browser tab on `/admin` and another on the public site. After Save, refresh the public tab — you should see the change within seconds.*
