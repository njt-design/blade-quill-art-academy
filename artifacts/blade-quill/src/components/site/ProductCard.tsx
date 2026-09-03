import { Link } from "wouter";
import type { CatalogProduct } from "@/lib/products";
import { ArtTile, type ArtTilePalette } from "./ArtTile";
import { BookCover, type BookCoverPalette } from "./BookCover";

interface ProductCardProps {
  product: CatalogProduct;
  /** Card height in px (media area). */
  size?: "md" | "lg";
  /** Optional explicit cover palette; otherwise rotated based on index. */
  palette?: ArtTilePalette;
  /** Used to rotate placeholder palettes across a grid. */
  index?: number;
}

const ROTATION: ArtTilePalette[] = [
  "warm",
  "violet",
  "rose",
  "twilight",
  "moss",
];

const BOOK_PALETTES: BookCoverPalette[] = ["warm", "rose", "violet"];

function eyebrowLabel(category: string) {
  if (category === "physical") return "BOOK";
  if (category === "curriculum") return "CURRICULUM";
  if (category === "digital") return "DOWNLOAD";
  return category.toUpperCase();
}

/**
 * Shop product card. Renders a `BookCover` for physical books and an
 * `ArtTile` for everything else. Hover lifts the media area and reveals
 * the page-corner peel.
 */
export function ProductCard({
  product,
  size = "md",
  palette,
  index = 0,
}: ProductCardProps) {
  const isBook = product.category === "physical";
  const palWarm: ArtTilePalette = palette || ROTATION[index % ROTATION.length];
  const palBook: BookCoverPalette =
    (palette as BookCoverPalette) || BOOK_PALETTES[index % BOOK_PALETTES.length];
  const mediaHeight = size === "lg" ? 320 : 260;

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="product-card card-peel block group"
      style={{ position: "relative" }}
    >
      <div
        className="product-media"
        style={{
          position: "relative",
          height: mediaHeight,
          borderRadius: 14,
          overflow: "hidden",
          background: "var(--paper-3)",
          boxShadow: "var(--sh-paper)",
          transition:
            "box-shadow .35s var(--e-out), transform .35s var(--e-out)",
        }}
      >
        {isBook ? (
          <div
            className="flex items-center justify-center w-full h-full"
            style={{
              background: "var(--paper-2)",
              padding: 24,
            }}
          >
            <BookCover
              title={product.name}
              subtitle="C. HADAWAY"
              palette={palBook}
              src={product.imageUrl}
              alt={product.name}
              width={mediaHeight * 0.55}
              height={mediaHeight * 0.78}
            />
          </div>
        ) : (
          <ArtTile
            palette={palWarm}
            width="100%"
            height="100%"
            src={product.imageUrl}
            alt={product.name}
            label={product.category}
            radius={14}
          />
        )}

        <span
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            background: "rgba(223,210,204,0.95)",
            color: "var(--ink)",
            fontFamily: "var(--f-mono)",
            fontSize: 10,
            letterSpacing: "0.12em",
            padding: "5px 10px",
            borderRadius: 999,
          }}
        >
          {eyebrowLabel(product.category)}
        </span>

        {product.featured && (
          <span
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              background: "var(--g-cta)",
              color: "var(--paper)",
              fontFamily: "var(--f-mono)",
              fontSize: 10,
              letterSpacing: "0.12em",
              padding: "5px 10px",
              borderRadius: 999,
            }}
          >
            NEW
          </span>
        )}
      </div>

      <div className="pt-4 px-1 pb-1">
        <div
          className="mb-1.5"
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "var(--ink)",
            lineHeight: 1.35,
          }}
        >
          {product.name}
        </div>
        <div className="flex items-baseline justify-between">
          <span
            style={{
              fontFamily: "var(--f-serif)",
              fontSize: 22,
              color: "var(--ink)",
            }}
          >
            ${product.price.toFixed(2)}
          </span>
          <span
            className="card-arrow"
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: 14,
              color: "var(--maroon)",
            }}
          >
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
