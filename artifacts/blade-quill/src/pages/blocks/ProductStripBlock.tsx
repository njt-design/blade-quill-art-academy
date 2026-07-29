import { useMemo } from "react";
import { useLocation } from "wouter";
import { tinaField } from "tinacms/react";
import { useListProducts } from "@workspace/api-client-react";
import { useLiveProducts } from "@/hooks/use-live-content";
import { FALLBACK_PRODUCTS } from "@/lib/fallback-data";
import { hasCatalogProducts, resolveCatalogProducts } from "@/lib/products";
import { Btn } from "@/components/site/Btn";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { type Block, followLink } from "./block-utils";
import { SectionHeading, sectionAlignStyle } from "./text-style";

interface Props {
  block: Block;
}

export default function ProductStripBlock({ block }: Props) {
  const [, setLocation] = useLocation();

  const catalog = useLiveProducts();
  const { data: products } = useListProducts(undefined, {
    query: { enabled: !hasCatalogProducts() },
  });
  const allProducts = useMemo(
    () => resolveCatalogProducts(products, FALLBACK_PRODUCTS, catalog),
    [products, catalog]
  );

  return (
    <section className="py-24 lg:py-28" style={{ background: "var(--paper)" }}>
      <div className="bq-container">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-9">
          <div style={sectionAlignStyle(block)}>
            {block.eyebrow ? (
              <Reveal>
                <div className="eyebrow-grad mb-3.5" data-tina-field={tinaField(block, "eyebrow")}>
                  {block.eyebrow as string}
                </div>
              </Reveal>
            ) : null}
            <Reveal>
              <SectionHeading
                block={block}
                defaultTag="h2"
                baseSize="clamp(32px, 4vw, 48px)"
              >
                {(block.heading as string) || "From the shop."}
              </SectionHeading>
            </Reveal>
          </div>
          {block.viewAllLabel ? (
            <Reveal>
              <Btn
                kind="ghost"
                iconRight="→"
                onClick={() =>
                  followLink(setLocation, block.viewAllLink as string | undefined, "/shop")
                }
              >
                <span data-tina-field={tinaField(block, "viewAllLabel")}>
                  {block.viewAllLabel as string}
                </span>
              </Btn>
            </Reveal>
          ) : null}
        </div>

        <Reveal stagger>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {allProducts.slice(0, 4).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
