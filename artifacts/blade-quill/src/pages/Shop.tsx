import { useState } from "react";
import { useLocation } from "wouter";
import { ShoppingBag, BookOpen, MonitorPlay, ShoppingCart, Check } from "lucide-react";
import {
  useListProducts,
  useListCategories,
  type ListProductsCategory,
  type Product,
  type Category,
} from "@workspace/api-client-react";
import { asArray } from "@/lib/api-helpers";
import { FALLBACK_PRODUCTS, FALLBACK_CATEGORIES } from "@/lib/fallback-data";
import { useCart } from "@/hooks/useCart";
import { useTina, tinaField } from "tinacms/react";
import shopData from "../../content/shop.json";
const TINA_DATA_SHOPDATA = { shop: shopData };

const shopQuery = `
  query shop($relativePath: String!) {
    shop(relativePath: $relativePath) {
      pageTitle
      pageDescription
      emptyHeading
      emptyDescription
    }
  }
`;

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  physical: BookOpen,
  digital: MonitorPlay,
  curriculum: BookOpen,
};

function AddToCartButton({ product }: { product: { id: number; name: string; price: number; imageUrl: string; category: string } }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl, category: product.category });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <button
      className="flex items-center gap-1.5 text-sm font-semibold bg-foreground text-background px-3 py-1.5 rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 hover:bg-foreground/80 active:scale-95"
      onClick={handleAdd}
    >
      {added
        ? <><Check className="w-3.5 h-3.5" />Added</>
        : <><ShoppingCart className="w-3.5 h-3.5" />Add to Cart</>}
    </button>
  );
}

export default function Shop() {
  const [, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState<ListProductsCategory | "all">("all");

  const { data: categoriesRaw } = useListCategories();
  const categories = asArray<Category>(categoriesRaw, FALLBACK_CATEGORIES);

  const { data: productsRaw, isLoading } = useListProducts(
    activeCategory === "all" ? {} : { category: activeCategory }
  );
  const products = asArray<Product>(productsRaw, FALLBACK_PRODUCTS);

  const { data } = useTina({
    query: shopQuery,
    variables: { relativePath: "shop.json" },
    data: TINA_DATA_SHOPDATA,
  });

  const content = data.shop;

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4 md:px-6">

        <div className="max-w-2xl mb-10">
          <h1
            className="text-3xl md:text-4xl font-display mb-3"
            data-tina-field={tinaField(content, "pageTitle")}
          >
            {content?.pageTitle}
          </h1>
          <p
            className="text-base text-muted-foreground"
            data-tina-field={tinaField(content, "pageDescription")}
          >
            {content?.pageDescription}
          </p>
        </div>

        {/* Gumroad-style category tag pills */}
        <div className="flex flex-nowrap overflow-x-auto gap-2 mb-10 pb-1 scrollbar-hide">
          <button
            onClick={() => setActiveCategory("all")}
            className={`tag-pill ${activeCategory === "all" ? "tag-pill-active" : "tag-pill-inactive"}`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            All
            {categories.length > 0 && (
              <span className="text-xs opacity-60">{categories.reduce((s, c) => s + c.productCount, 0)}</span>
            )}
          </button>
          {categories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id] ?? ShoppingBag;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as ListProductsCategory)}
                className={`tag-pill ${isActive ? "tag-pill-active" : "tag-pill-inactive"}`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
                <span className="text-xs opacity-60">{cat.productCount}</span>
              </button>
            );
          })}
        </div>

        {/* Product grid — Gumroad card style */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-muted rounded-xl h-96" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product) => (
              <div
                key={product.id}
                className="gumroad-card cursor-pointer group flex flex-col"
                onClick={() => setLocation(`/shop/${product.id}`)}
              >
                <div className="aspect-square overflow-hidden relative">
                  <span className="absolute top-3 left-3 z-10 text-[10px] uppercase tracking-widest font-bold bg-card/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-border">
                    {product.category}
                  </span>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-normal mb-1 group-hover:text-violet transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="price-badge">${product.price.toFixed(2)}</span>
                    <AddToCartButton product={product} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-border rounded-lg">
            <h3
              className="text-xl font-sans text-muted-foreground mb-2"
              data-tina-field={tinaField(content, "emptyHeading")}
            >
              {content?.emptyHeading || "No products found"}
            </h3>
            <p
              className="text-sm text-muted-foreground"
              data-tina-field={tinaField(content, "emptyDescription")}
            >
              {content?.emptyDescription || "Check back later for new releases."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
