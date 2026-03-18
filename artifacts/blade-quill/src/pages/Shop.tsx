import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ShoppingBag, BookOpen, MonitorPlay } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import type { ListProductsCategory } from "@workspace/api-client-react";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart, Check } from "lucide-react";
import { useState as useLocalState } from "react";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  physical: BookOpen,
  digital: MonitorPlay,
  curriculum: BookOpen,
};

function AddToCartButton({ product }: { product: { id: number; name: string; price: number; imageUrl: string; category: string } }) {
  const { addItem } = useCart();
  const [added, setAdded] = useLocalState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl, category: product.category });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      className="gap-1.5"
      onClick={handleAdd}
    >
      {added ? <><Check className="w-3.5 h-3.5 text-green-400" /><span className="text-green-400">Added!</span></> : <><ShoppingCart className="w-3.5 h-3.5" />Add to Cart</>}
    </Button>
  );
}

export default function Shop() {
  const [, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState<ListProductsCategory | "all">("all");

  const { data: categories } = useListCategories();
  const { data: products, isLoading } = useListProducts(
    activeCategory === "all" ? {} : { category: activeCategory }
  );

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 mt-8">
          <h1 className="text-5xl font-display mb-6">The Academy Shop</h1>
          <p className="text-lg text-muted-foreground">
            Get your hands on the Lheeloo & Luna book, level up with Krita guides, and access exclusive premium curriculums.
          </p>
        </div>

        {/* Categories — data-driven */}
        <div className="flex flex-nowrap overflow-x-auto gap-3 mb-16 pb-2 scrollbar-hide justify-start md:justify-center">
          <Button
            variant={activeCategory === "all" ? "default" : "outline"}
            onClick={() => setActiveCategory("all")}
            className="gap-2 rounded-full shrink-0"
          >
            <ShoppingBag className="w-4 h-4" />
            All Products
            {categories && <span className="ml-1 text-xs opacity-60">({categories.reduce((s, c) => s + c.productCount, 0)})</span>}
          </Button>
          {categories?.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id] ?? ShoppingBag;
            const isActive = activeCategory === cat.id;
            return (
              <Button
                key={cat.id}
                variant={isActive ? "default" : "outline"}
                onClick={() => setActiveCategory(cat.id as ListProductsCategory)}
                className="gap-2 rounded-full shrink-0"
              >
                <Icon className="w-4 h-4" />
                {cat.label}
                <span className="ml-1 text-xs opacity-60">({cat.productCount})</span>
              </Button>
            );
          })}
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse bg-secondary/50 border-none h-[400px]" />
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {products.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                key={product.id}
              >
                <Card 
                  className="group cursor-pointer h-full flex flex-col border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.1)]"
                  onClick={() => setLocation(`/shop/${product.id}`)}
                >
                  <div className="aspect-square overflow-hidden relative">
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-background/80 backdrop-blur-md text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/10 text-foreground">
                        {product.category}
                      </span>
                    </div>
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <CardContent className="p-6 flex-grow flex flex-col">
                    <h3 className="text-2xl font-display text-foreground mb-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
                      <AddToCartButton product={product} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-24 glass-panel rounded-2xl">
            <h3 className="text-2xl font-display text-muted-foreground mb-4">No products found</h3>
            <p className="text-muted-foreground/70">Check back later for new releases.</p>
          </div>
        )}
      </div>
    </div>
  );
}
