import type { Product } from "@workspace/api-client-react";
import { HomeSectionHeader } from "./HomeSectionHeader";
import { ParallaxImage } from "./ParallaxImage";
import {
  SectionReveal,
  SectionRevealItem,
  SectionRevealStagger,
} from "./SectionReveal";

export type BooksSectionContent = {
  heading?: string | null;
  subheading?: string | null;
  viewAllLabel?: string | null;
};

type Props = {
  content?: BooksSectionContent | null;
  products: Product[];
  onNavigate: (path: string) => void;
};

function BookCard({
  product,
  onNavigate,
}: {
  product: Product;
  onNavigate: (path: string) => void;
}) {
  return (
    <div
      className="home-card group cursor-pointer h-full flex flex-col"
      onClick={() => onNavigate(`/shop/${product.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onNavigate(`/shop/${product.id}`);
        }
      }}
    >
      <div className="home-media-mask">
        <div className="aspect-[4/3] overflow-hidden">
          <ParallaxImage
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
          />
        </div>
      </div>
      <div className="p-5 md:p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="font-normal text-foreground group-hover:text-violet transition-colors line-clamp-2">
            {product.name}
          </h3>
          <span className="price-badge whitespace-nowrap">
            ${product.price.toFixed(2)}
          </span>
        </div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
          {product.category === "physical" ? "Book" : "Ebook"}
        </p>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
      </div>
    </div>
  );
}

export function BooksSection({ content, products, onNavigate }: Props) {
  const books = products
    .filter((p) => p.category === "physical" || p.category === "digital")
    .slice(0, 3);

  const cardList =
    books.length > 0
      ? books.map((product) => (
          <SectionRevealItem key={product.id} className="home-snap-item">
            <BookCard product={product} onNavigate={onNavigate} />
          </SectionRevealItem>
        ))
      : Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="home-snap-item bg-muted rounded-3xl animate-pulse aspect-[4/3]"
          />
        ));

  return (
    <SectionReveal className="home-section">
      <div className="container mx-auto px-4 md:px-6">
        <HomeSectionHeader
          content={content}
          eyebrow="Shop"
          heading={content?.heading || "Books & Ebooks"}
          subheading={
            content?.subheading ||
            "Illustrated books and digital guides to level up your Krita workflow."
          }
          viewAllLabel={content?.viewAllLabel || "View All"}
          onViewAll={() => onNavigate("/shop")}
        />

        <SectionRevealStagger className="home-scroll-snap lg:grid lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {cardList}
        </SectionRevealStagger>
      </div>
    </SectionReveal>
  );
}
