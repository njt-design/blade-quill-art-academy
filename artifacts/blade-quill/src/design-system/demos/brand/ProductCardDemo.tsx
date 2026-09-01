import { ProductCard } from "@/components/site/ProductCard";
import { loadCatalogProducts } from "@/lib/products";

export default function ProductCardDemo() {
  const products = loadCatalogProducts().slice(0, 2);
  if (products.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No products in the catalog yet — add one under Shop Products in Tina.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl">
      {products.map((product, i) => (
        <ProductCard key={product.slug} product={product} index={i} />
      ))}
    </div>
  );
}
