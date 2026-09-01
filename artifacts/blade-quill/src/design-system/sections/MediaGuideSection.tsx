import { Section } from "../components/Section";

/**
 * Admin reference for uploading images and files — formats, folders,
 * dimensions per surface, and the site's fit conventions. Companion to
 * docs/EDITING-GUIDE.md.
 */

const DIMENSIONS: {
  surface: string;
  size: string;
  aspect: string;
  folder: string;
}[] = [
  {
    surface: "Hero backgrounds",
    size: "~1920×1080 or larger",
    aspect: "Wide landscape (16:9)",
    folder: "images/pages/",
  },
  {
    surface: "Blog cover images",
    size: "~1600×900",
    aspect: "16:9",
    folder: "images/blog/",
  },
  {
    surface: "Product cover images",
    size: "≥1200px wide",
    aspect: "Square or 3:4 portrait",
    folder: "images/products/",
  },
  {
    surface: "Product look-inside spreads",
    size: "≥1200px wide",
    aspect: "Landscape",
    folder: "images/products/",
  },
  {
    surface: "Gallery artworks",
    size: "≥1200px on the long edge",
    aspect: "Any — natural shape is kept",
    folder: "images/gallery/",
  },
  {
    surface: "Book covers (Featured Release)",
    size: "≥1200px wide",
    aspect: "Tall portrait (~2:3)",
    folder: "images/pages/",
  },
  {
    surface: "In-page images (galleries, spotlights)",
    size: "≥1200px on the long edge",
    aspect: "Match the block's frame",
    folder: "images/pages/",
  },
  {
    surface: "Downloads & PDFs",
    size: "—",
    aspect: "PDF / ZIP / JPG / PNG",
    folder: "files/",
  },
];

export function MediaGuideSection() {
  return (
    <Section id="media-guide" title="Images & Media">
      <p className="text-muted-foreground reading-width -mt-2">
        Everything an admin needs to know before uploading. Upload through
        Tina's media library (the image field picker) — files land in the
        site's <code className="font-mono text-sm">images/</code> folder.
      </p>

      <div>
        <h3 className="text-lg mb-4">Accepted file types</h3>
        <table className="w-full text-left text-sm">
          <tbody>
            <tr className="border-t border-border/50">
              <td className="py-2 pr-4 font-medium whitespace-nowrap align-top">
                JPG / WebP
              </td>
              <td className="py-2 text-muted-foreground">
                Photos and painted artwork. WebP is smaller at the same quality —
                prefer it when exporting.
              </td>
            </tr>
            <tr className="border-t border-border/50">
              <td className="py-2 pr-4 font-medium whitespace-nowrap align-top">PNG</td>
              <td className="py-2 text-muted-foreground">
                Only when transparency or crisp line art is needed (cutouts,
                screenshots). Much heavier than JPG/WebP for photos.
              </td>
            </tr>
            <tr className="border-t border-border/50">
              <td className="py-2 pr-4 font-medium whitespace-nowrap align-top">SVG</td>
              <td className="py-2 text-muted-foreground">
                Icons and logos only — never for artwork or photos.
              </td>
            </tr>
            <tr className="border-t border-border/50">
              <td className="py-2 pr-4 font-medium whitespace-nowrap align-top">
                PDF / ZIP
              </td>
              <td className="py-2 text-muted-foreground">
                Downloadables (coloring pages, dummy books, brush packs) — these
                belong in the <code className="font-mono text-xs">files/</code>{" "}
                folder, not <code className="font-mono text-xs">images/</code>.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="text-lg mb-4">Dimensions by surface</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[560px]">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-2 pr-4 font-medium">Surface</th>
                <th className="py-2 pr-4 font-medium">Size</th>
                <th className="py-2 pr-4 font-medium">Shape</th>
                <th className="py-2 font-medium">Upload folder</th>
              </tr>
            </thead>
            <tbody>
              {DIMENSIONS.map((d) => (
                <tr key={d.surface} className="border-b border-border/50">
                  <td className="py-2 pr-4">{d.surface}</td>
                  <td className="py-2 pr-4 text-muted-foreground">{d.size}</td>
                  <td className="py-2 pr-4 text-muted-foreground">{d.aspect}</td>
                  <td className="py-2 font-mono text-xs">{d.folder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-lg mb-4">Fit rule: contain vs. cover</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="rounded-lg border border-border p-4">
            <p className="font-medium mb-1">Artwork is never cropped</p>
            <p className="text-muted-foreground">
              Gallery artworks, product covers, download thumbnails, and image
              spotlights scale to fit their frame (contain). Whatever you upload
              is shown whole.
            </p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="font-medium mb-1">Marketing tiles crop to fill</p>
            <p className="text-muted-foreground">
              Pillars cards, card rows, timeline images, floating hero tiles,
              and full-bleed hero backgrounds fill their frame (cover). Keep the
              subject centered — edges get trimmed on some screens.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg mb-4">House rules</h3>
        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
          <li>
            <span className="text-foreground font-medium">File size:</span> aim
            for under ~500 KB per image (export JPG/WebP around quality 80).
            Anything over 1–2 MB slows the page for visitors — there is no
            automatic resizing.
          </li>
          <li>
            <span className="text-foreground font-medium">Naming:</span>{" "}
            lowercase kebab-case, descriptive:{" "}
            <code className="font-mono text-xs">chibi-dragon-flying.jpg</code> —
            no spaces or capital letters.
          </li>
          <li>
            <span className="text-foreground font-medium">Alt text:</span>{" "}
            describe the image in a short sentence (≤125 characters) for screen
            readers. Skip "image of…" — just say what's in it.
          </li>
          <li>
            <span className="text-foreground font-medium">Captions:</span>{" "}
            optional, ≤80 characters, shown to everyone under the image.
          </li>
          <li>
            <span className="text-foreground font-medium">Character limits:</span>{" "}
            text fields warn "Too long" in the editor — shorten until the
            warning clears so the design still fits.
          </li>
        </ul>
      </div>
    </Section>
  );
}
